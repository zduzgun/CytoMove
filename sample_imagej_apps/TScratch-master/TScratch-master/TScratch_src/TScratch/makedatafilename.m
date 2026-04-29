function dfile = makedatafilename(curdir, filename, datadir)

% MAKEDATAFILENAME  Create a filename for the image data file for TSCratch
%
%   DFILE = MAKEDATAFILENAME(CURDIR, FILENAME, DATADIR) creates the
%   datafile (MAT-file) name from the image filename FILENAME, located in
%   the directory CURDIR. The resulting filename DFILE will be of the form
%   'CURDIR/OUTDIR/FILENAME_data.MAT'. 
%   If FILENAME contains a directory part, it will be included between
%   CURDIR and OUTDIR.  
%   If OUTDIR is not supplied or is empty, a default value of 'Analyzed'
%   will be used. 
%   MAKEDATAFILENAME uses FILEPARTS to separate the directory and file
%   parts of FILENAME, and uses FULLFILE to combine the parts to the
%   filename AFILE, so the procedure is platform independent. 
% 
%   See also: fileparts, fullfile, makeanalimgfilename
%

if nargin < 3,
    datadir = '';
end
if isempty(datadir),
    datadir = 'Analyzed';
end

[pt, nm] = fileparts(filename);
dfile = fullfile(curdir, pt, datadir, [nm '_data.mat']);
