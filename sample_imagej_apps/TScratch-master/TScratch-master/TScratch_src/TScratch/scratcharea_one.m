function [openarea, sheets, curth, itype, opentotmag] = scratcharea_one(im, levels, auto, opts)

% SCRATCHAREA_ONE   Analyze one image
%
%   [OA, SH, TH, TYPE, MAG] = SCRATCHAREA_ONE(IM, LEVS, AUTO, OPTS)
%   analyzes the image IM using curvelet levels LEVS and parameters in the
%   structure OPTS. If AUTO is non-zero, an automated threshold-finding
%   algorithm is applied, otherwise the default threshold
%   OPTS.DEFAULT_THRESH is used.
%   The returned values are the open area percentage OA and a binary image
%   SH with 1's for the covered area. TH is the threshold used, and TYPE
%   the type classification of the image. MAG is the curvelet magnitudes
%   used for area determination.
%   If OPTS is missing or empty, SCRATCH_GETDEFAULTOPTS is called to get
%   the default options. If AUTO is missing or empty, AUTO=1 is used as
%   default, and if LEVELS is missing or empty, LEVELS=4:5 is used.
%
%   The algorithm consists of computing the Mirror-extended curvelet
%   transform (see MEFCV2_VARIANT), extraction of curvelet magnitudes on
%   selected levels (see CRVLT_GETMAGNITUDEME), compensation for large
%   variation in background intensity (as measured by the coarsest curvelet
%   level), morphological opening of the image (see IMOPEN), automated
%   threshold detection, and thresholding and postprocessing by calling
%   SCRATCH_APPLYTHRESH.
%   
%   The sizes of SH and MAG are determined by the resolution on the finest
%   curvelet level used. 
%
%   TYPE can attain the following values:
%       1 if the threshold finding was successful
%       2 if no valley between peaks was found by the threshold finder
%       3 if the valley found was out of bounds (as set in OPTS)
%       4 if the threshold finder was successful, but the image was very
%           dark or very bright
%
%   See also: scratch_applythresh, mefcv2_variant, crvlt_getmagnitudeME,
%       imopen, scratch_getdefaultopts, scratcharea_dir
%

if nargin < 4 || isempty(opts),
    opts = scratch_getdefaultopts();
end
if nargin < 3 || isempty(auto),
    auto = 1;
end
if nargin < 2 || isempty(levels),
    levels = 4:5;
end

%im = imadjust(im);  % adjust so that 1% saturated at dark and bright ends


% use mirror-extended curvelets (non-periodic)
if exist('mefcv2_variant','file'),
    % use modified mirror-extended curvelets (faster)
    C = mefcv2_variant(double(im), levels);
else
    % use standard CurveLab 2.1.1 mirror-extended curvelets
    [m,n] = size(im);
    ns = ceil(log2(min(m,n)) - 3);
    nag = 16;
    C = mefcv2(double(im), m, n, ns, nag);
    C{1}{1} = fft2(C{1}{1}); % "bug" fix for ME curvelets
end
% get curvelet magnitudes
totmag = crvlt_getmagnitudeME(C, levels, 0);



if opts.bgscale,
    % rescale the curvelets to compensate for background intensity
    % variation
    scl = real(C{1}{1}(1:floor(end/2)+1, 1:floor(end/2)+1));
    scl = (scl + real(C{1}{1}(1:floor(end/2)+1, [1 end:-1:ceil(end/2)+1]))) * sqrt(numel(scl) / numel(im));

    scl = abs(0.6 - scl / 255);   % scale, enlarge away from mid intensity
    totmag = totmag .* (1 + 2*imresize(scl, size(totmag)));
end

% perform opening to produce "sheets"
opentotmag = imopen(totmag, strel('disk', opts.disk_radius));

if auto,
    % do automatic threshold determination
    
    % compute occupied area as function of threshold
    ths = 0:0.01:1;
    sha = zeros(size(ths));
    for k=1:length(ths),
        sheets = (opentotmag > max(opentotmag(:)) * ths(k));
        sha(k) = 1 - nnz(sheets)/numel(sheets);
    end
    
    % compute derivative of function, and smooth it
    dsha = diff(sha);
    mdsha = smooth(dsha, 15, 'rloess')'; 
    
    % compute threshold
    [itype, curth, yofs] = findthreshguess(ths(2:end), mdsha/max(mdsha(:)), opts.default_thresh, opts.advanced);
    if itype == 1,
        curth = curth + opts.thresh_offset;
        if opts.bgscale,
            if max(scl(:)) > opts.darkimg_thresh,
                itype = 4;  % intensity variations are large
            end
        end
    end
 
    if opts.prgopts.display_curve,
        figure(2), clf
        plot(ths(2:end), mdsha/max(mdsha), 'b')
        hold on
        plot(curth, yofs, 'r*')
    end
else
    curth = opts.default_thresh;
    itype = 0;
end


% apply the threshold, marking the covered area and computing the open
% image area fraction
[openarea, sheets] = scratch_applythresh(opentotmag, curth, opts);



% automatically find a threshold, and set type (type 1 == successful)
function [type, start, starty] = findthreshguess(ths, mdsha, defth, advopts)

% parameters
%distbmin = 0.03; % 1.e-8;
%bumpsize = 0.15; % 0.15;
%lolim = 0.12;    % 0.2;
%hilim = 0.50;    % 0.6;
%%lomaxHi = 0.25;  % 0.3;
%himaxLo = 0.4;   % 0.5;
%lomaxHeight = 0.3;
%maxminDiff = 0.1;

locmax = (mdsha > circshift(mdsha, [0 1])) & (mdsha > circshift(mdsha, [0 -1])) & ...
    (mdsha > circshift(mdsha, [0 2])) & (mdsha > circshift(mdsha, [0 -2]));
maxidx = find(locmax);
%[loM, loI] = max(mdsha .* (ths < advopts.lomaxHi) .* locmax);
topI = find(mdsha(maxidx) == 1);
loI = [];
for idx=maxidx(end:-1:1),
    if (idx == maxidx(topI) || (idx > 1 && idx < maxidx(topI) && min(mdsha(idx:maxidx(topI))) < mdsha(idx)-advopts.maxminDiff)) && ths(idx) < advopts.lomaxHi,
        loI = idx;
    end
end
loM = mdsha(loI);
        

locmin = (mdsha < circshift(mdsha, [0 1])) & (mdsha < circshift(mdsha, [0 -1])) & ...
    (mdsha < circshift(mdsha, [0 2])) & (mdsha < circshift(mdsha, [0 -2]));
minidx = find(locmin);


if isempty(loM),
    % no initial local maxima found
    type = 2;
    start = defth; 
    starty = mdsha(floor(defth*100));
elseif loM > advopts.lomaxHeight,
    % find local minimum between hogh and low maxima
    [hiM, hiI] = max(mdsha .* (ths > advopts.himaxLo) .* locmax);
      
    minval = min(mdsha .* locmin + ~locmin + 10 * double(ths < ths(loI)) + 10 * double(ths > ths(hiI)));
    if minval > loM - advopts.maxminDiff,
        % difference between max and min too small
        type = 2;
        start = defth;
        starty = mdsha(floor(defth*100));
    else
        % find local minimum within DIFF_FROM_MIN from "global" min, or
        % with a maximum of height BUMP_SIZE following it
        type = 1;
        J = 1;
        while J < length(minidx) && (minidx(J) < loI || ...
            ((mdsha(minidx(J)) > minval + advopts.diff_from_min) && ...
             ~(mdsha(min(maxidx(maxidx > minidx(J)))) > mdsha(minidx(J)) + advopts.bump_size))),
            J = J+1;
        end

        start = ths(minidx(J));
        starty = mdsha(minidx(J));
        % check if inside allowed range
        if start < advopts.lolim || start > advopts.hilim,
            type = 3;
            start = defth;
            starty = mdsha(floor(defth*100));
        end
    end
else
    % first maximum is too small
    type = 2;
    start = defth; 
    starty = mdsha(floor(defth*100));
end

