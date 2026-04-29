function [openarea, sheets, curth] = scratcharea_reanalyze(matfilename, newthresh, opts, rewrite)

% SCRATCHAREA_REANALYZE     Reanalyze an image using saved data 
%
%   [OA,SH,TH] = SCRATCHAREA_REANALYZE(FILENAME) opens the matfile
%   FILENAME, containing variables OPENTOTMAG, THRESH and ITYPE, and calls 
%   SCRATCH_APPLYTHRESH to analyze the image with these values and the
%   default options (see SCRATCH_GETDEFAULTOPTS). OA is the resulting open
%   image area, SH is a binary image showing the closed areas and TH is the
%   threshold that was used.
%
%   [OA,SH,TH] = SCRATCHAREA_REANALYZE(FILENAME, NEWTH) instead uses the
%   threshold NEWTH.
%
%   [OA,SH,TH] = SCRATCHAREA_REANALYZE(...,OPTS,REWRITE) additionally uses
%   the parameters in the OPTS structure, and if REWRITE is non-zero,
%   rewrites the MAT-file FILENAME with the new threshold. If OPTS is
%   empty, default parameters are used. Use an empty matrix as placeholder
%   if NEWTH is not specified.
%
%   See also: scratch_applythresh, scratch_getdefaultopts, scratcharea_one,
%       makedatafilename.
%

if nargin < 4,
    rewrite = 0;
end
if nargin < 3 || isempty(opts),
    opts = scratch_getdefaultopts();
end

load(matfilename);
if nargin < 2 || isempty(newthresh),
    curth = thresh;
else
    curth = newthresh;
end

[openarea, sheets] = scratch_applythresh(opentotmag, curth, opts);

if rewrite,
    thresh = curth;
    save(matfilename, 'opentotmag', 'thresh', 'itype');
end
