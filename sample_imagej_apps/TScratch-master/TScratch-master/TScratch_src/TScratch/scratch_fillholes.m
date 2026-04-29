function nsh = scratch_fillholes(sheets, fraction)

% SCRATCH_FILLHOLES     Fill isolated holes in an analyzed image
%
% NSH = SCRATCH_FILLHOLES(SH, FRAC) fills isolated holes (connected areas
% of zero value) in the binary image SH, if they are smaller than the
% fraction FRAC of the largest open area in the image.
% NSH is equal to SH, but with ones in place of the filled holes
%
% See also: scratch_applythresh, scratch_removeislands, scratcharea_one,
%

% Find all open areas and measure their size
nsh = sheets;
[lbl, N] = bwlabel(~sheets);
nzl = zeros(1,N);
for k=1:N,
    nzl(k) = nnz(lbl == k);
end

% Remove open areas smaller than FRACTION of largest open area
maxnz = max(nzl);
for k=1:N,
    if nzl(k) < fraction * maxnz,
        nsh(lbl == k) = 1;
    end
end





