% CRVLT_GETMAGNITUDEME Get magnitude of mirror-extended curvelet coefficients
%   
%   MAG = CRVLT_GETMAGNITUDEME(C, LEVS) extracts the sum of magnitudes of
%   the mirror-extended curvelet coefficients in the data structure C (as
%   returned by MEFCV2_VARIANT), summing over the levels specified in the
%   vector LEVS (1-based indices). The magnitudes are returned in MAG,
%   which is a matrix with the same dimensions as the largest dimensions on
%   the finest level specified in LEVS. If LEVS contains indices outside
%   range of levels in C, an error is generated.
%
%   MAG = CRVLT_GETMAGNITUDEME(C, LEVS, CSIZE) also averages over the
%   nearest (in position) CSIZE curvelet coefficients in all directions. A
%   value of 1 for CSIZE (the default) thus averages over coefficients one
%   step up, down, left and right to compute the magnitude for each
%   position.
%
%   See also: MEFCV2_VARIANT
%
