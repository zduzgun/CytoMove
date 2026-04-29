function opts = scratch_getdefaultopts(default)

% SCRATCH_GETDEFAULTOPTS    Get default parameters for TScratch program
%
%   OPTS = SCRATCH_GETDEFAULTOPTS tries to find the file 'scratchopts.mat'
%   in the current directory, or on the path, and loads the variable OPTS
%   from this file. If the file is not found, or the variable OPTS does not
%   exist in the file, default values for parameters are used.
%
%   OPTS = SCRATCH_GETDEFAULTOPTS(DEFAULT) with DEFAULT = 1 forces the use
%   of default values, and does not look for the file.
%
%   See also: scratchsettings
%

if nargin < 1
    default = 0;
end

if ~default,
    try 
        S = load('scratchopts.mat');
    catch ME, % catch and ignore all errors
        
    end
    if exist('S', 'var') && isfield(S, 'opts'),  % if load was successful, return loaded options
        opts = S.opts;
        if ~isfield(opts.prgopts, 'allowedext'),
            opts.prgopts.allowedext = {'.jpg','.tif','.gif','.bmp','.png'};
        end
        return
    end
end


% get default values

prgopts = struct('write_imgs', 1, ...           % write analysed images
    'skip_catmode', 0, ...                      % skip the category mode
    'display_curve', 0, ...                     % display the threshold finding curve
    'analyzed_dir', 'Analyzed', ...             % subdirectory for analyzed images and data
    'allowedext', {{'.jpg','.tif','.gif','.bmp','.png'}});  % allowed extensions for image files

advopts = struct('diff_from_min', 0.03, ...     % maximum difference from min-value
    'bump_size', 0.11, ...                      % accepted size of local min valley
    'lolim', 0.08, ...                          % lower threshold limit
    'hilim', 0.50, ...                          % upper threshold limit
    'lomaxHi', 0.25, ...                        % upper limit for first maximum
    'himaxLo', 0.4, ...                         % lower limit for second maximum
    'lomaxHeight', 0.3, ...                     % min height of first maximum
    'maxminDiff', 0.1);                         % minimum difference between min and first max

opts = struct('prgopts', prgopts, ...
    'default_thresh', 0.25, ...                 % threshold if automated finding fails
    'disk_radius', 7, ...                       % disk radius for opening
    'erode_size', 2, ...                        % size for erosion of the marked covered area
    'thresh_offset', 0.0, ...                   % offset for automated threshold
    'hole_area', 0.07, ...                      % max hole area to fill (fraction of largest open area)
    'island_area', 0.07, ...                    % max island area to remove (fraction of largest closed area)
    'darkimg_thresh', 0.4, ...                  % threshold to consider image as high intensity variation img (type 4) 
    'bgscale', 1, ...                           % use background compensation?
    'advanced', advopts);                       % advanced options - see above
