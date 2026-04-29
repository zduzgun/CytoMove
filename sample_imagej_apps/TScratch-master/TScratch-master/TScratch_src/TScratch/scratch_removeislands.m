function nsh = scratch_removeislands(sheets, fraction)

% SCRATCH_REMOVEISLANDS     Remove isolated closed areas in analyzed image
%
% NSH = SCRATCH_REMOVEISLANDS(SH, FRAC) removes isolated closed areas (with
% non-zero value) in the binary image SH, if they are smaller than the
% fraction FRAC of the largest closed area in the image. 
% NSH is equal to SH, but with zeros in place of the removed islands.
% 
% See also: scratch_applythresh, scratcharea_one, scratch_fillholes
%

% find all connected closed areas, and measure their size
nsh = sheets;
[lbl, N] = bwlabel(sheets);
nzl = zeros(1,N);
for k=1:N,
    nzl(k) = nnz(lbl == k);
end

% remove areas smaller than FRACTION of the largest area
maxnz = max(nzl);
for k=1:N,
    if nzl(k) < fraction * maxnz,
        nsh(lbl == k) = 0;
    end
end

