function d1 = ipticondir

% IPTICONDIR    Returns directory for icons used by IMTOOL
%
%   D1 = IPTICONDIR is a simple hack to get the TScratch program to find the
%   polygon-point icon 'point.png' needed by IMPOLY, even when the program
%   is compiled as a standalone program. This function makes IMPOLY look in
%   the current directory, which should contain the file 'point.png'.
%
%   See also: images/imuitools/ipticondir, imtool, impoly
%


d1 = '.';