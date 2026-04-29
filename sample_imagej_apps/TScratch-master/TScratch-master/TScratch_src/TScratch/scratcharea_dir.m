function [opar, files, ths, types] = scratcharea_dir(fpath, opts, ...
    nraddfiles, outdir, showres, auto, plotaxes, infobox, hquit)

%
% SCRATCHAREA_DIR Analyze scratch assay images in a directory
%
%   [OPENAREA, FILES] = SCRATCHAREA_DIR(FPATH, OPTS, NRADD, OUTDIR, SHOWRES) 
%   searches the path FPATH (which could include wildcards and extensions, 
%   such as *.jpg to exclude unwanted files) and analyzes all the images 
%   found. By default the function looks for the extensions specified in 
%   OPTS (see SCRATCH_GETDEFAULTOPTS), but any file that can be read by 
%   IMREAD could be specified. 
%   Results are written in the MATLAB window for each file.
%   The analyzed image is written with an overlay indicating the measured
%   area in the directory OUTDIR (relative to FPATH) with the filename
%   returned by MAKEANALIMGFILENAME, and analysis data is written to the
%   file returned by MAKEDATAFILENAME. Set OUTDIR to '' to disable all
%   file output. If SHOWRES is non-zero, the results for each file are shown
%   in a figure window (the default).
%   OPENAREA is a column vector containing the estimated open area for each
%   image, and FILES is a structure array containing info about all the
%   image files, as returned by DIR. For example, FILES(K).name contains
%   the filename of file number K.
%
%   [OPENAREA, FILES, THS, TYPES] = SCRATCHAREA_DIR(FPATH, NRADD, ...)
%   also outputs a column vector THS with the threshold used for each image
%   and a column vector TYPES with the analysis types of the images (see
%   SCRATCHAREA_ONE for possible values).
%
%   OPENAREA = SCRATCHAREA_DIR(...,AUTO,OPTS,PLOTAXES,INFOBOX,HQUIT)
%   gives the parameters AUTO and OPTS to be used for the
%   analysis. If AUTO is 1, automatic threshold determination is used (the
%   default). For parameters in the OPTS struct, see
%   SCRATCH_GETDEFAULTOPTS, which is also called for default values. If
%   PLOTAXES is non-empty (and SHOWRES is non-zero), results are shown in
%   the axes object with the handle PLOTAXES, or alternating between
%   handles if PLOTAXES is a vector. If INFOBOX is a handle to a UICONTROL,
%   its 'String' property is updated after each analyzed image with the 
%   remaining time for the analysis - if NRADD is non-zero, this value is
%   added to the number of images remaining in the time-estimate. If HQUIT
%   is a handle, the function checks this objects 'UserData' property
%   regularly, and quits if this value is non-zero, then returning an empty
%   vector OPENAREA.  
%
%   If errors occur while reading or writing files, an exception is thrown.
%
%   Specify an empty matrix as a placeholder to use default values.
%
%   The parameters used in the OPTS structre are:
%       prgopts.write_imgs : if zero, disables writing of images (but not
%           data files) 
%       (see also SCRATCHAREA_ONE for more parameters used)
% 
%   Examples
%     To analyze all TIFF-images in the directory '/Images', write the
%     analyzed images to the directory '/Images/Analyzed' (as
%     filename_analyzed.tif), and show the resulting image directly after
%     it has been analyzed, and finally write a table with the results:
%
%       [oparea, files] = scratcharea_dir('/Images/*.tif',[],'Analyzed',1);
%       for k=1:length(files),
%           disp(sprintf('%s\t%f', files(k).name, oparea(k)))
%       end
%
%     To set automatic threshold determination, while
%     suppressing output and display of analyzed images:
%
%       [oparea, files] = scratcharea_dir('Images/*.tif',[],'',0,1);
%
%     See also: scratcharea_one, scratcharea_multidir, dir, 
%       scratch_getdefaultopts
%


% check input arguments
if nargin < 1,
    error('Too few input arguments given to SCRATCHAREA_DIR, at least one needed!')
end

% set default values for empty parameters
if nargin < 9,
    hquit = [];
end
if nargin < 8,
    infobox = [];
end
if nargin < 7,
    plotaxes = [];
end
if nargin < 6 || isempty(auto),
    auto = 1;
end
if nargin < 5 || isempty(showres),
    showres = 1;
end
if nargin < 4,
    outdir = [];
end
if nargin < 3 || isempty(nraddfiles),
    nraddfiles = 0;
end
if nargin < 2 || isempty(opts),
    opts = scratch_getdefaultopts();
end
    
% find files and directory part of path
curpath = fileparts(fpath);
if isdir(fpath),
    % no extension specified, look for allowed extensions
    if fpath(end) ~= filesep,
        fpath = [fpath filesep];
    end
    files = [];
    for k = 1:length(opts.prgopts.allowedext),
        files = [files; 
            dir(fullfile(fpath, ['*' opts.prgopts.allowedext{k}]))];
        if ~ispc,  % on non-windows platforms, look also for uppercase extensions
            files = [files; 
                dir(fullfile(fpath, ['*' upper(opts.prgopts.allowedext{k})]))];
        end
    end
else
    files = dir(fpath);
end


% create output directory
if ~isempty(outdir) && ~isempty(files),
    if ~strcmp(outdir, '.') && ~strcmp(outdir, '..'),
        if ~exist([curpath filesep outdir],'dir'),
            mkdir(curpath, outdir);
        end
    end
end

% Initialize result arrays
opar = zeros(length(files), 1);
ths = zeros(length(files), 1);
types = zeros(length(files), 1);
axidx = 1;

totaltime = 0;
% loop through files and analyze
for k=1:length(files),
    if ~isempty(hquit) && get(hquit, 'UserData'),
        opar = [];
        break;
    end
    tic
    
    % load image
    try
        im = imread([curpath filesep files(k).name]);
    catch ME
        disp(sprintf('Error reading file ''%s''. %s', files(k).name, ME.message))
        ME2 = MException('TScratch:ReadError', sprintf('Error reading file ''%s''.', files(k).name));
        ME2 = addCause(ME2, ME);
        for j=1:length(ME.cause),
            ME2 = addCause(ME2, ME.cause{j});
        end
        throw(ME2)
    end
    im = im(:,:,1);
    [pt, nm, ext] = fileparts(files(k).name); 
    
    % choose curvelet levels
    nlev = floor(log2(min(size(im))) - 3);  % # curvelet levels for this image
    levels = ceil(nlev/2) + [0 1];         % default levels to use
    
    % analyze image
    try
        [opar(k), sheets, ths(k), types(k), opentotmag] = scratcharea_one(im, levels, auto, opts);
    catch ME
        disp(sprintf('Error analyzing file ''%s''. %s', files(k).name, ME.message))
        ME2 = MException('TScratch:AnalyzeError', sprintf('Error analyzing file ''%s''.', files(k).name));
        ME2 = addCause(ME2, ME);
        throw(ME2)
    end
    
    % compute image with overlay
    if showres || (~isempty(outdir) && opts.prgopts.write_imgs),
        combined_im = uint8(double(im)/double(max(im(:))) * 191 + 64*imresize(sheets, size(im), 'nearest'));
        
        cmap = repmat(linspace(0,1,256)', [1 3]);
    end
    
    % show resulting image
    if showres,
        if isempty(plotaxes),
            figure(1), clf
        else
            axes(plotaxes(axidx)), cla
            axidx = mod(axidx, length(plotaxes)) + 1;
        end
        image(combined_im), colormap(cmap), axis equal tight off
        title(sprintf('%s, open area = %.2f %%', nm, opar(k)*100), 'Interpreter', 'none');
        drawnow
    end
    
    % write analyzed image (with covered area overlay), and data
    if ~isempty(outdir),
        try
            if opts.prgopts.write_imgs,
                apath = makeanalimgfilename(curpath, files(k).name, outdir);      
                imwrite(combined_im, cmap, apath);
            end
        catch ME
            disp(sprintf('Error writing image file %s. %s', apath, ME.message))
        end
      
        try
            thresh = ths(k);
            itype = types(k);
            datafname = makedatafilename(curpath, nm, outdir);
            save(datafname, 'opentotmag', 'thresh', 'itype');
        catch ME
            disp(sprintf('Error writing data file ''%s''. %s', datafname, ME.message))
            ME2 = MEexception('TScratch:WriteError', sprintf('Error writing data file ''%s''.', datafname));
            ME2 = addCause(ME2, ME);
            throw(ME2)
        end
    end
    
    % print results on screen
    disp(sprintf('%s\t%f\t%d\t%f', nm, opar(k), types(k), ths(k)));
    
    totaltime = totaltime + toc;
    if ishandle(infobox),
        secrem = ceil(totaltime / k * (length(files) - k + nraddfiles));
        if secrem > 60,
            set(infobox, 'String', sprintf('Running. %d min %d s remaining.', floor(secrem / 60), mod(secrem, 60) ));
        else
             set(infobox, 'String', sprintf('Running. %d s remaining.',  secrem));
        end
        drawnow('update')
    end
end
