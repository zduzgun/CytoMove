function [openarea, sheets] = scratch_applythresh(opentotmag, thresh, opts)

% SCRATCH_APPLYTHRESH   Apply thresholding and postprocessing to image
%
%   [OA, SH] = SCRATCH_APPLYTHRESH(OTOTMAG, THRESH, OPTS) applies the
%   threshold THRESH to the (opened) curvelet magnitude image OTOTMAG, and
%   postprocesses the thresholded image according to options OPTS. 
%   The postprocessing consists of erosion (using BWMORPH), filling of
%   holes (using SCRATCH_FILLHOLES) and removal of islands (using
%   SCRATCH_REMOVEISLANDS). The output OA is the open image area fraction,
%   and SH is a binary image with ones in the closed area. SH has the size
%   of OTOTMAG.
%
%   See also: scratcharea_one, scratch_fillholes, scratch_removeislands,
%       bwmorph, scratch_getdefaultopts
%

% do thresholding
sheets = (opentotmag > max(opentotmag(:)) * thresh);

% erode sheets, first adding margins that will be eroded away
if ~isfield(opts,'erode_size'),
   opts.erode_size = 2; 
end
es = opts.erode_size;
sheetsmod = [ones(es, size(sheets, 2) + 2*es); ...
    ones(size(sheets, 1), es) sheets ones(size(sheets, 1), es); ...
    ones(es, size(sheets, 2) + 2*es)];
sheetsmod = bwmorph(sheetsmod, 'erode', es);
sheets = sheetsmod(es+1:end-es, es+1:end-es);

% fill holes (if < fraction of largest open area)
sheets = scratch_fillholes(sheets, opts.hole_area);

% remove islands (if < fraction of largest closed area)
sheets = scratch_removeislands(sheets, opts.island_area);

% compute open area
openarea = 1 - nnz(sheets) / numel(sheets);

