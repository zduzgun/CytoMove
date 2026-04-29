function [groupdata, tokens, dirnames, t0diridx] = ...
    writemultidata(filedata, dirdata, filename, analysisdir, params)

% WRITEMULTIDATA    Write results for TScratch from a time-series analysis
%
% [GDATA,TOK,DIRS,T0IDX] = WRITEMULTIDATA(FDATA,DIRDATA,FNAME,OUTDIR,OPTS)
%   generates open wound area values for the TScratch program, using the
%   filedata structure FDATA and the dirdata structure DIRDATA (see
%   scratchassay.m). Output is written to the file FNAME. ANALYSISDIR
%   should contain the top directory for which the analysis was made, and
%   PARAMS should contain the OPTS structure with the parameters used for
%   the analysis.
%   The variable GDATA contains means, standard deviations, numbers of
%   images and standard errors of the mean for each of the image groups and
%   each of the time-points.
%   TOK contains the names of each of the image groups (the first common
%   characters, up to the first space or underscore character.
%   DIRS contains the names of the subdirectories for the different
%   time-points, and T0IDX is the index into DIRS of the first time-point
%   directory.
%
%   Images in the different directories (i.e. for different time-points),
%   are matched according to their filenames, and quotients are computed as
%   [later timepoint] / [first timepoint]. If no match is found, no
%   quotient is computed. The matching is case-insensitive, but otherwise
%   requires exact matches.
%
%   Groups are formed according to the initial part of filenames, up to the
%   first space or underscore character, and for each group the open wound
%   area quotients are collected and means, standard deviations, number of
%   included images and standard errors of the mean are computed. Again,
%   matching is case-insensitive but otherwise requires exact matches.
%   GDATA{dirn}(grn,:) contains this data for subdirectory DIRS{dirn} and
%   the group named TOK{grn}.
% 
%   If an error occurs, GDATA is a negative scalar, with value -1 if the
%   file FNAME could not be opened, and -2 if there was an error writing to
%   the file.
%
%   See also: scratchassay, scratch_getdefaultopts
%

ndir = length(dirdata.fileidx);
dd = [dirdata.fileidx length(filedata)+1];

% extract directory names
dirnames = cell(1,ndir);
for k=1:ndir,
    slidx = strfind(filedata(dd(k)).name, filesep);
    if slidx > 1,
        dirnames{k} = filedata(dd(k)).name(1:slidx-1);
    else
        dirnames{k} = '';
    end
end

% find indices and file names
tdirs = setdiff(1:ndir, dirdata.t0diridx);

t0fileidx = dd(dirdata.t0diridx):dd(dirdata.t0diridx+1)-1;
t0files = {filedata(t0fileidx).name}';

% remove directories and extensions from t0 names, find group tokens
tokens = {};
groupid = zeros(length(t0files),1);
for fi=1:length(t0files),
    [pt, nm] = fileparts(t0files{fi});
    nm = lower(nm);   % make lowercase
    t0files{fi} = nm;
    
    tok = strtok(nm, ' _');  % find part of file name until first space or _
    for ti=1:length(tokens),
        if isequal(tok, tokens{ti}),
            groupid(fi) = ti;
            break
        end
    end
    if groupid(fi) == 0,
        tokens{end+1} = tok;
        groupid(fi) = length(tokens);
    end
end

% match filenames and compute quotients
tsdata = -ones(length(t0files), 2*ndir - 1);
tsdata(:,1) = [filedata(t0fileidx).openarea]';
tsallowed = false(length(t0files), 2*ndir - 1);
tsallowed(:,1) = [filedata(t0fileidx).type]' > 0;
tsnames = t0files;

t0files = lower(t0files);
for k=tdirs,
    colidx = 1 + find(tdirs == k);
    for fi=dd(k):dd(k+1)-1,
        [pt, nm] = fileparts(filedata(fi).name);
        m = strmatch(lower(nm), t0files);
        if isempty(m),
            tsnames{end+1} = nm;
            tsdata(end+1, :) = -ones(1, 2*ndir - 1);
            tsdata(end, colidx) = filedata(fi).openarea;
            tsallowed(end+1, :) = zeros(1, 2*ndir-1);
            tsallowed(end, colidx) = filedata(fi).type > 0;
        else
            if length(m) > 1, 
                m = m(1);  % just in case, should not happen...
            end
            tsdata(m, colidx) = filedata(fi).openarea;
            tsdata(m, colidx + ndir - 1) = filedata(fi).openarea / filedata(m + dd(dirdata.t0diridx) - 1).openarea;
            tsallowed(m, colidx) = filedata(fi).type > 0;
            if m <= length(t0fileidx),
                tsallowed(m, colidx + ndir - 1) = (filedata(fi).type > 0 && filedata(t0fileidx(m)).type > 0);
            end
        end
    end
end

% compute means etc for all groups
groupdata = cell(length(tdirs),1);
for k=1:length(groupdata),
    groupdata{k} = zeros(length(tokens), 4);
end
data = cell(length(tokens), 1);
ttests = cell(length(tdirs), 1);
for k=1:length(groupdata),
    colnr = k + ndir;
    ttests{k} = zeros(length(tokens));
    for ti = 1:length(tokens),
        data{ti} = tsdata(groupid==ti & tsallowed(1:length(t0files), colnr), colnr);
        groupdata{k}(ti, 1) = mean(data{ti});
        groupdata{k}(ti, 2) = std(data{ti});
        groupdata{k}(ti, 3) = length(data{ti});
        groupdata{k}(ti, 4) = groupdata{k}(ti, 2) / sqrt(groupdata{k}(ti,3)); % Standard error of the mean
        
        for si = 1:ti,
            if length(data{ti}) == 1 || length(data{si}) == 1,
                Pval = NaN;
            else
                [Hyp,Pval] = ttest2(data{ti},data{si},0.01,'both','unequal');
            end
            ttests{k}(si,ti) = Pval;
        end
    end
end

% write data to file
% open file
fh = fopen(filename,'wt');
if fh==-1,
    groupdata = -1;
    return
end

% write column titles
fprintf(fh, 'File\t%s', dirnames{dirdata.t0diridx});
for k=tdirs,
    fprintf(fh, '\t%s', dirnames{k});
end
for k=tdirs,
    fprintf(fh, '\t%s vs. %s', dirnames{k}, dirnames{dirdata.t0diridx});
end
fprintf(fh, '\n');

% write data
for k=1:length(tsnames),
    fprintf(fh, '%s', tsnames{k});
    
    for j=1:size(tsdata, 2),
        if tsdata(k,j) >= 0 && tsallowed(k,j),
            fprintf(fh, '\t%f', 100*tsdata(k,j));
        else
            fprintf(fh, '\t');
        end
    end
    fprintf(fh, '\n');
end
fprintf(fh, '\n');

% write group data (means, std, etc)
% write headers
fprintf(fh, 'Groups');
for k=tdirs,
    fprintf(fh, '\t%s vs. %s\t\t\t', dirnames{k}, dirnames{dirdata.t0diridx});
end
fprintf(fh, '\n');
fprintf(fh, 'Name');
for k=tdirs,
    fprintf(fh, '\tMean\tStdev\tN\tSEM');
end
fprintf(fh, '\n');

% now names and data
for ti=1:length(tokens),
    fprintf(fh, '%s', tokens{ti});
    for k=1:length(tdirs),
        if groupdata{k}(ti,3) > 0,  % need at least one value to write means
            fprintf(fh, '\t%.6f\t%.6f\t%d\t%.6f', ...
                100*groupdata{k}(ti,1), 100*groupdata{k}(ti,2), groupdata{k}(ti,3), 100*groupdata{k}(ti,4));
        else
            fprintf(fh, '\t \t \t0\t ');
        end
    end
    fprintf(fh, '\n');
end

% And now t-test results
fprintf(fh, '\nT-tests (P-values)\n');
for k = 1:length(tdirs),
    fprintf(fh, '%s\t', dirnames{k});
    for ti = 1:length(tokens),
        fprintf(fh, '%s\t', tokens{ti});
    end
    fprintf(fh, '\t\t');
end
fprintf(fh, '\n');

for ti = 1:length(tokens)
    for k = 1:length(tdirs),
        fprintf(fh, '%s\t', tokens{ti});
        for si = 1:ti,
            fprintf(fh, '%.4g\t', ttests{k}(si,ti));
        end
        for si = ti+1:length(tokens),
            fprintf(fh,'\t');
        end
        fprintf(fh,'\t');
    end
    fprintf(fh, '\n');
end


% Print file information
fprintf(fh, '\n\nGenerated by the TScratch program (www.cse-lab.ethz.ch) on %s,\n', date);
fprintf(fh, 'for the directory %s.\n\n', analysisdir);

fprintf(fh, 'All values (except N and P-values) are given in percent.\n\n');

fprintf(fh, 'Parameters used:\n');
fprintf(fh, 'Default threshold:\t%.3f\n', params.default_thresh);
fprintf(fh, 'Disk radius:\t%d\n', params.disk_radius);
fprintf(fh, 'Smallest island size:\t%.3f\n', params.island_area);
fprintf(fh, 'Largest hole size:\t%.3f\n', params.hole_area);
fprintf(fh, 'Erosion size:\t%d\n', params.erode_size);
if params.bgscale,
    tstr = 'Used';
else
    tstr = 'Did not use';
end
fprintf(fh, '%s background compensation.\n', tstr);

[msg, err] = ferror(fh);
if err
    groupdata = -2;
    fclose(fh)
    return
end

fclose(fh);

t0diridx = dirdata.t0diridx;

