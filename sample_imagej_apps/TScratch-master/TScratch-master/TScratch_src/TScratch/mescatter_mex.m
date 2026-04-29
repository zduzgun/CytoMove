% MESCATTER_MEX     Data distribution for mirror-extended curvelets
%
% B = MESCATTER_MEX(A, NUMEX, TRANSP) mirrors the values in matrix A
% correctly for the mirror-extended curvelet transform. The size of B is
% [2*(M + NUMEX), N], where [M,N] = SIZE(A). If TRANSP is non-zero, the
% transpose of A is used instead of A, and the size of B becomes [M, 2*(N +
% NUMEX)].
% Called by MEFCV2_VARIANT.
%
% See also: MEFCV2_VARIANT
%
