function afile = makeanalimgfilename(curdir, filename, outdir)

% MAKEANALIMGFILENAME   Create filename for the analyzed image
%
%   AFILE = MAKEANALIMGFILENAME(CURDIR, FILENAME, OUTDIR) creates the
%   analyzed image file name from an original image file name FILENAME,
%   located in the directory CURDIR. The resulting filename AFILE will be
%   of the form 'CURDIR/OUTDIR/FILENAME_analyzed.EXT', where EXT is the
%   extension part of FILENAME. 
%   If FILENAME contains a directory part, it will be included between
%   CURDIR and OUTDIR.  
%   If OUTDIR is not supplied or is empty, a default value of 'Analyzed'
%   will be used. 
%   MAKEANALIMGFILENAME uses FILEPARTS to separate the directory, file and
%   extension parts of FILENAME, and uses FULLFILE to combine the parts to
%   the filename AFILE, so the procedure is platform independent.
% 
%   See also: fileparts, fullfile, makedatafilename
%

if nargin < 3,
    outdir = '';
end
if isempty(outdir),
    outdir = 'Analyzed';
end

[pt, nm, ext] = fileparts(filename);
afile = fullfile(curdir, pt, outdir, [nm '_analyzed' ext]);
