% CVWINDOW_MEX frequency window for curvelets
%
%   W = CVWINDOW_MEX(X, LOLIM, LOW, HILIM, HIW) returns values W for the
%   curvelet frequency filter for the frequencies X. The filter is uniquely
%   defined by the low-end limit and width LOLIM and LOW, and the high-end
%   limit and width HILIM and HIW. These are all scalars.
%   W has the same size as X and contains values in [0,1].
%   This function is called by MEFCV2_VARIANT.
%
%   See also: MEFCV2_VARIANT
%
