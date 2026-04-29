function [oas, subdirs, files, ths, types] = scratcharea_multidir(dirname, opts, varargin)

% SCRATCHAREA_MULTIDIR
%
%   [OAS,SUBDIRS,FILES,THS,TYPES] = SCRATCHAREA_MULTIDIR(DIRNAME, OPTS, VARARGIN)
%   scans subdirectories of DIRNAME and calls SCRATCHAREA_DIR for all that
%   contain image files, returning cell arrays of data, with one cell per
%   directory. Uses options in OPTS.
%   OAS is the measured open areas in a column vector for each subdirectory.
%   SUBDIRS contains the names of the analyzed directories
%   FILES contains info about the analyzed files, as returned by DIR.
%   THS contains the thresholds used for all files.
%   TYPES contains the analysis type for each image (see SCRATCHAREA_ONE
%   for possible values).
%   Any extra input arguments are passed as argument 3 and onwards to
%   SCRATCHAREA_DIR.
%
%   If SCRATCHAREA_DIR returns an empty openarea vector, indicating that
%   the analysis was cancelled, an empty cell array OAS is returned.
%
%   If any error occurs, an exception is thrown.
%
%   Example:
%       [oas,subdirs,files,ths,types] = scratcharea_multidir('/TheDir/');
%       for dirn=1:length(oas),
%           disp(['Directory: ' subdirs{dirn}])
%           for imn=1:length(oas{dirn}),
%               disp(sprintf('%s\t%.2f\t%.2f\t%d', ...
%                   files{dirn}(imn).name, oas{dirn}(imn), ths{dirn}(imn), 
%                   types{dirn}(imn));
%           end
%       end
%       prints a table with the results for all images in all directories.
%
%   See also: scratcharea_dir, scratcharea_one, dir
    

if nargin == 0,
    error('Too few arguments given to scratcharea_multidir! At least a directory is needed.');
elseif nargin == 1,
    opts = scratch_getdefaultopts;
end

filenames = dir(dirname);

% find all subdirectories
cnt = 0;
for k=1:length(filenames),
    if filenames(k).isdir && filenames(k).name(1) ~= '.',
        cnt = cnt + 1;
        subdirs{cnt} = filenames(k).name;
    end
end

% count image files in subdirectories
ndirs = length(subdirs);
nfiles = zeros(1,ndirs);
for k=1:ndirs,
    df = dir(fullfile(dirname, subdirs{k}));
    for fi = 1:length(df),
        [pt,nm,ext] = fileparts(df(fi).name);
        % count files not starting with . and with allowed extensions
        % (ignoring case)
        if ~df(fi).isdir && df(fi).name(1) ~= '.' && ...
            any(strcmpi(ext, opts.prgopts.allowedext)),
            nfiles(k) = nfiles(k) + 1;
        end
    end
end

% remove empty directories
nonemptydiridx = setdiff(1:length(nfiles), find(nfiles == 0));
subdirs = {subdirs{nonemptydiridx}};
nfiles = nfiles(nonemptydiridx);
ndirs = length(subdirs);

% compute remaining number of files after each dir
remfiles = [fliplr(cumsum(fliplr(nfiles))) 0];

% do analysis for each dir
oas = cell(1, ndirs);
files = cell(1,ndirs);
ths = cell(1,ndirs);
types = cell(1, ndirs);
for k=1:ndirs,
    try
        [oas{k}, files{k}, ths{k}, types{k}] = scratcharea_dir(fullfile(dirname, [subdirs{k} filesep]), opts, remfiles(k+1), varargin{:});
    catch ME
        disp(sprintf('Error analyzing subdirectory ''%s''.', subdirs{k}))
        ME2 = MException('TScratch:SubdirError', sprintf('Error analyzing subdirectory ''%s''.', subdirs{k}));
        ME2 = addCause(ME2, ME);
        for j=1:length(ME.cause),
            ME2 = addCause(ME2, ME.cause{j});
        end            
        throw(ME2);
    end
    if isempty(oas{k}) && ~isempty(files{k}),
        oas = {};
        return;
    end
end
