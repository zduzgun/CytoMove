function varargout = scratchassay(varargin)
% SCRATCHASSAY M-file for scratchassay.fig and the TScratch program
%      SCRATCHASSAY, by itself, creates a new SCRATCHASSAY or raises the existing
%      singleton*.
%
%      H = SCRATCHASSAY returns the handle to a new SCRATCHASSAY or the handle to
%      the existing singleton*.
%
%      SCRATCHASSAY('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in SCRATCHASSAY.M with the given input arguments.
%
%      SCRATCHASSAY('Property','Value',...) creates a new SCRATCHASSAY or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before scratchassay_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to scratchassay_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
%      SCRATCHASSAY is the main M-file for the TScratch GUI. Run this file
%      to start the GUI. All other M-files in the TScratch project are
%      called from this file, and this file contains all Callback functions
%      for the GUI.
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help scratchassay

% Last Modified by GUIDE v2.5 26-Jun-2008 14:06:42

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @scratchassay_OpeningFcn, ...
                   'gui_OutputFcn',  @scratchassay_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before scratchassay is made visible.
function scratchassay_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to scratchassay (see VARARGIN)

handles.dirname = [];
handles.t0dirname = [];
handles.version = 1.0;
handles.nraxes = length(findobj(handles.figure1, '-regexp', 'Tag', 'axes*'));
handles.nrtypes = 6;
handles.subdirdata = struct('t0diridx', [], 'fileidx', []);
handles.filedata = struct('name',[],'openarea',[],'thresh',[],'type',[]);   % contains the saved data
handles.opts = scratch_getdefaultopts();
handles.chosenfiles = struct('index',[],'im',[],'opentotmag',[],'sheet',[],'curth',[],'curtype',[],'included',[]);  % contains current, unsaved data
handles.currentmode = 0;  % modes: (start, group editing, single image editing)
handles.do_timeseries = 0;
handles.linehandles = drawgridlines(handles);

handles.enlargedaxesdata = [];

handles.polygons = cell(1,handles.nraxes);
handles.paintdata = struct('painting', 0, 'lastidx', [], 'lastpt', [], 'plotboxpos', {cell(1,handles.nraxes)}, 'lastchgaxes', []);
handles = resetundoinfo(handles);

% zoom and pan handles
handles.zoomobject = zoom(handles.figure1);
set(handles.zoomobject, 'Enable', 'off', 'ActionPostCallback', @zoomobj_postcallback);
handles.panobject = pan(handles.figure1);
set(handles.panobject, 'Enable', 'off', 'ActionPostCallback', @panobj_postcallback);

% set common slider, reset button and enlarge axes callbacks
for k=1:handles.nraxes,
    set(handles.(sprintf('slider_image%d', k)), 'Callback', @(hObject,eventdata) scratchassay('slider_image_Callback',hObject,eventdata,guidata(hObject)));
    set(handles.(sprintf('button_reset%d', k)), 'Callback', @(hObject,eventdata) scratchassay('button_reset_Callback',hObject,eventdata,guidata(hObject),k));
    set(handles.(sprintf('menu_enlarge%d', k)), 'Callback', @(hObject,eventdata) scratchassay('menu_enlarge_Callback',hObject,eventdata,guidata(hObject),k)); 
end
set(handles.menu_reset4, 'Callback', @(hObject, eventdata) scratchassay('menu_enlarge_Callback',hObject,eventdata,guidata(hObject),0));

% set keypress callback, remove figure button-down function
chnd = findobj(handles.figure1, 'Type', 'uicontrol', '-not', 'Style', 'edit');
set(chnd, 'KeyPressFcn', @(hObject, eventdata) scratchassay('figure1_KeyPressFcn', hObject, eventdata, guidata(hObject)));
set(handles.figure1, 'WindowButtonDownFcn', []);

% set tooltips for buttons
set(handles.button_next, 'TooltipString', 'Next page (N)');
set(handles.button_ffwd, 'TooltipString', 'Forward 4 pages (Alt-N)');
set(handles.button_end, 'TooltipString', 'Last page (M)');
set(handles.button_prev, 'TooltipString', 'Previous page (B)');
set(handles.button_fbwd, 'TooltipString', 'Back 4 pages (Alt-B)');
set(handles.button_begin', 'TooltipString', 'First page (V)');

% Choose default command line output for scratchassay
handles.output = hObject;

c = repmat(linspace(0,1,256)', [1 3]);
colormap(c);

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes scratchassay wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = scratchassay_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% Start analysis step callbacks
% ---------------------------------------------------------------------

function edit_directory_Callback(hObject, eventdata, handles)
% hObject    handle to edit_directory (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

update_runloadbuttons(handles);


% --- Executes during object creation, after setting all properties.
function edit_directory_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_directory (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in button_browse.
function button_browse_Callback(hObject, eventdata, handles)
% hObject    handle to button_browse (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

if ~isempty(handles.dirname),
    cpath = fileparts(handles.dirname);
else
    cpath = [];
end
handles.dirname = uigetdir(cpath, 'Choose image directory');

if ~isequal(handles.dirname, 0),
    handles.dirname = [handles.dirname filesep];
    set(handles.edit_directory, 'String', handles.dirname);

    update_runloadbuttons(handles);

    %set(handles.button_run, 'Enable', 'on')

    guidata(gcbo, handles);
end




% --- Executes on button press in button_run.
function button_run_Callback(hObject, eventdata, handles)
% hObject    handle to button_run (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% check for analysis changes if already editing a data set
if handles.currentmode == 2
    handles = checkforchanges(handles);
end

% set axes handles for plotting
plotaxes = zeros(1,handles.nraxes);
for k=1:4,
    plotaxes(k) = handles.(sprintf('axes%d',k));
end

handles.do_timeseries = get(handles.check_timeseries, 'Value');

% parse input directory
handles.dirname = get(handles.edit_directory, 'String');
fpath = fileparts(handles.dirname);
if ~exist(fpath, 'dir')
    errordlg('Image directory not found!', 'TScratch error');
    return
end
if handles.do_timeseries && ~exist(fullfile(fpath, handles.t0dirname), 'dir'),
    errordlg('First timepoint directory not found!', 'TScratch error');
    return
end

imdir = handles.dirname;
if isdir(imdir) && imdir(end) ~= filesep,
    imdir = [imdir filesep];
end

% disable reanalyse buttons, enable stop button
handles = initstartanalysisstep(handles);
set(handles.button_stop, 'Enable', 'on');
set(handles.button_stop, 'UserData', 0.0);
set(handles.button_run, 'Enable', 'off');
set(handles.button_loadold, 'Enable', 'off');

% do the analysis
auto_th = 1;
showresult = 1;
set(handles.text_status, 'String', 'Working...')
drawnow('update')

if handles.do_timeseries,
            
    try
        [areas, subdirs, files, ths, types] = scratcharea_multidir(imdir, handles.opts, handles.opts.prgopts.analyzed_dir, showresult, auto_th, plotaxes, handles.text_status, handles.button_stop);    
    catch ME
        msg = cell(length(ME.cause)+2,1);
        msg{1} = 'Error analyzing directory!';
        msg{2} = ME.message;
        for k=1:length(ME.cause)
            msg{k+2} = ME.cause{k}.message;
        end
        uiwait(errordlg(msg, 'TScratch error', 'modal'));
        initstartanalysisstep(handles);
        return
    end
    
    if isempty(areas) && get(handles.button_stop, 'UserData'),
        % if the analysis was stopped...
        set(handles.text_status, 'String', 'Stopped analysis');
        set(handles.button_stop, 'Enable', 'off');
        set(handles.button_run, 'Enable', 'on');
        set(handles.button_loadold, 'Enable', 'on');
        return
    end
    
    if isempty(areas),
        warndlg('No images were found! Check the selected directory.', 'TScratch warning')
        initstartanalysisstep(handles);
        return
    else
        % set directory indices
        ndirs = length(subdirs);
        diridx = ones(1,ndirs);
        for k=2:ndirs,
            diridx(k) = diridx(k-1) + length(files{k-1});
        end

        % (write local data, and) find t0-directory
        dirt0 = 0;
        for k=1:ndirs,
            if length(handles.t0dirname) >= length(subdirs{k}) && ...
                    isequal(subdirs{k}, handles.t0dirname(1:length(subdirs{k}))),
                dirt0 = k;
            end
        end

        if dirt0 == 0,
            dirt0 = 1;
            warndlg(sprintf('T0-directory %s not found! Using %s.', handles.t0dirname, subdirs{dirt0}), 'TScratch warning');
        end
        
        % modify filenames to include directory names
        ftmp = cat(1, files{:});
        fnames = {ftmp.name}';
        dd = [diridx length(fnames)+1];
        for k=1:length(diridx),
            for fi = dd(k):dd(k+1)-1,
                fnames{fi} = fullfile(subdirs{k}, fnames{fi});
            end
        end

        % save data in handles structure
        handles.filedata = struct('name', fnames, 'openarea', num2cell(cat(1,areas{:})), ...
            'thresh', num2cell(cat(1,ths{:})), 'type', num2cell(cat(1,types{:})));
        handles.subdirdata = struct('t0diridx', dirt0, 'fileidx', diridx);
    end
else
    try
        [areas, files, ths, types] = scratcharea_dir(imdir, handles.opts, 0, handles.opts.prgopts.analyzed_dir, showresult, auto_th, plotaxes, handles.text_status, handles.button_stop);
    catch ME
        msg = cell(length(ME.cause)+2,1);
        msg{1} = 'Error analyzing directory!';
        msg{2} = ME.message;
        for k=1:length(ME.cause)
            msg{k+2} = ME.cause{k}.message;
        end
        uiwait(errordlg(msg, 'TScratch error', 'modal'));
        initstartanalysisstep(handles)
        return
    end

    if isempty(areas) && get(handles.button_stop, 'UserData'),
        % if the analysis was stopped...
        set(handles.text_status, 'String', 'Stopped analysis');
        set(handles.button_stop, 'Enable', 'off');
        set(handles.button_run, 'Enable', 'on');
        set(handles.button_loadold, 'Enable', 'on');
        return
    end
    
    if isempty(areas),
        warndlg('No images were found! Check the selected directory.', 'TScratch warning')
        initstartanalysisstep(handles);
        return
    else
        dirt0 = 0;
        diridx = 1;

        fnames = {files.name}';
        handles.filedata = struct('name', fnames, 'openarea', num2cell(areas), ...
            'thresh', num2cell(ths), 'type', num2cell(types));
        handles.subdirdata = struct('t0diridx', dirt0, 'fileidx', diridx);
    end
end

guidata(hObject, handles);

% write filedata (mat file)
if handles.do_timeseries,
    write_globalmatfile(handles);
else
    write_localmatfile(handles);
end

% initialize next step
if ~handles.opts.prgopts.skip_catmode,
    initpostanalysisstep(handles);
else
    initexcludestep(handles)
end

set(handles.text_status, 'String', sprintf('Analyzed %d images', length(handles.filedata)));



function update_runloadbuttons(handles)

% enable run button if directory exists
curdir = get(handles.edit_directory, 'String');
if exist(curdir, 'dir'),
    if get(handles.check_timeseries, 'Value'),
        subdir = get(handles.edit_t0dir, 'String');
        if exist(fullfile(curdir, subdir), 'dir')
            set(handles.button_run, 'Enable', 'on')
        else
            set(handles.button_run, 'Enable', 'off')
        end
    else
        set(handles.button_run, 'Enable', 'on')
    end
else
    set(handles.button_run, 'Enable', 'off')
end

% Enable load button if data file exists
% check for global data file
datafilename = makedatafilename(curdir, 'global', '.');
if exist(datafilename, 'file'),
    set(handles.button_loadold, 'Enable', 'on')
else
    % check for local data file instead
    datafilename = makedatafilename(curdir, 'all');
    if exist(datafilename, 'file'),
        set(handles.button_loadold, 'Enable', 'on')
    else
        set(handles.button_loadold, 'Enable', 'off')
    end
end



% --- Executes on button press in button_stop.
function button_stop_Callback(hObject, eventdata, handles)
% hObject    handle to button_stop (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

set(hObject, 'UserData', 1 - get(hObject, 'UserData'));
set(handles.text_status, 'String', 'Quitting...')




% --- Executes on button press in button_loadold.
function button_loadold_Callback(hObject, eventdata, handles)
% hObject    handle to button_loadold (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% check for analysis changes if already editing a data set
if handles.currentmode == 2
    handles = checkforchanges(handles);
end

% get chosen directory and look for data files
handles.dirname = get(handles.edit_directory, 'String');
fpath = fileparts(handles.dirname);

datafname = makedatafilename(fpath, 'global', '.');
if exist(datafname, 'file'),
    handles.do_timeseries = 1;
else
    handles.do_timeseries = 0;
    datafname = makedatafilename(fpath, 'all');
    if ~exist(datafname, 'file'),
        errordlg('No old analysis exists for thisdirectory!', 'TScratch error');
        return
    end
end

try
    fd = load(datafname);
catch ME
    msg = {sprintf('Error reading data file %s', datafname); sprintf('Cause: %s', ME.message)};
    uiwait(errordlg(msg, 'TScratch error', 'modal'));
    return
end

if isfield(fd, 'version') && fd.version >= 1.0,
    handles.version = fd.version;
    handles.filedata = struct('name',fd.fnames,'openarea',num2cell(fd.areas), ...
        'thresh',num2cell(fd.ths), 'type',num2cell(fd.types));

    set(handles.check_timeseries, 'Value', handles.do_timeseries);
    if handles.do_timeseries,
        handles.subdirdata = struct('t0diridx',fd.t0diridx,'fileidx',fd.diridx);
        handles.t0dirname = [fileparts(handles.filedata(fd.diridx(fd.t0diridx)).name) filesep];
        set(handles.edit_t0dir, 'String', handles.t0dirname, 'Enable', 'on');
    else
        handles.subdirdata = struct('t0diridx', 0, 'fileidx', 1);
        set(handles.edit_t0dir, 'String', '', 'Enable', 'off');
    end
else
    errordlg('Unable to load data. Incompatible file format.')
    return
end

if isfield(fd, 'opts'),
    handles.opts = fd.opts;
    if ~isfield(handles.opts.prgopts, 'allowedext'),
        tmpopts = scratch_getdefaultopts();
        handles.opts.prgopts.allowedext = tmpopts.prgopts.allowedext;
    end
else
    handles.opts = scratch_getdefaultopts();
end

set(handles.text_status, 'String', sprintf('Loaded %d images', length(handles.filedata)));
guidata(hObject, handles);

if ~handles.opts.prgopts.skip_catmode,
    initpostanalysisstep(handles);
else
    initexcludestep(handles)
end



function edit_t0dir_Callback(hObject, eventdata, handles)
% hObject    handle to edit_t0dir (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% save subdirectory name, without any leading slashes
subname = get(handles.edit_t0dir, 'String');
k=1;
while k<=length(subname) && subname(k) == filesep,
    k = k+1;
end
handles.t0dirname = [fileparts(subname(k:end)) filesep];
guidata(hObject, handles);

update_runloadbuttons(handles);


% --- Executes during object creation, after setting all properties.
function edit_t0dir_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_t0dir (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in button_browse_t0.
function button_browse_t0_Callback(hObject, eventdata, handles)
% hObject    handle to button_browse_t0 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

if ~isempty(handles.dirname),
    cpath = fileparts(handles.dirname);
else
    errordlg('First select an image directory!', 'TScratch error')
    return
end
handles.t0dirname = uigetdir(cpath, 'Choose directory for first time-point');

% handles.t0dirname contains only the subdirectory name
if ~isequal(handles.t0dirname, 0),
    if ~isempty(strfind(handles.t0dirname, handles.dirname)) && length(handles.t0dirname) > length(handles.dirname),
        handles.t0dirname = [handles.t0dirname(length(handles.dirname)+1:end) filesep];
        set(handles.edit_t0dir, 'String', handles.t0dirname);
        guidata(gcbo, handles);
    else
        errordlg('The first time-point directory must be a subdirectory of the image directory!', 'TScratch error')
        return
    end
end

update_runloadbuttons(handles);


% --- Executes on button press in check_timeseries.
function check_timeseries_Callback(hObject, eventdata, handles)
% hObject    handle to check_timeseries (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

if get(hObject,'Value'),
    set(handles.button_browse_t0, 'Enable', 'on');
    set(handles.edit_t0dir, 'Enable', 'on');
    
    if ~isempty(get(handles.edit_t0dir, 'String')),
        handles.t0dirname = get(handles.edit_t0dir, 'String');
        guidata(hObject, handles);
        set(handles.button_run, 'Enable', 'on');
    else
        set(handles.button_run, 'Enable', 'off');
    end
else
    set(handles.button_browse_t0, 'Enable', 'off');
    set(handles.edit_t0dir, 'Enable', 'off'); 
    
    if ~isempty(get(handles.edit_directory, 'String')),
        set(handles.button_run, 'Enable', 'on');
    else
        set(handles.button_run, 'Enable', 'off');
    end
end



% Image manipulation/viewing callbacks
% ---------------------------------------------------------------------

% --- Executes on slider movement.
function slider_image_Callback(hObject, eventdata, handles)
% hObject    handle to slider_image# (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

axesnr = get(hObject, 'UserData');

% clear manual changes in exclusion mode
if handles.currentmode==2,
    if handles.chosenfiles(axesnr).curtype == 5,
        % NOTE: Can not use a modal dialog here, because of MATLAB bug
        % (solution ID: 1-1C4PK)
        answer = dlg_question('title','Discard changes?','string',{'This will discard your manual modifications!'; 'Are you sure?'});
        
        if isempty(answer) || isequal(answer, 'No'),
            set(hObject, 'Value', handles.chosenfiles(axesnr).curth);
            return
        end
        
        handles = clearsingleaxesundo(handles, axesnr);
    end
end

curth = get(hObject,'Value');
for k=axesnr,
    % set new threshold, and reanalyse image
    handles.chosenfiles(k).curth = curth;
    [oa, tmpsheet] = scratch_applythresh(handles.chosenfiles(k).opentotmag, curth, handles.opts);
    handles.chosenfiles(k).sheet = uint8(imresize(tmpsheet, size(handles.chosenfiles(k).im), 'nearest'));
    
    % discard manual changes
    handles.polygons{k} = {};
    if handles.currentmode == 2,
        handles.chosenfiles(k).curtype = 6;
    end
end

txth = handles.(sprintf('text_imth%d', axesnr(1)));
set(txth, 'String', sprintf('%.3f',curth));

handles = drawchosenimages(handles, axesnr);
guidata(hObject, handles);




% --- Executes during object creation, after setting all properties.
function slider_image_CreateFcn(hObject, eventdata, handles)
% hObject    handle to slider_image1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes when one of the reset buttons is clicked
% AXNR tells which button
function button_reset_Callback(hObject, eventdata, handles, axnr)

switch handles.currentmode,
    case 1,
        groupaxesnrs = get(handles.(sprintf('slider_image%d',axnr)), 'UserData');
        th = handles.filedata(handles.chosenfiles(axnr).index).thresh;
        for k=groupaxesnrs,
            handles.chosenfiles(k).curth = th;
            [openarea, sheet] = scratch_applythresh(handles.chosenfiles(k).opentotmag, th, handles.opts);
            handles.chosenfiles(k).sheet = uint8(imresize(sheet, size(handles.chosenfiles(k).im), 'nearest'));

            set(handles.(sprintf('slider_image%d', k)), 'Value', th);
            set(handles.(sprintf('text_imth%d', k)), 'String', sprintf('%.3f',th));
        end
        handles = drawchosenimages(handles, groupaxesnrs);
        
    case 2,
        idx = handles.chosenfiles(axnr).index;
        dfile = makedatafilename(handles.dirname, handles.filedata(idx).name, handles.opts.prgopts.analyzed_dir);
        try
            D = load(dfile);
        catch ME,
            msg = {sprintf('Error reading file %s', datfname); sprintf('Cause: %s', ME.message)};
            uiwait(errordlg(msg, 'TScratch error', 'modal'));
            return
        end
        handles.chosenfiles(axnr).curth = D.thresh;
        handles.chosenfiles(axnr).curtype = D.itype;
        [openarea, sheet] = scratch_applythresh(handles.chosenfiles(axnr).opentotmag, D.thresh, handles.opts);
        handles.chosenfiles(axnr).sheet = uint8(imresize(sheet, size(handles.chosenfiles(axnr).im), 'nearest'));

        set(handles.(sprintf('text_imth%d', axnr)), 'String', sprintf('%.3f', handles.chosenfiles(axnr).curth));
        set(handles.(sprintf('slider_image%d', axnr)), 'Value', handles.chosenfiles(axnr).curth);
        handles = drawchosenimages(handles, axnr);
end

guidata(hObject, handles);




% Choose and Draw images routines
% ---------------------------------------------------------------------

% draw grid lines between axes
function linehandles = drawgridlines(handles)

% find coordinates (based on axes positions)
x = zeros(1,3);
y = zeros(1,3);
axpos = get(handles.axes1, 'Position');
x(1) = axpos(1) - 0.05;
x(2) = axpos(1) + axpos(3) + 0.02;
y(2) = axpos(2) - 0.01;
y(1) = axpos(2) + axpos(4);
axpos = get(handles.axes2, 'Position');
x(3) = axpos(1) + axpos(3);
axpos = get(handles.axes3, 'Position');
y(3) = axpos(2);

% draw the lines
linehandles = zeros(1,4);
linehandles(1) = annotation('line', [x(2) x(2)], [y(1) y(2)]);
linehandles(2) = annotation('line', [x(1) x(2)], [y(2) y(2)]);
linehandles(3) = annotation('line', [x(2) x(3)], [y(2) y(2)]);
linehandles(4) = annotation('line', [x(2) x(2)], [y(2) y(3)]);

set(linehandles, 'LineWidth', 3, 'Color', [0.5 0.5 0.5]);
set(linehandles, 'Visible', 'off')


% Plot bar diagrams with grouping
function plotbardiagrams(groupdata, tokens, dirnames, t0diridx)

tdirs = setdiff(1:length(dirnames), t0diridx);
for k=1:length(groupdata),
    % plot bars and error bars
    hf = figure;
    % make sure figures are not on top of each other
    if k>1,
        newpos = get(hf, 'Position');
        newpos([1 2]) = prevpos([1 2]) + [20 -20];
        set(hf, 'Position', newpos);
    end
    prevpos = get(hf, 'Position');

    hax = axes;
    bar(hax, 100*groupdata{k}(:,1), 0.6, 'FaceColor', [0.6 0.6 1.0]);
    hold(hax, 'on')
    errorbar(hax, 100*groupdata{k}(:,1), 100*groupdata{k}(:,4), 'k.', 'MarkerSize', 0.01)

    % set labels (including number of images used for each bar)
    loctok = tokens;
    for m=1:length(loctok),
        loctok{m} = sprintf('%s  (%d)', loctok{m}, groupdata{k}(m,3));
    end
    set(hax, 'XTickLabel', loctok)
    title(sprintf('%s vs. %s', dirnames{tdirs(k)}, dirnames{t0diridx}), 'FontSize', 14, 'Interpreter', 'none')
    set(hax, 'YGrid', 'on')
    ylabel('% open wound area')
    xlabel('category  (# samples)');
end


% write the number of the image displayed in axes AXNR
function writeimagenumber(handles, axnr)

numstr = num2str(handles.chosenfiles(axnr).index);
idx = handles.chosenfiles(axnr).index;
switch handles.chosenfiles(axnr).curtype,
    case 5,
        numstr = [numstr ' M'];
    case 6,
        numstr = [numstr '*'];
end
set(handles.(sprintf('text_type%d',axnr)), 'String', numstr);



% write name and open area percentage as title for axes AXNR, using info in
% HANDLES.CHOSENFILES and HANDLES.FILEDATA
function writeaxestitle(handles, axnr)

openarea =  1 - nnz(handles.chosenfiles(axnr).sheet) / numel(handles.chosenfiles(axnr).sheet);
idx = handles.chosenfiles(axnr).index;
[pt, nm] = fileparts(handles.filedata(idx).name);
if ~isempty(pt) && pt(end) ~= filesep,
    pt(end+1) = filesep;
end
title(handles.(sprintf('axes%d', axnr)), sprintf('%s: Open image area %.2f %%', [pt nm], 100*openarea), 'Interpreter', 'none');


% combine the analyzed image from image and sheet
% may be called either as COMBINEIMAGE(HANDLES, AXNR)
% or COMBINEIMAGE(IMAGE, SHEET)
function combim = combineimage(arg1, arg2)

if isstruct(arg1),  % (handles, axnr) variant
    combim = arg1.chosenfiles(arg2).im + 64 * arg1.chosenfiles(arg2).sheet;
else  % (image, sheet) variant
    combim = arg1 + 64 * arg2;
end

    
% Draw one image
function drawimage(axhandle, im, sheet)

% assumes im is a uint8 image in the range [0, 191]

axes(axhandle);
%cla
combined_im = combineimage(im, sheet);
imh = image(combined_im);
axis equal tight off


% shows or hides the tools associated with axes AXNR (not the axes itself)
% STATUS should be 'on' or 'off'
function showhide_axestools(handles, axnr, status)

for k=axnr,
    set(handles.(sprintf('slider_image%d', k)), 'Visible', status);
    set(handles.(sprintf('text_imth%d', k)), 'Visible', status);
    set(handles.(sprintf('text_type%d', k)), 'Visible', status);
    set(handles.(sprintf('check_include%d', k)), 'Visible', status);
    set(handles.(sprintf('button_reset%d', k)), 'Visible', status);
end



% enlarge axes AXNR to fill whole image part of window
function handles = enlargeoneimage(handles, axnr)

if axnr > length(handles.chosenfiles)
    return
end

% get selected handles and make selected axes current
axh = handles.(sprintf('axes%d',axnr));
slh = handles.(sprintf('slider_image%d', axnr));
thh = handles.(sprintf('text_imth%d', axnr));
nrh = handles.(sprintf('text_type%d', axnr));
chh = handles.(sprintf('check_include%d', axnr));
rbh = handles.(sprintf('button_reset%d', axnr));

axes(axh)

% save old position and move selected axes
handles.enlargedaxesdata = struct('axpos', get(axh, 'Position'), ...
    'sliderpos', get(slh, 'Position'), 'thtextpos', get(thh, 'Position'), ...
    'nrtextpos', get(nrh, 'Position'), 'checkpos', get(chh, 'Position'), ...
    'resetbtnpos', get(rbh, 'Position'), 'axnr', axnr);
set(axh, 'Position', [0.0795 0.0324 0.8980 0.7017]);
set(slh, 'Position', get(handles.slider_image1, 'Position'));
set(thh, 'Position', get(handles.text_imth1, 'Position'));
set(nrh, 'Position', get(handles.text_type1, 'Position'));
set(chh, 'Position', get(handles.check_include1, 'Position'));
set(rbh, 'Position', get(handles.button_reset1, 'Position'));

% hide other axes
for k=setdiff(1:length(handles.chosenfiles), axnr),
    set(get(handles.(sprintf('axes%d',k)), 'Children'), 'Visible', 'off');
    title(handles.(sprintf('axes%d',k)), '');
    showhide_axestools(handles, k, 'off');
end

% change menu item text
set(handles.(sprintf('menu_enlarge%d', axnr)), 'Label', sprintf('Reduce image %d (%d)', axnr, axnr));

% if paint tool is on, reinitialize!
if isequal(get(handles.tool_paint, 'State'), 'on'),
    tool_paint_OnCallback(handles.tool_paint, [], handles);
    handles = guidata(handles.figure1);  % because the callback modifies HANDLES and calls GUIDATA to save it
end


% reset the view to 4-image view
function handles = resetto4images(handles)

axnr = handles.enlargedaxesdata.axnr;
% get selected handles
axh = handles.(sprintf('axes%d', axnr));
slh = handles.(sprintf('slider_image%d', axnr));
thh = handles.(sprintf('text_imth%d', axnr));
nrh = handles.(sprintf('text_type%d', axnr));
chh = handles.(sprintf('check_include%d', axnr));
rbh = handles.(sprintf('button_reset%d', axnr));

set(handles.(sprintf('menu_enlarge%d', axnr)), 'Label', sprintf('Enlarge image %d (%d)', axnr, axnr));

% save old position and move selected axes
set(axh, 'Position', handles.enlargedaxesdata.axpos);
set(slh, 'Position', handles.enlargedaxesdata.sliderpos);
set(thh, 'Position', handles.enlargedaxesdata.thtextpos);
set(nrh, 'Position', handles.enlargedaxesdata.nrtextpos);
set(chh, 'Position', handles.enlargedaxesdata.checkpos);
set(rbh, 'Position', handles.enlargedaxesdata.resetbtnpos);

% show other axes
for k=1:length(handles.chosenfiles),
    set(get(handles.(sprintf('axes%d',k)), 'Children'), 'Visible', 'on');
    writeaxestitle(handles, k);
    showhide_axestools(handles, k, 'on');
end

handles.enlargedaxesdata = [];

% if paint tool is on, reinitialize!
if isequal(get(handles.tool_paint, 'State'), 'on'),
    tool_paint_OnCallback(handles.tool_paint, [], handles);
    handles = guidata(handles.figure1);   % because the callback modifies HANDLES and calls GUIDATA to save it
end




% draw chosen images, possibly only the subset SUBSET
function handles = drawchosenimages(handles, subset)

if nargin < 2,
    subset = 1:min(handles.nraxes, length(handles.chosenfiles));
    for id=setdiff(1:handles.nraxes, subset),
        axh = handles.(sprintf('axes%d',id));
        cla(axh, 'reset');
        set(axh, 'Visible', 'off')
        handles.polygons{id} = {};
    end
end

for k=subset,
    handles.polygons{k} = {};
    
    axh = handles.(sprintf('axes%d', k));
    set(axh, 'UserData', k);
    
    % draw the image
    drawimage(axh, handles.chosenfiles(k).im, handles.chosenfiles(k).sheet);
    
    writeaxestitle(handles, k);
    
    % write image number
    if handles.currentmode == 2,
        writeimagenumber(handles, k);
        set(get(axh, 'Children'), 'ButtonDownFcn', {@buttondown_axes, k});
    end
end


% Choose files for display
function chosenfiles = chooseanalyzedfiles(handles, curdir, newths)
% Choose some (4) of the analyzed images for reevaluation

filedata = handles.filedata;
totntypes = handles.nrtypes;
allowedtypes = 2:4;
ntochoose = min(handles.nraxes, nnz(ismember([filedata.type], allowedtypes)));

if nargin < 3,
    newths = [];
end

% determine how many to choose of each type, in NPERTYPE
typecnt = zeros(1, totntypes);
for k=allowedtypes,
    typecnt(k) = nnz([filedata.type] == k);
end
npertype = zeros(1,totntypes);
nchosen = 0;
k=1;
while nchosen < ntochoose,
    npertype = npertype + double(typecnt >= k);
    nchosen = sum(npertype);
    k = k+1;
end
k=1;
while nchosen > ntochoose,
    if npertype(k) > 0,
        npertype(k) = npertype(k) - 1;
    end
    k = mod(k, totntypes) + 1;
    nchosen = sum(npertype);
end

% randomly choose images
imidx = [];
for k=1:totntypes,
    idx = [];
    while length(idx) < npertype(k)
        idx = unique([idx ceil(typecnt(k) * rand([1 npertype(k)-length(idx)]))]);
    end
    tidx = find([filedata.type] == k);
    imidx = [imidx tidx(idx)];
end

% special case when images 2 and 3 belong to same type, but this is
% different from images 1 and 4, because of visibility reasons
if ntochoose == handles.nraxes,
    if filedata(imidx(2)).type == filedata(imidx(3)).type && filedata(imidx(1)).type ~= filedata(imidx(2)).type && ...
            filedata(imidx(4)).type ~= filedata(imidx(3)).type,
        imidx([3 4]) = imidx([4 3]);
    end
end

chosenfiles = loadchosenfiles(handles, curdir, imidx, newths);


% Load the files given in IMIDX as indices into FILEDATA structure,
% and store image data in the CHOSENFILE structure for fast access.
% If NEWTHS is given, NEWTHS(TYPE) is applied for images of type TYPE,
% otherwise the threshold from HANDLES.FILEDATA is used (not the one loaded
% from file). The type from HANDLES.FILEDATA is also always used.
function chosenfiles = loadchosenfiles(handles, curdir, imidx, newths)

if nargin < 4,
    newths = [];
end
filedata = handles.filedata;

ntochoose = length(imidx);
if ntochoose == 0,
   chosenfiles = struct('index',[], 'im', [], 'opentotmag', [], 'sheet', [], 'curth', [], 'curtype', [], 'included', []);
   return;
end

chosenfiles = struct('index',num2cell(imidx(:)),'im',cell(ntochoose,1), ...
    'opentotmag',cell(ntochoose,1),'sheet',cell(ntochoose,1), ...
    'curth',num2cell(zeros(ntochoose,1)), 'curtype', num2cell(zeros(ntochoose,1)), ...
    'included', num2cell(zeros(ntochoose,1)));
for k=1:ntochoose,
    % load image
    imfname = fullfile(curdir, filedata(imidx(k)).name);
    try
        chosenfiles(k).im = imread(imfname);
    catch ME
        msg = {sprintf('Error reading file %s', imfname); sprintf('Cause: %s', ME.message)};
        uiwait(errordlg(msg, 'TScratch error', 'modal'));
        return
    end
    chosenfiles(k).im = chosenfiles(k).im(:,:,1);
    chosenfiles(k).im = uint8(double(chosenfiles(k).im) / double(max(chosenfiles(k).im(:))) * 191);
    
    % load totmag-image from data file
    datfname = makedatafilename(curdir, filedata(imidx(k)).name);
    try
        D = load(datfname);
    catch ME
        msg = {sprintf('Error reading file %s', datfname); sprintf('Cause: %s', ME.message)};
        uiwait(errordlg(msg, 'TScratch error', 'modal'));
        return
    end
    chosenfiles(k).opentotmag = D.opentotmag;
    
    if isempty(newths),
        chosenfiles(k).curth = filedata(imidx(k)).thresh;
    else
        chosenfiles(k).curth = newths(abs(filedata(imidx(k)).type));
    end
    chosenfiles(k).curtype = abs(filedata(imidx(k)).type);
    chosenfiles(k).included = (filedata(imidx(k)).type > 0);
    
    % load or compute the sheet field
    if isfield(D, 'sheet') && abs(filedata(imidx(k)).type) == 5,
        if ~isequal(size(chosenfiles(k).im), size(D.sheet))
            chosenfiles(k).sheet = uint8(imresize(D.sheet, size(chosenfiles(k).im), 'nearest'));
        else
            chosenfiles(k).sheet = uint8(D.sheet);
        end
    else 
        [oa, tmpsheet] = scratch_applythresh(chosenfiles(k).opentotmag, chosenfiles(k).curth, handles.opts);
        chosenfiles(k).sheet = uint8(imresize(tmpsheet, size(chosenfiles(k).im), 'nearest'));
    end
end


% Write output files routines
% ---------------------------------------------------------------------

% write a text file with analysis data (including type and threshold)
% if PRINTDIRS is non-zero, subdirectory names are printed for all files
function [err, msg] = writedatafile(outfile, handles, printdirs)

if nargin < 3
    printdirs = 0;
end

err = 0;
fh = fopen(outfile, 'wt');
if fh == -1,
    err = 1;
    msg = 'Could not open file for writing.';
    return
end

filedata = handles.filedata;

fprintf(fh, sprintf('%s\t%s\t%s\t%s\n', 'Name', 'Open image area', 'Threshold', 'Type'));
[msg, errno] = ferror(fh);
if errno,
    err = 2;
    fclose(fh);
    return;
end
for k=1:length(filedata),
    if printdirs,
        nm = filedata(k).name;
    else
        [pt,nm] = fileparts(filedata(k).name);
    end
    
    if printdirs, 
        % also print excluded files (with an X to mark exclusion
        if filedata(k).type > 0
            exclchar = '';
        else
            exclchar = 'X';
        end
        if abs(filedata(k).type) == 5,  % Manual editing
            fprintf(fh, sprintf('%s\t%f\t%s\t%d%s\n', nm, filedata(k).openarea, 'Manual', abs(filedata(k).type), exclchar));
        else
            fprintf(fh, sprintf('%s\t%f\t%f\t%d%s\n', nm, filedata(k).openarea, filedata(k).thresh, abs(filedata(k).type), exclchar));
        end
    else
        if filedata(k).type == 5,  % Manual editing
            fprintf(fh, sprintf('%s\t%f\t%s\t%d\n', nm, filedata(k).openarea, 'Manual', filedata(k).type));
        elseif filedata(k).type > 0
            fprintf(fh, sprintf('%s\t%f\t%f\t%d\n', nm, filedata(k).openarea, filedata(k).thresh, filedata(k).type));
        else
            fprintf(fh, '\n');
        end
    end
    [msg, errno] = ferror(fh);
    if errno,
        err = 2;
        fclose(fh);
        return;
    end
end

% write info about analysis
fprintf(fh, '\n\nGenerated by the TScratch program (www.cse-lab.ethz.ch) on %s,\n', date);
fprintf(fh, 'for the directory %s.\n\n', handles.dirname);

fprintf(fh, 'All open area values are given in percent.\n\n');

fprintf(fh, 'Parameters used:\n');
fprintf(fh, 'Default threshold:\t%.3f\n', handles.opts.default_thresh);
fprintf(fh, 'Disk radius:\t%d\n', handles.opts.disk_radius);
fprintf(fh, 'Smallest island size:\t%.3f\n', handles.opts.island_area);
fprintf(fh, 'Largest hole size:\t%.3f\n', handles.opts.hole_area);
fprintf(fh, 'Erosion size:\t%d\n', handles.opts.erode_size);
if handles.opts.bgscale,
    tstr = 'Used';
else
    tstr = 'Did not use';
end
fprintf(fh, '%s background compensation.\n', tstr);

[msg, errno] = ferror(fh);
if errno
    err = 2;
    fclose(fh)
    return
end

fclose(fh);


% write mat-file for time-series mode, with directory data
function success = write_globalmatfile(handles)

path = fileparts(handles.dirname);
version = handles.version;
t0diridx = handles.subdirdata.t0diridx;
diridx = handles.subdirdata.fileidx;
fnames = {handles.filedata.name}';
areas = [handles.filedata.openarea]';
ths = [handles.filedata.thresh]';
types = [handles.filedata.type]';
opts = handles.opts;

datafname = makedatafilename(path, 'global', '.');
success = 1;
try
    save(datafname, 'version', 't0diridx', 'diridx', 'fnames', 'areas', 'ths', 'types', 'opts');
catch ME
    msg = {sprintf('Error writing data file %s', datafname); sprintf('Cause %s:', ME.message)};
    uiwait(errordlg(msg, 'TScratch error', 'modal'));
    success = 0;
end

% write mat-file for a single directory
function success = write_localmatfile(handles)

path = fileparts(handles.dirname);
version = handles.version;
fnames = {handles.filedata.name}';
areas = [handles.filedata.openarea]';
ths = [handles.filedata.thresh]';
types = [handles.filedata.type]';
opts = handles.opts;

datafname = makedatafilename(path, 'all', handles.opts.prgopts.analyzed_dir);
success = 1;
try
    save(datafname, 'version', 'fnames', 'areas', 'ths', 'types', 'opts')
catch ME
    msg = {sprintf('Error writing data file %s', datafname); sprintf('Cause %s:', ME.message)};
    uiwait(errordlg(msg, 'TScratch error', 'modal'));
    success = 0;
end


% Initialize mode routines
% ---------------------------------------------------------------------

% initialize analysis step
function handles = initstartanalysisstep(handles)
% clear GUI - initialize for new analysis

set(handles.button_prev, 'Enable', 'off');
set(handles.button_fbwd, 'Enable', 'off');
set(handles.button_begin, 'Enable', 'off');
set(handles.button_next, 'Enable', 'off');
set(handles.button_ffwd, 'Enable', 'off');
set(handles.button_end, 'Enable', 'off');
set(handles.button_reselectimages, 'Enable', 'off')
set(handles.button_done, 'Enable', 'off')
set(handles.button_stop, 'Enable', 'off')

update_runloadbuttons(handles);


% reset to 4-image view
if ~isempty(handles.enlargedaxesdata),
    handles = resetto4images(handles);
end

% hide axes and attached controls
for k=1:handles.nraxes,
    showhide_axestools(handles, k, 'off');    
    cla(handles.(sprintf('axes%d',k)), 'reset');
    set(handles.(sprintf('axes%d',k)), 'Visible', 'off');
end

% Disable painting tools
set(handles.tool_paint, 'Enable', 'off', 'State', 'off');
tool_paint_OffCallback(handles.tool_paint, [], handles);
tool_polygondraw_OffCallback(handles.tool_polygondraw, [], handles);
set(handles.tool_polygondraw, 'Enable', 'off', 'State', 'off');
handles = resetundoinfo(handles);  % turn off undo function and buttons

set(handles.tool_zoomin, 'Enable', 'off', 'State', 'off')
set(handles.tool_zoomout, 'Enable', 'off', 'State', 'off')
set(handles.tool_pan, 'Enable', 'off', 'State', 'off')

set(handles.text_status, 'String', '');
set(handles.text_mode, 'String', '');
set(handles.linehandles, 'Visible', 'off')

set(handles.menu_savedata, 'Enable', 'off');
set(handles.menu_statistics, 'Enable', 'off');
set(handles.menu_gotoimage, 'Enable', 'off');
for k=1:handles.nraxes,
    set(handles.(sprintf('menu_enlarge%d',k)), 'Enable', 'off');
end
set(handles.menu_reset4, 'Enable', 'off')

handles.filedata = struct('name',[],'openarea',[],'thresh',[],'type',[]);
handles.chosenfiles = struct('index',[],'im',[],'opentotmag',[],'sheet',[],'curth',[]);
handles.currentmode = 0;

guidata(gcbo, handles)


% initialize group editing step
function initpostanalysisstep(handles, curths)
% initialze mode where threshold may be modified

if nargin < 2,
    curths = [];
end

handles.currentmode = 1;  % set current mode to "review analysis"
set(handles.text_mode, 'String', 'Group editing mode');

fpath = fileparts(handles.dirname);
handles.chosenfiles = chooseanalyzedfiles(handles, fpath, curths);

if isempty([handles.chosenfiles.index]),
    initexcludestep(handles);  % no group editing possible, move to exclude-step
    return;
end

% reset to 4-image view
if ~isempty(handles.enlargedaxesdata),
    handles = resetto4images(handles);
end

% hide axes-attached controls for unused axes
showhide_axestools(handles, length(handles.chosenfiles)+1:handles.nraxes, 'off');

% update slider states
idx = [handles.chosenfiles.index];
imgtypes = [handles.filedata(idx).type];
for k=unique(imgtypes),
    I = find(imgtypes == k);
    slh = handles.(sprintf('slider_image%d',I(1)));
    txh = handles.(sprintf('text_imth%d',I(1)));
    tth = handles.(sprintf('text_type%d',I(1)));
    
    set(slh, 'Visible', 'on', 'UserData', I, 'Value', handles.chosenfiles(I(1)).curth);
    set(txh, 'Visible', 'on', 'String', sprintf('%.3f', handles.chosenfiles(I(1)).curth));
    set(tth, 'Visible', 'on', 'String', sprintf('%d (%d)',k, nnz([handles.filedata.type] == k)));
    set(handles.(sprintf('button_reset%d', I(1))), 'Visible', 'on');

    set(handles.(sprintf('check_include%d',I(1))), 'Visible', 'off');
    
    showhide_axestools(handles, I(2:end), 'off');
end

% set visible status for grid lines
if length(imgtypes) >= 2,
    choice = {'off', 'on'};
    set(handles.linehandles(1), 'Visible', choice{(imgtypes(1) ~= imgtypes(2)) + 1})
    if length(imgtypes) >= 3,
        set(handles.linehandles(2), 'Visible', choice{(imgtypes(1) ~= imgtypes(3)) + 1})
        if length(imgtypes) >= 4,
            set(handles.linehandles(3), 'Visible', choice{(imgtypes(2) ~= imgtypes(4)) + 1})
            set(handles.linehandles(4), 'Visible', choice{(imgtypes(3) ~= imgtypes(4)) + 1})
        end
    end
end

% set enabled status for buttons
set(handles.button_reselectimages, 'Enable', 'on');
set(handles.button_done, 'Enable', 'on');

set(handles.button_stop, 'Enable', 'off');
set(handles.button_run, 'Enable', 'on');
set(handles.button_loadold, 'Enable', 'on');

set(handles.button_prev, 'Enable', 'off');
set(handles.button_fbwd, 'Enable', 'off');
set(handles.button_begin, 'Enable', 'off');
set(handles.button_next, 'Enable', 'off');
set(handles.button_ffwd, 'Enable', 'off');
set(handles.button_end, 'Enable', 'off');

% disable paint tools
set(handles.tool_paint, 'Enable', 'off', 'State', 'off');
tool_paint_OffCallback(handles.tool_paint, [], handles);
tool_polygondraw_OffCallback(handles.tool_polygondraw, [], handles);
set(handles.tool_polygondraw, 'Enable', 'off', 'State', 'off');
handles = resetundoinfo(handles);  % turn off undo function and buttons

set(handles.tool_zoomin, 'Enable', 'on', 'State', 'off')
set(handles.tool_zoomout, 'Enable', 'on', 'State', 'off')
set(handles.tool_pan, 'Enable', 'on', 'State', 'off')

% set enabled status for menu items
set(handles.menu_savedata, 'Enable', 'on');
set(handles.menu_statistics, 'Enable', 'on');
set(handles.menu_gotoimage, 'Enable', 'off');
for k=1:handles.nraxes,
    set(handles.(sprintf('menu_enlarge%d',k)), 'Enable', 'off');
end
set(handles.menu_reset4, 'Enable', 'off')

% draw all images
handles = drawchosenimages(handles);

guidata(gcbo, handles);


% initialize the exclusion mode
function initexcludestep(handles)

handles.currentmode = 2;
set(handles.text_mode, 'String', 'Single image mode');
nimag = length(handles.filedata);
ntoview = min(4, nimag);

set(handles.linehandles, 'Visible', 'off');

% set button/tool/menu item status
set(handles.button_reselectimages, 'Enable', 'off');
set(handles.button_done, 'Enable', 'on');

set(handles.button_stop, 'Enable', 'off');
set(handles.button_run, 'Enable', 'on');
set(handles.button_loadold, 'Enable', 'on');

set(handles.tool_paint, 'Enable', 'on', 'State', 'off');
set(handles.tool_polygondraw, 'Enable', 'on', 'State', 'off');

set(handles.tool_zoomin, 'Enable', 'on', 'State', 'off');
set(handles.tool_zoomout, 'Enable', 'on', 'State', 'off');
set(handles.tool_pan, 'Enable', 'on', 'State', 'off');

set(handles.menu_savedata, 'Enable', 'on');
set(handles.menu_statistics, 'Enable', 'on');
set(handles.menu_gotoimage, 'Enable', 'on');
for k=1:handles.nraxes,
    set(handles.(sprintf('menu_enlarge%d',k)), 'Enable', 'on');
end
set(handles.menu_reset4, 'Enable', 'on');

% display first 4 (or maximum available) images
handles = shownewimageset(handles, 1:ntoview);

updateincludedcounter(handles);

guidata(gcbo, handles);




% Review analysis callback functions
% ---------------------------------------------------------------------


% reanalyzes the images with indices INDICES into the filedata struct,
% optionally using the new thresholds NEWTH, containing a new threshold for
% each image type
% saves the new results in the local/global mat-file, as
% well as in the filedata structure, and writes the analyzed image (unless
% disabled). The file mat-file is written to if WRITEIMGDATA is non-zero.
function handles = reanalyze_selectedimages(handles, indices, newth, writeimgdata)

if nargin < 4,
    writeimgdata = 0;
end
if nargin < 3,
    newth = [];
end

nimg = length(indices);
cnt = 0;
tic
for k=indices,
    % reanalyze image
    datadir = handles.opts.prgopts.analyzed_dir;
    dfile = makedatafilename(handles.dirname, handles.filedata(k).name, datadir);
    if isempty(newth),
        curth = handles.filedata(k).thresh;
    else
        curth = newth(handles.filedata(k).type);
    end
    
    try
        [openarea, sheet, thresh] = scratcharea_reanalyze(dfile, curth, handles.opts, writeimgdata);
    catch ME
        msg = {sprintf('Error analyzing file %s', dfile); sprintf('Cause: %s', ME.message)};
        uiwait(errordlg(msg, 'TScratch error', 'modal'));
        return
    end
    handles.filedata(k).openarea = openarea;
    handles.filedata(k).thresh = thresh;
 
    % write analyzed image
    if handles.opts.prgopts.write_imgs,      
        imfname = fullfile(handles.dirname, handles.filedata(k).name);
        try
            im = imread(imfname);
        catch ME
            msg = {sprintf('Error reading the file %s', imfname); sprintf('Cause: %s', ME.message)};
            uiwait(errordlg(msg, 'TScratch error', 'modal'));
            continue
        end
        im = im(:,:,1);
        im = uint8(double(im)/double(max(im(:))) * 191);
        combined_im = combineimage(im, uint8(imresize(sheet, size(im), 'nearest')));
        
        analimfile = makeanalimgfilename(handles.dirname, handles.filedata(k).name, datadir);
        try
            imwrite(combined_im, colormap(), analimfile);
        catch ME
            msg = {sprintf('Error writing to file %s', analimfile); sprintf('Cause: %s', ME.message)};
            uiwait(errordlg(msg, 'TScratch error', 'modal'));
        end
    end
    
    cnt = cnt+1;    
    statusstr = sprintf('Reanalyzing. %d s remaining.', round(toc / cnt * (nimg-cnt)) );
    set(handles.text_status, 'String', statusstr)
    drawnow('update')
end

% write filedata
if handles.do_timeseries,
    write_globalmatfile(handles);
else
    write_localmatfile(handles);
end



% reanalyze the images belonging to groups with changed threshold
% called when "Done" is clicked in group editing mode
function handles = reanalyzechangedgroups(handles)

% find thresholds for different groups
curth = zeros(1,handles.nrtypes);
oldth = zeros(1,handles.nrtypes);
idx = [handles.chosenfiles.index];
for k=1:length(handles.chosenfiles),
    curth(handles.filedata(idx(k)).type) = handles.chosenfiles(k).curth;
    oldth(handles.filedata(idx(k)).type) = handles.filedata(idx(k)).thresh;
end

chgdgroups = find(abs(curth - oldth) > 1.e-4);
chgdimgs = find(ismember([handles.filedata.type], chgdgroups));
if ~isempty(chgdimgs),
    set(handles.text_status, 'String', 'Applying new thresholds...');
    drawnow('update')
    
    handles = reanalyze_selectedimages(handles, chgdimgs, curth, 1);
end

guidata(gcbo, handles)


% reanalyze chosen images with changed thresholds (in single image mode)
% rewrites global/local mat file and analyzed images, but not image
% mat-files (except for adding a sheet for manually changed images)
% Called in single image mode, every time the view changes, or "Done" is
% clicked.
function handles = reanalyzechangedimgs(handles)

statusmsg = 'Applying changes    ';
cnt = 0;
for k=1:length(handles.chosenfiles),
    % get filename and reanalyze
    idx = handles.chosenfiles(k).index;
    dfile = makedatafilename(handles.dirname, handles.filedata(idx).name, handles.opts.prgopts.analyzed_dir);
    
    inclfactor = -1 + 2*double(handles.chosenfiles(k).included);  % -1 if excluded, 1 if included
    
    dontwriteimg = 0;
    switch handles.chosenfiles(k).curtype,
        case 5,
            curoa = 1 - nnz(handles.chosenfiles(k).sheet) / numel(handles.chosenfiles(k).sheet);
            if abs(handles.filedata(idx).openarea - curoa) > 1.e-6,
                % the open area has changed, save new data
                handles.filedata(idx).type = inclfactor * 5;  % manually edited
                handles.filedata(idx).openarea = curoa;

                % rewrite data to save the sheet
                try
                    load(dfile);  % load opentotmag, thresh, itype (and maybe sheet)
                    sheet = handles.chosenfiles(k).sheet;
                    save(dfile, 'sheet', 'opentotmag', 'thresh', 'itype');
                catch ME
                    msg = {sprintf('Error rewriting data file %s', dfile); sprintf('Cause: %s', ME.message)};
                    uiwait(errordlg(msg, 'TScratch error', 'modal'));
                    continue
                end
            elseif inclfactor ~= sign(handles.filedata(idx).type),
                % image has been excluded
                handles.filedata(idx).type = inclfactor * 5;
                dontwriteimg = 1;  % no need to rewrite image
            else
                continue;
            end

        case 6,  % manually changed threshold
            curth = handles.chosenfiles(k).curth;
            if abs(handles.filedata(idx).thresh - curth) > 1.e-4,
                % threshold has changed, reanalyze image
                openarea = scratch_applythresh(handles.chosenfiles(k).opentotmag, curth, handles.opts);

                handles.filedata(idx).openarea = openarea;
                handles.filedata(idx).thresh = curth;
                handles.filedata(idx).type = inclfactor * 6;  % manually changed threshold
            elseif inclfactor ~= sign(handles.filedata(idx).type),
                % image has been excluded
                handles.filedata(idx).type = inclfactor * 6;
                dontwriteimg = 1;  % no need to rewrite image
            else
                continue;
            end
        
        otherwise
            if handles.chosenfiles(k).curtype ~= abs(handles.filedata(idx).type),
                % a reset button has been clicked
                handles.filedata(idx).type = inclfactor * handles.chosenfiles(k).curtype;
                handles.filedata(idx).thresh = handles.chosenfiles(k).curth;
                handles.filedata(idx).openarea = scratch_applythresh(handles.chosenfiles(k).opentotmag, handles.chosenfiles(k).curth, handles.opts);                
            elseif inclfactor ~= sign(handles.filedata(idx).type),
                % image has been excluded
                handles.filedata(idx).type = inclfactor * handles.chosenfiles(k).curtype;
                dontwriteimg = 1;  % no need to rewrite image
            else
                continue  % nothing changed, goto next image
            end
    end

    % update counter and status string
    cnt = cnt + 1;
    statusmsg(end - handles.nraxes + cnt) = '.';
    set(handles.text_status, 'String', statusmsg);
    drawnow('update');
    
    % write analyzed image
    if handles.opts.prgopts.write_imgs && ~dontwriteimg,
        combined_im = combineimage(handles.chosenfiles(k).im, handles.chosenfiles(k).sheet);
        analimfile = makeanalimgfilename(handles.dirname, handles.filedata(idx).name, handles.opts.prgopts.analyzed_dir);
        try
            imwrite(combined_im, colormap(), analimfile);
        catch ME
            msg = {sprintf('Error writing to file %s', analimfile); sprintf('Cause: %s', ME.message)};
            uiwait(errordlg(msg, 'TScratch error', 'modal'));
        end
    end
end

if cnt,
    if handles.do_timeseries,
        write_globalmatfile(handles);
    else
        write_localmatfile(handles);
    end
end

% show included image counter
updateincludedcounter(handles);

guidata(gcbo, handles);



% --- Executes on button press in button_reselectimages.
function button_reselectimages_Callback(hObject, eventdata, handles)
% hObject    handle to button_reselectimages (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% get current thresholds
curth = zeros(1,handles.nrtypes);
for k=1:handles.nraxes,
    slh = handles.(sprintf('slider_image%d', k));
    if isequal(get(slh, 'Visible'), 'on'),
        tstr = get(handles.(sprintf('text_type%d',k)),'String');
        itype = str2double(strtok(tstr));
        curth(itype) = get(slh, 'Value');
    end
end

% select new images
initpostanalysisstep(handles, curth);


% --- Executes on button press in button_done.
% In group editing mode: applies changed thresholds
% In single image mode: saves data to local/global mat-file and asks for
%   and writes to output text-file
function button_done_Callback(hObject, eventdata, handles)
% hObject    handle to button_done (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Check if thresholds have been changed
switch handles.currentmode,
    case 1,
        handles = reanalyzechangedgroups(handles);
        initexcludestep(handles)
        
    case 2,
        % we are done, save and reinit
        handles = reanalyzechangedimgs(handles);

        fpath = fileparts(handles.dirname);

        % write raw data
        if handles.do_timeseries,
            write_globalmatfile(handles);
        else
            write_localmatfile(handles);
        end
        
        % Choose an output file
        done = 0;  
        while ~done,
            curdir = pwd;
            cd(fpath)
            [filename, pathname] = uiputfile({'*.txt','Text files (*.txt)'}, 'Choose an output file for data!');
            cd(curdir);

            if ~isequal(filename, 0) && ~isequal(pathname, 0),
                % write data to output file
                if handles.do_timeseries,
                    [groupdata, tokens, dirnames, t0diridx] = ...
                        writemultidata(handles.filedata, handles.subdirdata, fullfile(pathname, filename), handles.dirname, handles.opts);

                    if isequal(groupdata, -1) || isequal(groupdata, -2),
                        errordlg('Error writing to file. Please choose a different location or file name.', 'TScratch error');
                        continue
                    else
                        done = 1;
                    end

                    plotbardiagrams(groupdata, tokens, dirnames, t0diridx);

                else
                    err = writedatafile(fullfile(pathname, filename), handles);
                    
                    if err > 0,
                        errordlg('Error writing to file. Please choose a different location or file name.', 'TScratch error');
                        continue
                    else
                        done = 1;
                    end
                end
            else
                done = 1;
            end
        end

        handles = initstartanalysisstep(handles);
end



% Exclusion mode callbacks
% ---------------------------------------------------------------------

% update the counter for included images
function updateincludedcounter(handles)

incl = [handles.filedata.type] > 0;
incl([handles.chosenfiles.index]) = [handles.chosenfiles.included];
set(handles.text_status, 'String', sprintf('Use %d of %d images.', nnz(incl), length(handles.filedata)));


% show images with numbers in NEWIMGS (increasing order) on one page
function handles = shownewimageset(handles, newimgs)

% reset to 4-image view
if ~isempty(handles.enlargedaxesdata),
    handles = resetto4images(handles);
end

% clear unused axes
for k=length(newimgs)+1:handles.nraxes,
    cla(handles.(sprintf('axes%d', k)), 'reset');
    showhide_axestools(handles, k, 'off');
end

% load and draw images
fpath = fileparts(handles.dirname);
handles.chosenfiles = loadchosenfiles(handles, fpath, newimgs);

for k=1:length(newimgs),
    curth = handles.chosenfiles(k).curth;
    set(handles.(sprintf('slider_image%d', k)), 'Value', curth, 'UserData', k);
    set(handles.(sprintf('text_imth%d', k)), 'String', sprintf('%.3f',curth));
    set(handles.(sprintf('check_include%d',k)), 'UserData', k, ...
        'Value', (handles.filedata(newimgs(k)).type > 0));
    showhide_axestools(handles, k, 'on');
end
handles = drawchosenimages(handles);

% set next/prev button status
choice = {'off', 'on'};
totnimag = length(handles.filedata);
set(handles.button_prev, 'Enable', choice{(newimgs(1) > 1) + 1});
set(handles.button_fbwd, 'Enable', choice{(newimgs(1) > 1) + 1});
set(handles.button_begin, 'Enable', choice{(newimgs(1) > 1) + 1});
set(handles.button_next, 'Enable', choice{(newimgs(1) + handles.nraxes <= totnimag) + 1});
set(handles.button_ffwd, 'Enable', choice{(newimgs(1) + handles.nraxes <= totnimag) + 1});
set(handles.button_end, 'Enable', choice{(newimgs(1) + handles.nraxes <= totnimag) + 1});

handles = resetundoinfo(handles);




% --- Executes on button press in button_prev.
function button_prev_Callback(hObject, eventdata, handles)
% hObject    handle to button_prev (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

firstim = min([handles.chosenfiles.index]);

% choose new files
if firstim-handles.nraxes <= 1,
    newimgs = 1:firstim-1;
else
    newimgs = firstim - (handles.nraxes:-1:1);
end

handles = shownewimageset(handles, newimgs);
guidata(hObject, handles);




% --- Executes on button press in button_next.
function button_next_Callback(hObject, eventdata, handles)
% hObject    handle to button_next (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

totnim = length(handles.filedata);
lastim = max([handles.chosenfiles.index]);
if lastim >= totnim,
    errordlg('Error: this should not happen!');
else
    % choose new files
    if lastim+handles.nraxes >= totnim,
        newimgs = lastim+1:totnim;
    else
        newimgs = lastim + (1:handles.nraxes);
    end

    handles = shownewimageset(handles, newimgs);
end

guidata(hObject, handles);



% move 4 pages forward
function button_ffwd_Callback(hObject, eventdata, handles)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

totnim = length(handles.filedata);
lastim = max([handles.chosenfiles.index]);

% choose new files
if lastim + 4*handles.nraxes >= totnim,
    newimgs = max(totnim-handles.nraxes+1, 1):totnim;
else
    newimgs = lastim + 3*handles.nraxes + (1:handles.nraxes);
end

handles = shownewimageset(handles, newimgs);

guidata(hObject, handles);



% move to the last image
function button_end_Callback(hObject, eventdata, handles)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

totnim = length(handles.filedata);

% choose new files
newimgs = max(totnim-handles.nraxes+1, 1):totnim;
handles = shownewimageset(handles, newimgs);
guidata(hObject, handles);



% move 4 pages backward
function button_fbwd_Callback(hObject, eventdata, handles)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

totnim = length(handles.filedata);
firstim = min([handles.chosenfiles.index]);

% choose new files
if firstim - 4*handles.nraxes < 1,
    newimgs = 1:min(totnim, handles.nraxes);
else
    newimgs = firstim - 4*handles.nraxes + (0:handles.nraxes-1);
end

handles = shownewimageset(handles, newimgs);
guidata(hObject, handles);



% move to the first image
function button_begin_Callback(hObject, eventdata, handles)

% reanalyze (and write) images with changed threshold
handles = reanalyzechangedimgs(handles);

totnim = length(handles.filedata);

% choose new files
newimgs = 1:min(totnim,handles.nraxes);
handles = shownewimageset(handles, newimgs);
guidata(hObject, handles);



% --- Executes on button press in check_include boxes.
function check_include_Callback(hObject, eventdata, handles)
% hObject    handle to check_include1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% get axes number of the displayed image
axnr = get(hObject, 'UserData');
% save included info
handles.chosenfiles(axnr).included = get(hObject, 'Value');
% update included image counter
updateincludedcounter(handles);

guidata(hObject, handles);


% check if any images were changed, in that case ask and apply changes
function handles = checkforchanges(handles)

chg = 0;
for k=1:length(handles.chosenfiles),
    idx = handles.chosenfiles(k).index;
    if handles.chosenfiles(k).curth ~= handles.filedata(idx).thresh || ...
            handles.chosenfiles(k).curtype ~= abs(handles.filedata(idx).type) || ...
            handles.chosenfiles(k).included ~= (handles.filedata(idx).type > 0),
        chg = 1;
    end
end

if chg,
   answer = questdlg('Would you like to apply your changes first?','Apply changes?','Yes','No','Yes');
   if isequal(answer, 'Yes'),
       handles = reanalyzechangedimgs(handles);
   end
end



% Menu callbacks
%---------------------------------------------------------------------

function menu_tools_Callback(hObject, eventdata, handles)
% do nothing
return;


function menu_savedata_Callback(hObject, eventdata, handles)

if handles.currentmode == 2,
    handles = checkforchanges(handles);
end

% ask for a filename
curdir = pwd;
fpath = fileparts(handles.dirname);
cd(fpath)
[filename, pathname] = uiputfile({'*.txt','Text files (*.txt)'}, 'Choose an output file for data!');
cd(curdir);

if ~isequal(filename, 0) && ~isequal(pathname, 0),
    fname = fullfile(pathname, filename);
    [err, msg] = writedatafile(fname, handles, 1);
    if err,
        errordlg({sprintf('Error writing to file %s!', fname), sprintf('Cause: %s', msg)}, 'TScratch error', 'modal');
        return
    end
end




function menu_statistics_Callback(hObject, eventdata, handles)

msgstr = sprintf('Statistics for %s\n\n', handles.dirname);
if handles.do_timeseries,
    addstr = sprintf('Time-course mode.\nDirectories: ');

    % extract directory names
    ndir = length(handles.subdirdata.fileidx);
    for k=1:ndir,
        slidx = strfind(handles.filedata(handles.subdirdata.fileidx(k)).name, filesep);
        if slidx > 1,
            addstr = [addstr sprintf('%s, ', handles.filedata(handles.subdirdata.fileidx(k)).name(1:slidx-1))];
        end
    end
    msgstr = [msgstr addstr(1:end-2) sprintf('\n\n')];
else
    msgstr = [msgstr sprintf('Single directory mode\n\n')];
end
        
msgstr = [msgstr sprintf('Total: %d images\n', length(handles.filedata))];
for k=1:4,
    msgstr = [msgstr sprintf('Type %d: %d\n', k, nnz([handles.filedata.type] == k))];
end
msgstr = [msgstr sprintf('Manually adjusted thresholds: %d\n', nnz([handles.filedata.type] == 6))];
msgstr = [msgstr sprintf('Manual analysis: %d\n', nnz([handles.filedata.type] == 5))];
msgstr = [msgstr sprintf('Excluded images: %d\n', nnz([handles.filedata.type] < 0))];

msgbox(msgstr, 'Statistics', 'modal');



function menu_settings_Callback(hObject, eventdata, handles)
% hObject    handle to menu_settings (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[ok, opts] = scratchsettings(handles.opts, handles.currentmode);
if ok,
    if ~isequal(opts, handles.opts) && handles.currentmode > 0,
        % reanalyze images with new options
        answer = questdlg({'This will reanalyze all images, except the manually edited ones,','with the new settings.','Are you sure?'}, 'Reanalyze all images?', 'Yes', 'No', 'No');
        if isequal(answer, 'Yes'),
            handles.opts = opts;
            prevstatus = get(handles.text_status, 'String');
            set(handles.text_status, 'String', 'Reanalyzing images...');
            drawnow('update')
            
            % exclude manually changed images from reanalysis
            imidx = find([handles.filedata.type] ~= 5);
            manchgidx = [handles.chosenfiles([handles.chosenfiles.curtype] == 5).index];
            imidx = setdiff(imidx, manchgidx);
            
            % reanalyze and save
            handles = reanalyze_selectedimages(handles, imidx);
            save('scratchopts.mat', 'opts')
            
            % recompute sheets for chosen, non-manual images
            chosenr = setdiff(1:handles.nraxes, find([handles.chosenfiles.curtype] == 5));
            for k=chosenr
                th = handles.chosenfiles(k).curth;
                [oa, sheet] = scratch_applythresh(handles.chosenfiles(k).opentotmag, th, opts);
                handles.chosenfiles(k).sheet = uint8(imresize(sheet, size(handles.chosenfiles(k).im), 'nearest'));
            end
            
            % redraw all but manually changed images
            drawchosenimages(handles, chosenr);
            
            set(handles.text_status, 'String', prevstatus);
            drawnow('update')
        end        
    else
        handles.opts = opts;        
        save('scratchopts.mat', 'opts')
    end
    guidata(hObject, handles)
    
end


function menu_about_Callback(hObject, eventdata, handles)

try
    icondata = imread('scratchicon_sm.png');
catch ME
    icondata = [];
end
iconcmap = gray;
uiwait(msgbox(sprintf('TScratch version %.1f\nCopyright 2008 Tobias Geback, Martin Schulz\nETH Zurich\nwww.cse-lab.ethz.ch\n\nCurveLab: www.curvelet.org\n\nMATLAB(R). (c) 1984 - 2008 The MathWorks, Inc.', handles.version),...
    'About TScratch', 'custom', icondata, iconcmap, 'modal'));


function menu_quit_Callback(hObject, eventdata, handles)

answer = questdlg('Are you sure that you want to quit?', 'Quit?', 'Yes', 'No', 'No');
if isequal(answer, 'Yes'),
    if handles.currentmode == 2,
        handles = checkforchanges(handles);
        guidata(hObject, handles);
    end
    
    close(handles.figure1);
end



function menu_gotoimage_Callback(hObject, eventdata, handles)

% get number of the image to go to
curnr = handles.chosenfiles(1).index;
imstr = inputdlg({'Go to image number:'}, 'Goto image', 1, {num2str(curnr)});
if ~isempty(imstr),
    imnr = round(str2double(imstr{1}));
else
    return;
end

if ~isempty(imnr) && imnr > 0 && imnr <= length(handles.filedata),
    % reanalyze (and write) images with changed threshold
    handles = reanalyzechangedimgs(handles);

    % choose and display new files
    newimgs = imnr:min(imnr + handles.nraxes-1, length(handles.filedata));
    handles = shownewimageset(handles, newimgs);
    guidata(hObject, handles);
else
    errordlg('Invalid image number!', 'TScratch error', 'modal');
end


function menu_enlarge_Callback(hObject, eventdata, handles, axnr)

if axnr == 0,
    handles = resetto4images(handles);
else
    if isempty(handles.enlargedaxesdata),
        handles = enlargeoneimage(handles, axnr);
    elseif handles.enlargedaxesdata.axnr ~= axnr,
        handles = resetto4images(handles);
        handles = enlargeoneimage(handles, axnr);
    else
        handles = resetto4images(handles);
    end 
end
guidata(hObject, handles);



% Icon modification functions
% ------------------------------------------------------------------

function seticon_selected(tool_handle)

if ismac(),
    icon = get(tool_handle, 'CData');
    icon(repmat(isnan(icon(:,:,1)), [1 1 size(icon,3)])) = 0.5;
    set(tool_handle, 'CData', icon)
end

function seticon_deselected(tool_handle)

if ismac(),
    icon = get(tool_handle, 'CData');
    icon(icon == 0.5) = NaN;
    set(tool_handle, 'CData', icon)
end



% zoom and pan tool callbacks
% ------------------------------------------------------------------

function zoomobj_postcallback(hfig, eventobj)

handles = guidata(hfig);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input

% repair button down function if lost (when choosing reset view)
if isempty(get(get(eventobj.Axes, 'Children'), 'ButtonDownFcn')),
    for k=1:handles.nraxes,
        if isequal(eventobj.Axes, handles.(sprintf('axes%d', k))),
            set(get(eventobj.Axes, 'Children'), 'ButtonDownFcn', {@buttondown_axes, k});
        end
    end
end


function panobj_postcallback(hfig, eventobj)

handles = guidata(hfig);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input



function tool_zoomin_OffCallback(hObject, eventdata, handles)

if isequal(get(handles.zoomobject, 'Enable'), 'on') && isequal(get(handles.zoomobject, 'Direction'), 'in'),
    set(handles.zoomobject, 'Enable', 'off')
end
seticon_deselected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


function tool_zoomin_OnCallback(hObject, eventdata, handles)

toolhandles = [handles.tool_paint handles.tool_polygondraw handles.tool_zoomout handles.tool_pan];
for th = toolhandles,
    if isequal(get(th, 'State'), 'on'),
        set(th, 'State', 'off');
    end
end
if isequal(get(handles.zoomobject, 'Enable'), 'off') 
    set(handles.zoomobject, 'Enable', 'on', 'Direction', 'in')
elseif isequal(get(handles.zoomobject, 'Direction'), 'out'),
    set(handles.zoomobject, 'Enable', 'off')
    set(handles.zoomobject, 'Enable', 'on', 'Direction', 'in')
end
seticon_selected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


function tool_zoomout_OffCallback(hObject, eventdata, handles)

if isequal(get(handles.zoomobject, 'Enable'), 'on') && isequal(get(handles.zoomobject, 'Direction'), 'out'),
    set(handles.zoomobject, 'Enable', 'off')
end
seticon_deselected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


function tool_zoomout_OnCallback(hObject, eventdata, handles)

toolhandles = [handles.tool_paint handles.tool_polygondraw handles.tool_zoomin handles.tool_pan];
for th = toolhandles,
    if isequal(get(th, 'State'), 'on'),
        set(th, 'State', 'off');
    end
end
if isequal(get(handles.zoomobject, 'Enable'), 'off'), 
    set(handles.zoomobject, 'Enable', 'on', 'Direction', 'out')
elseif isequal(get(handles.zoomobject, 'Direction'), 'in'),
    set(handles.zoomobject, 'Enable', 'off')
    set(handles.zoomobject, 'Enable', 'on', 'Direction', 'out')
end
seticon_selected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


function tool_pan_OffCallback(hObject, eventdata, handles)

if isequal(get(handles.panobject, 'Enable'), 'on'),
    set(handles.panobject, 'Enable', 'off')
end
seticon_deselected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


function tool_pan_OnCallback(hObject, eventdata, handles)

toolhandles = [handles.tool_paint handles.tool_polygondraw handles.tool_zoomin handles.tool_zoomout];
for th = toolhandles,
    if isequal(get(th, 'State'), 'on'),
        set(th, 'State', 'off');
    end
end
if isequal(get(handles.panobject, 'Enable'), 'off'),
    set(handles.panobject, 'Enable', 'on')
end
seticon_selected(hObject);
uicontrol(handles.button_browse);  % set focus to a control, to receive keyboard input


% move the current image left/right/up/down if zoomed in
function movecurrentimage(handles, dir)

curax = gca;
if ~ishandle(curax),
    return
end
axdim = axis(curax);
imh = findobj(curax, 'Type', 'Image');
if ishandle(imh),
    imdim = size(get(imh, 'CData'));
    if min(imdim) == 0,
        return;
    end

    movefrac = 0.3;
    
    wid = axdim(2) - axdim(1);
    hgh = axdim(4) - axdim(3);
    switch dir,
        case 1,  % left
            newl = max(0.5, axdim(1) - wid * movefrac);
            newr = newl + wid;
            newax = [newl newr axdim(3:4)];
        case 2,  % right
            newr = min(imdim(2) + 0.5, axdim(2) + wid * movefrac);
            newl = newr - wid;
            newax = [newl newr axdim(3:4)];
        case 3,  % up
            newt = max(0.5, axdim(3) - hgh * movefrac);
            newb = newt + hgh;
            newax = [axdim(1:2) newt newb];
        case 4,  % down
            newb = min(imdim(1) + 0.5, axdim(4) + hgh * movefrac);
            newt = newb - hgh;
            newax = [axdim(1:2) newt newb];
    end
    axis(newax);
end




% Painting tool functions
% ------------------------------------------------------------------

function tool_paint_OnCallback(hObject, eventdata, handles)

% disable other tools
toolhandles = [handles.tool_polygondraw handles.tool_zoomin handles.tool_zoomout handles.tool_pan];
for th = toolhandles,
    if isequal(get(th, 'State'), 'on'),
        set(th, 'State', 'off');
    end
end

% start/restart the mouse-pointer manager for the figure
iptPointerManager(handles.figure1);

% Set mouse-move callbacks and axes details for each axes
for k=1:handles.nraxes,
    axh = handles.(sprintf('axes%d',k));
    pb.enterFcn = @(h, pt) set(h, 'Pointer', 'circle');
    pb.exitFcn = @(h, pt) scratchassay('leaveaxes', h, pt);
    pb.traverseFcn = @(h,pt) scratchassay('paintinaxes',h, pt, k);
    iptSetPointerBehavior(axh, pb);
    
    pos = get(axh, 'Position');
    figpos = get(handles.figure1, 'Position');
    pos = pos .* [figpos(3) figpos(4) figpos(3) figpos(4)];  % convert units to pixels
    asp = get(axh, 'PlotBoxAspectRatio');
    if pos(4)/pos(3) < asp(2)/asp(1),
        % lying rectangle
        handles.paintdata.plotboxpos{k} = [0 pos(2) 0 pos(4)];
        handles.paintdata.plotboxpos{k}(3) = asp(1)/asp(2) * pos(4);
        handles.paintdata.plotboxpos{k}(1) = pos(1) + (pos(3) - handles.paintdata.plotboxpos{k}(3))/2;
    else
        % standing rectangle
        handles.paintdata.plotboxpos{k} = [pos(1) 0 pos(3) 0];
        handles.paintdata.plotboxpos{k}(4) = asp(2)/asp(1) * pos(3);
        handles.paintdata.plotboxpos{k}(2) = pos(2) + (pos(4) - handles.paintdata.plotboxpos{k}(4))/2;
    end

end

handles.paintdata.lastidx = [];
handles.paintdata.lastpt = [];
guidata(hObject, handles)

seticon_selected(hObject);



function tool_paint_OffCallback(hObject, eventdata, handles)

for k=1:handles.nraxes,
    axh = handles.(sprintf('axes%d',k));
    iptSetPointerBehavior(axh, []);
end
set(handles.figure1, 'Pointer', 'arrow');
handles.paintdata.painting = 0;
guidata(hObject, handles);

seticon_deselected(hObject);


function leaveaxes(fighandle, pt)

handles = guidata(fighandle);
handles.paintdata.lastidx = [];
handles.paintdata.lastpt = [];
handles.paintdata.painting = 0;
guidata(fighandle, handles);


function paintinaxes(fighandle, pt, axesnr)

handles = guidata(fighandle);
if handles.paintdata.painting,
    axpos = handles.paintdata.plotboxpos{axesnr};
    axh = handles.(sprintf('axes%d', axesnr));
    
    xlim = get(axh, 'XLim');
    ylim = get(axh, 'YLim');
    imsz = size(handles.chosenfiles(axesnr).im);
    
    setvalue = ~isequal(get(handles.figure1, 'SelectionType'), 'alt');
    
    % compute index of current point
    idx = round((pt - axpos(1:2)) ./ axpos(3:4) .* [xlim(2)-xlim(1) -(ylim(2)-ylim(1))] + [xlim(1) ylim(2)]);  % index into image
    idx = idx([2 1]);

    % compute scaling
    factor = (xlim(2)-xlim(1)) / axpos(3);
    Rpt = 7;
    Ridx = ceil(Rpt * factor);
    if isempty(handles.paintdata.lastidx),
        rng1 = idx(1) - Ridx : idx(1) + Ridx;
        rng1 = rng1(rng1 >= ylim(1) & rng1 <= ylim(2));
        rng2 = idx(2) - Ridx : idx(2) + Ridx;
        rng2 = rng2(rng2 >= xlim(1) & rng2 <= xlim(2));
        [Rng1, Rng2] = ndgrid(rng1,rng2);
        rectidx = sub2ind(imsz, Rng1(:), Rng2(:));
        rngxpt = (Rng2(:) - xlim(1)) / factor;
        rngypt = (ylim(2) - Rng1(:)) / factor;

        % compute quantities
        r1 = [rngxpt' - (pt(1) - axpos(1)); rngypt' - (pt(2) - axpos(2))];  

        % set pixels inside domain
        paintedidx = rectidx(r1(1,:).^2 + r1(2,:).^2 <= Rpt^2);
        handles.chosenfiles(axesnr).sheet(paintedidx) = setvalue;
  
    else
        % compute bounding box
        rng1 = min(handles.paintdata.lastidx(1), idx(1)) - Ridx : max(handles.paintdata.lastidx(1), idx(1)) + Ridx;
        rng1 = rng1(rng1 >= ylim(1) & rng1 <= ylim(2));
        rng2 = min(handles.paintdata.lastidx(2), idx(2)) - Ridx : max(handles.paintdata.lastidx(2), idx(2)) + Ridx;
        rng2 = rng2(rng2 >= xlim(1) & rng2 <= xlim(2));
        [Rng1, Rng2] = ndgrid(rng1,rng2);
        rectidx = sub2ind(imsz, Rng1(:), Rng2(:));
        rngxpt = (Rng2(:) - xlim(1)) / factor;
        rngypt = (ylim(2) - Rng1(:)) / factor;

        % compute quantities
        d = (handles.paintdata.lastpt - pt)';
        dort = [-d(2); d(1)];
        L = norm(d);
        r1 = [rngxpt' - (pt(1) - axpos(1)); rngypt' - (pt(2) - axpos(2))];
        r2 = [rngxpt' - (handles.paintdata.lastpt(1) - axpos(1)); rngypt' - (handles.paintdata.lastpt(2) - axpos(2))];
    
        % set pixels inside domain
        paintedidx = rectidx((abs(d' * r1) <= L^2 & abs(dort' * r2) <= L*Rpt) | ...
            (r1(1,:).^2 + r1(2,:).^2 <= Rpt^2) | (r2(1,:).^2 + r2(2,:).^2 <= Rpt^2));
        handles.chosenfiles(axesnr).sheet(paintedidx) = setvalue;  

    end
    % display changes
    imh = findobj(axh, 'Type', 'image');
    combim = get(imh, 'CData');
    combim(paintedidx) = handles.chosenfiles(axesnr).im(paintedidx) + 64 * setvalue;
    set(imh, 'CData', combim);
    
    % update paintdata
    handles.paintdata.lastidx = idx;
    handles.paintdata.lastpt = pt;
    guidata(fighandle, handles);
end




function buttondown_axes(hObject, eventdata, axnr)

handles = guidata(hObject);
if isequal(get(handles.tool_paint, 'State'), 'on'),
    handles = saveundoinfo(handles, unique([axnr handles.paintdata.lastchgaxes]));
    
    handles.paintdata.painting = 1;
    handles.paintdata.lastchgaxes = axnr;
    handles.chosenfiles(axnr).curtype = 5;

    % reset polygon data
    handles.polygons{axnr} = {};
    guidata(hObject, handles);
    
    paintinaxes(handles.figure1, get(handles.figure1, 'CurrentPoint'), axnr); 
    
elseif isequal(get(handles.tool_polygondraw, 'State'), 'on'),
    
    % draw polygon
    axh = handles.(sprintf('axes%d',axnr));
    hpoly = impoly(axh);
    try
        Ppos = getPosition(hpoly);
        delete(hpoly);
    catch ME,       % catch errors if hpoly not a proper polygon
        Ppos = [];
    end
    if ~isempty(Ppos),
        handles = saveundoinfo(handles, unique([axnr handles.paintdata.lastchgaxes]));

        sheet = ~roipoly(handles.chosenfiles(axnr).im, Ppos(:,1), Ppos(:,2));
        for k=1:length(handles.polygons{axnr}),
            sheet = sheet & ~roipoly(sheet, handles.polygons{axnr}{k}(:,1), handles.polygons{axnr}{k}(:,2));
        end
        % save polygon and sheet
        handles.polygons{axnr}{end+1} = Ppos;
        handles.chosenfiles(axnr).sheet = uint8(sheet);
        handles.paintdata.lastchgaxes = axnr;
        handles.chosenfiles(axnr).curtype = 5;

        % draw the image
        combim = combineimage(handles, axnr);
        imh = findobj(axh, 'Type', 'image');
        set(imh, 'CData', combim);
        writeaxestitle(handles, axnr)
        writeimagenumber(handles, axnr);
        
        guidata(axh, handles);
    end

end



function figure1_WindowButtonUpFcn(hObject, eventdata, handles)

if isequal(get(handles.tool_paint, 'State'), 'on') && handles.paintdata.painting,
    handles.paintdata.painting = 0;
    handles.paintdata.lastidx = [];
    handles.paintdata.lastpt = [];
    guidata(hObject, handles);
    
    for k=1:handles.nraxes,
        if handles.chosenfiles(k).curtype == 5,
            writeaxestitle(handles, k);
            writeimagenumber(handles, k);
        end
    end
end



function tool_polygondraw_OnCallback(hObject, eventdata, handles)

toolhandles = [handles.tool_paint handles.tool_zoomin handles.tool_zoomout handles.tool_pan];
for th = toolhandles,
    if isequal(get(th, 'State'), 'on'),
        set(th, 'State', 'off');
    end
end
seticon_selected(hObject);


function tool_polygondraw_OffCallback(hObject, eventdata, handles)

seticon_deselected(hObject);




% UNDO/REDO callbacks and functions
% ------------------------------------------------------------------

function tool_undo_ClickedCallback(hObject, eventdata, handles)

handles = doundo(handles);
guidata(hObject, handles);


function tool_redo_ClickedCallback(hObject, eventdata, handles)

handles = doredo(handles);
guidata(hObject, handles);


% delete all undo data
function handles = resetundoinfo(handles)

handles.undoidx = 1;
handles.undodata = struct('axnr', [], 'sheet', [], 'polygons', [], 'curtype', []);
handles.paintdata.lastchgaxes = [];
set(handles.tool_redo, 'Enable', 'off')
set(handles.tool_undo, 'Enable', 'off')


% save undo data (Note: AXNR may be a vector)
function handles = saveundoinfo(handles, axnr)
 
handles.undodata(handles.undoidx).axnr = axnr;
handles.undodata(handles.undoidx).sheet = {handles.chosenfiles(axnr).sheet};
handles.undodata(handles.undoidx).polygons = {handles.polygons{axnr}};
handles.undodata(handles.undoidx).curtype = [handles.chosenfiles(axnr).curtype];
handles.undodata = handles.undodata(1:handles.undoidx);  % discard previously undone data

handles.undoidx = handles.undoidx + 1;

set(handles.tool_undo, 'Enable', 'on')
set(handles.tool_redo, 'Enable', 'off')


% delete undo information related to one axes
function handles = clearsingleaxesundo(handles, axnr)

k = 1;
while k <= length(handles.undodata),
    thisidx = find(handles.undodata(k).axnr == axnr);
    
    if ~isempty(thisidx),
        if length(handles.undodata(k).axnr) == 1, 
            handles.undoidx = handles.undoidx - (k < handles.undoidx);
            handles.undodata(k) = [];
            k = k-1;
        else
            otheridx = setdiff(1:length(handles.undodata(k).axnr), thisidx);
            handles.undodata(k).axnr = handles.undodata(k).axnr(otheridx);
            handles.undodata(k).sheet = {handles.undodata(k).sheet{otheridx}};
            handles.undodata(k).polygons = {handles.undodata(k).polygons{otheridx}};
            handles.undodata(k).curtype = handles.undodata(k).curtype(otheridx);
        end
    end
    k = k+1;
end

if handles.paintdata.lastchgaxes == axnr,
    if handles.undoidx > 1,
        handles.undoidx = handles.undoidx - 1;
        handles.paintdata.lastchgaxes = handles.undodata(handles.undoidx).axnr;
    else
        handles = resetundoinfo(handles);
    end
end

if handles.undoidx <= 1,
    set(handles.tool_undo, 'Enable', 'off');
end
if handles.undoidx >= length(handles.undodata),
    set(handles.tool_redo, 'Enable', 'off');
end




function handles = doundo(handles)

if handles.undoidx <= 1,
    return
end

% if no undos done before, add current image to undo list
if handles.undoidx > length(handles.undodata),
    handles = saveundoinfo(handles, handles.paintdata.lastchgaxes);
    handles.undoidx = handles.undoidx - 1;
end

% step back and get previous image data
handles.undoidx = handles.undoidx - 1;
for k=1:length(handles.undodata(handles.undoidx).axnr),
    axnr = handles.undodata(handles.undoidx).axnr(k);
    axh = handles.(sprintf('axes%d', axnr));
    handles.polygons{axnr} = handles.undodata(handles.undoidx).polygons{k};
    handles.chosenfiles(axnr).sheet = handles.undodata(handles.undoidx).sheet{k};
    handles.chosenfiles(axnr).curtype = handles.undodata(handles.undoidx).curtype(k);

    viz = get(findobj(axh, 'Type', 'image'), 'Visible'); % save visible status and view axis
    oldax = axis(axh);
    
    drawimage(axh, handles.chosenfiles(axnr).im, handles.chosenfiles(axnr).sheet)
    axis(axh, oldax)
    if isequal(viz, 'on'),
        writeaxestitle(handles, axnr)
    end
    writeimagenumber(handles, axnr);
    
    set(get(axh, 'Children'), 'ButtonDownFcn', {@buttondown_axes, axnr});
    % set to old visibility status
    if ~isempty(viz)
        set(get(axh, 'Children'), 'Visible', viz);
    end
end
    
set(handles.tool_redo, 'Enable', 'on')
if handles.undoidx <= 1,
    set(handles.tool_undo, 'Enable', 'off')
end


function handles = doredo(handles)

if handles.undoidx >= length(handles.undodata),
    return
end

handles.undoidx = handles.undoidx + 1;
for k=1:length(handles.undodata(handles.undoidx).axnr),
    axnr = handles.undodata(handles.undoidx).axnr(k);
    axh = handles.(sprintf('axes%d', axnr));
    handles.polygons{axnr} = handles.undodata(handles.undoidx).polygons{k};
    handles.chosenfiles(axnr).sheet = handles.undodata(handles.undoidx).sheet{k};
    handles.chosenfiles(axnr).curtype = handles.undodata(handles.undoidx).curtype(k);

    viz = get(findobj(axh, 'Type', 'image'), 'Visible'); % save visible status and view axis
    oldax = axis(axh);
  
    drawimage(axh, handles.chosenfiles(axnr).im, handles.chosenfiles(axnr).sheet)
    axis(axh, oldax);
    if isequal(viz, 'on'),
        writeaxestitle(handles, axnr)
    end
    writeimagenumber(handles, axnr);
    
    set(get(axh, 'Children'), 'ButtonDownFcn', {@buttondown_axes, axnr});
    % set to old visibility status
    if ~isempty(viz)
        set(get(axh, 'Children'), 'Visible', viz);
    end
end

set(handles.tool_undo, 'Enable', 'on');
if handles.undoidx >= length(handles.undodata)
    set(handles.tool_redo, 'Enable', 'off')
end



% Key binding definitions
% ------------------------------------------------------------------

function figure1_KeyPressFcn(hObject, eventdata, handles)

if length(eventdata.Modifier) == 1 && isequal(eventdata.Modifier{1}, 'alt'),
    switch eventdata.Key,
        case 'n', % fast forward button
            if isequal(get(handles.button_ffwd, 'Enable'), 'on'),
                button_ffwd_Callback(handles.button_ffwd, [], handles)
            end
        case 'b', % fast backward button
            if isequal(get(handles.button_fbwd, 'Enable'), 'on'),
                button_fbwd_Callback(handles.button_fbwd, [], handles)
            end
    end
else

    switch eventdata.Character,
        case 'n',  % next button
            if isequal(get(handles.button_next, 'Enable'), 'on'),
                button_next_Callback(handles.button_next, [], handles);
            end
        case 'b',  % prev button
            if isequal(get(handles.button_prev, 'Enable'), 'on'),
                button_prev_Callback(handles.button_prev, [], handles);
            end
        case 'v',  % first page button
            if isequal(get(handles.button_begin, 'Enable'), 'on'),
                button_begin_Callback(handles.button_begin, [], handles);
            end            
        case 'm',  % last page button
            if isequal(get(handles.button_end, 'Enable'), 'on'),
                button_end_Callback(handles.button_end, [], handles);
            end
        case 'p',  % draw polygon tool
            if isequal(get(handles.tool_polygondraw, 'Enable'), 'on'),
                if isequal(get(handles.tool_polygondraw, 'State'), 'off')
                    set(handles.tool_polygondraw, 'State', 'on')
                else
                    set(handles.tool_polygondraw, 'State', 'off')
                end
            end

        case 'o', % paint tool
            if isequal(get(handles.tool_paint, 'Enable'), 'on'),
                if isequal(get(handles.tool_paint, 'State'), 'off')
                    set(handles.tool_paint, 'State', 'on')
                else
                    set(handles.tool_paint, 'State', 'off')
                end
            end

        case 'u', % undo
            if isequal(get(handles.tool_undo, 'Enable'), 'on')
                tool_undo_ClickedCallback(handles.tool_undo, [], handles);
            end

        case 'r', % redo
            if isequal(get(handles.tool_redo, 'Enable'), 'on')
                tool_redo_ClickedCallback(handles.tool_redo, [], handles);
            end

        case 'z', % zoom in
            if isequal(get(handles.tool_zoomin, 'Enable'), 'on')
                if isequal(get(handles.tool_zoomin, 'State'), 'off'),
                    set(handles.tool_zoomin, 'State', 'on')
                else
                    set(handles.tool_zoomin, 'State', 'off')
                end
            end

        case 'x', % zoom out
            if isequal(get(handles.tool_zoomout, 'Enable'), 'on'),
                if isequal(get(handles.tool_zoomout, 'State'), 'off')
                    set(handles.tool_zoomout, 'State', 'on')
                else
                    set(handles.tool_zoomout, 'State', 'off')
                end
            end

        case 'c', % pan
            if isequal(get(handles.tool_pan, 'Enable'), 'on')
                if isequal(get(handles.panobject, 'Enable'), 'off')
                    set(handles.panobject, 'Enable', 'on')
                else
                    set(handles.panobject, 'Enable', 'off')
                end
            end

        case '+', % zoom in directly
            if isequal(get(handles.tool_zoomin, 'Enable'), 'on')
                zoom(1.7)
            end

        case '-', % zoom out directly
            if isequal(get(handles.tool_zoomout, 'Enable'), 'on')
                zoom(1/1.7)
            end

        case '*', % reset zoom
            if isequal(get(handles.tool_zoomout, 'Enable'), 'on')
                zoom out
            end

        case {'0','1','2','3','4'}, % enlarge axes 1-4
            if isequal(get(handles.menu_reset4, 'Enable'), 'on'),
                axnr = str2double(eventdata.Character);
                menu_enlarge_Callback(hObject, [], handles, axnr);
            end

        otherwise
            % arrow keys to move zoomed in image
            switch eventdata.Key,
                case 'leftarrow',
                    movecurrentimage(handles, 1);
                case 'rightarrow',
                    movecurrentimage(handles, 2);
                case 'uparrow',
                    movecurrentimage(handles, 3);
                case 'downarrow',
                    movecurrentimage(handles, 4);
            end
    end
end




