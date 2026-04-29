function varargout = scratchsettings(varargin)
% SCRATCHSETTINGS M-file for scratchsettings.fig
%      SCRATCHSETTINGS, by itself, creates a new SCRATCHSETTINGS or raises the existing
%      singleton*.
%
%      H = SCRATCHSETTINGS returns the handle to a new SCRATCHSETTINGS or
%      the handle to
%      the existing singleton*.
%
%      SCRATCHSETTINGS('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in SCRATCHSETTINGS.M with the given input arguments.
%
%      SCRATCHSETTINGS('Property','Value',...) creates a new SCRATCHSETTINGS or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before scratchsettings_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to scratchsettings_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
%      SCRATCHSETTINGS implements a settings dialog for the TScratch
%      program, enabling the user to set parameters for the analysis.
%      SCRATCHSETTINGS is called from SCRATCHASSAY.
%
%      [OK, OUTOPTS] = SCRATCHSETTINGS(OPTS, MODE) sets values for
%      parameters in the OPTS structure (see SCRATCH_GETDEFAULTOPTS) to
%      show in the dialog. If MODE is non-zero, some options that are not
%      available when the curvelet part of the analysis has been made (see
%      SCRATCHAREA_ONE) are disabled.
%      The output OK is non-zero if the OK button was pressed, and zero if
%      Cancel was pressed. OUTOPTS contains the current parameter settings
%      present in the window (regardless of the button pressed to close the
%      window.
%
% See also: GUIDE, GUIDATA, GUIHANDLES, SCRATCH_GETDEFAULTOPTS,
%   SCRATCHASSAY, SCRATCHAREA_ONE

% Edit the above text to modify the response to help scratchsettings

% Last Modified by GUIDE v2.5 29-May-2008 17:46:41

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @scratchsettings_OpeningFcn, ...
                   'gui_OutputFcn',  @scratchsettings_OutputFcn, ...
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


% --- Executes just before scratchsettings is made visible.
function scratchsettings_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to scratchsettings (see VARARGIN)

% Choose default command line output for scratchsettings
handles.output = hObject;
if nargin > 4,
    handles.mode = varargin{2};
else
    handles.mode = 0;
end
if nargin > 3,
    handles.opts = varargin{1};
else
    handles.opts = scratch_getdefaultopts();
end
handles.ok = 0;

setwindowvalues(handles);
disableformode(handles);
set(handles.check_displayadvanced, 'Value', 0);
check_displayadvanced_Callback(handles.check_displayadvanced, [], handles);

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes scratchsettings wait for user response (see UIRESUME)
uiwait(handles.scratchsettings);


% --- Outputs from this function are returned to the command line.
function varargout = scratchsettings_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
if nargout == 2,
    if ~ishandle(hObject),  % if figure was already deleted
        varargout = {0, []};
    else
        varargout{1} = handles.ok;   % return 1 if OK was pressed, 0 if Cancel
        varargout{2} = handles.opts; % the actual settings
    end
end
if ishandle(hObject),
    delete(handles.scratchsettings);
end


function [val, ok] = gettextboxval(defval, handle, lo, hi)

val = str2double(get(handle,'String'));
ok = 1;
if isnan(val) || val < lo || val > hi,
    val = defval;
    ok = 0;
    errordlg(sprintf('The value must be between %.2f and %.2f!', lo, hi), 'Value error');
end




function setwindowvalues(handles)

set(handles.check_writeanalysed, 'Value', handles.opts.prgopts.write_imgs);
set(handles.check_skipcategories, 'Value', handles.opts.prgopts.skip_catmode);
set(handles.check_displaycurve, 'Value', handles.opts.prgopts.display_curve);

set(handles.edit_defaultthresh, 'String', num2str(handles.opts.default_thresh));
set(handles.edit_diskradius, 'String', num2str(handles.opts.disk_radius));
set(handles.edit_holearea, 'String', num2str(handles.opts.hole_area));
set(handles.edit_islandarea, 'String', num2str(handles.opts.island_area));
set(handles.edit_erodesize, 'String', num2str(handles.opts.erode_size));

set(handles.slider_defaultthresh, 'Value', handles.opts.default_thresh);
set(handles.slider_diskradius, 'Value', handles.opts.disk_radius);
set(handles.slider_holearea, 'Value', handles.opts.hole_area);
set(handles.slider_islandarea, 'Value', handles.opts.island_area);
set(handles.slider_erodesize, 'Value', handles.opts.erode_size);

set(handles.edit_thrshofs, 'String', num2str(handles.opts.thresh_offset));
set(handles.edit_darkimgths, 'String', num2str(handles.opts.darkimg_thresh));
set(handles.check_scalebg, 'Value', handles.opts.bgscale);

set(handles.edit_diffmin, 'String', num2str(handles.opts.advanced.diff_from_min));
set(handles.edit_bumpsize, 'String', num2str(handles.opts.advanced.bump_size));
set(handles.edit_lothrsh, 'String', num2str(handles.opts.advanced.lolim));
set(handles.edit_hithrsh, 'String', num2str(handles.opts.advanced.hilim));
set(handles.edit_lomaxhi, 'String', num2str(handles.opts.advanced.lomaxHi));
set(handles.edit_himaxlo, 'String', num2str(handles.opts.advanced.himaxLo));
set(handles.edit_lomaxheight, 'String', num2str(handles.opts.advanced.lomaxHeight));
set(handles.edit_maxmindiff, 'String', num2str(handles.opts.advanced.maxminDiff));



function disableformode(handles)

modhandles = [handles.check_displaycurve ...
    handles.check_skipcategories ...
    handles.edit_diskradius ...
    handles.edit_defaultthresh ...
    handles.edit_diffmin ...
    handles.edit_bumpsize ...
    handles.edit_lothrsh ...
    handles.edit_hithrsh ...
    handles.edit_lomaxhi ...
    handles.edit_himaxlo ...
    handles.edit_lomaxheight ...
    handles.edit_maxmindiff ...
    handles.edit_darkimgths ...
    handles.check_scalebg ...
    handles.edit_thrshofs ...
    handles.slider_diskradius ...
    handles.slider_defaultthresh ...
    ];
if handles.mode > 0,
    set(modhandles, 'Enable', 'off');
else
    set(modhandles, 'Enable', 'on');
end


% --- Executes on button press in button_ok.
function button_ok_Callback(hObject, eventdata, handles)
% hObject    handle to button_ok (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.ok = 1;
guidata(hObject, handles);
uiresume(handles.scratchsettings);


% --- Executes on button press in button_cancel.
function button_cancel_Callback(hObject, eventdata, handles)
% hObject    handle to button_cancel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.ok = 0;
guidata(hObject, handles);
uiresume(handles.scratchsettings);


% reset all parameter values to defaults
function button_reset_Callback(hObject, eventdata, handles)

handles.opts = scratch_getdefaultopts(1);
guidata(hObject, handles);
setwindowvalues(handles);



% --- Executes on button press in check_writeanalysed.
function check_writeanalysed_Callback(hObject, eventdata, handles)
% hObject    handle to check_writeanalysed (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.opts.prgopts.write_imgs = get(hObject, 'Value');
guidata(hObject, handles);


% --- Executes on button press in check_skipcategories.
function check_skipcategories_Callback(hObject, eventdata, handles)
% hObject    handle to check_skipcategories (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.opts.prgopts.skip_catmode = get(hObject, 'Value');
guidata(hObject, handles);


% --- Executes on button press in check_scalebg.
function check_scalebg_Callback(hObject, eventdata, handles)
% hObject    handle to check_scalebg (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.opts.bgscale = get(hObject, 'Value');
guidata(hObject, handles);



% --- Executes on button press in check_displaycurve.
function check_displaycurve_Callback(hObject, eventdata, handles)
% hObject    handle to check_displaycurve (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

handles.opts.prgopts.display_curve = get(hObject, 'Value');
guidata(hObject, handles);


function edit_defaultthresh_Callback(hObject, eventdata, handles)
% hObject    handle to edit_defaultthresh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit_defaultthresh as text
%        str2double(get(hObject,'String')) returns contents of edit_defaultthresh as a double

[handles.opts.default_thresh, ok] = gettextboxval(handles.opts.default_thresh, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.default_thresh));
else
    set(handles.slider_defaultthresh, 'Value', handles.opts.default_thresh);
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_defaultthresh_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_defaultthresh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_diskradius_Callback(hObject, eventdata, handles)
% hObject    handle to edit_diskradius (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


[handles.opts.disk_radius, ok] = gettextboxval(handles.opts.disk_radius, hObject, 0.0, 15.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.disk_radius));
else
    set(handles.slider_diskradius, 'Value', handles.opts.disk_radius);
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_diskradius_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_diskradius (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_thrshofs_Callback(hObject, eventdata, handles)
% hObject    handle to edit_thrshofs (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.thresh_offset, ok] = gettextboxval(handles.opts.thresh_offset, hObject, -1.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.thresh_offset));
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_thrshofs_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_thrshofs (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_holearea_Callback(hObject, eventdata, handles)
% hObject    handle to edit_holearea (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.hole_area, ok] = gettextboxval(handles.opts.hole_area, hObject, 0.0, 0.5);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.hole_area));
else
    set(handles.slider_holearea, 'Value', handles.opts.hole_area);
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_holearea_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_holearea (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_islandarea_Callback(hObject, eventdata, handles)
% hObject    handle to edit_islandarea (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.island_area, ok] = gettextboxval(handles.opts.island_area, hObject, 0.0, 0.5);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.island_area));
else
    set(handles.slider_islandarea, 'Value', handles.opts.island_area);
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_islandarea_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_islandarea (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_erodesize_Callback(hObject, eventdata, handles)

[handles.opts.erode_size, ok] = gettextboxval(handles.opts.erode_size, hObject, 0.0, 0.5);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.erode_size));
else
    set(handles.slider_erodesize, 'Value', handles.opts.erode_size);
end
guidata(hObject, handles);



function edit_erodesize_CreateFcn(hObject, eventdata, handles)

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_darkimgths_Callback(hObject, eventdata, handles)
% hObject    handle to edit_darkimgths (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.darkimg_thresh, ok] = gettextboxval(handles.opts.darkimg_thresh, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.darkimg_thresh));
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_darkimgths_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_darkimgths (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_diffmin_Callback(hObject, eventdata, handles)
% hObject    handle to edit_diffmin (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.diff_from_min, ok] = gettextboxval(handles.opts.advanced.diff_from_min, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.diff_from_min));
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_diffmin_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_diffmin (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_bumpsize_Callback(hObject, eventdata, handles)
% hObject    handle to edit_bumpsize (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.bump_size, ok] = gettextboxval(handles.opts.advanced.bump_size, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.bump_size));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_bumpsize_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_bumpsize (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_lothrsh_Callback(hObject, eventdata, handles)
% hObject    handle to edit_lothrsh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.lolim, ok] = gettextboxval(handles.opts.advanced.lolim, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.lolim));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_lothrsh_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_lothrsh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_hithrsh_Callback(hObject, eventdata, handles)
% hObject    handle to edit_hithrsh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.hilim, ok] = gettextboxval(handles.opts.advanced.hilim, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.hilim));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_hithrsh_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_hithrsh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_lomaxhi_Callback(hObject, eventdata, handles)
% hObject    handle to edit_lomaxhi (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.lomaxHi, ok] = gettextboxval(handles.opts.advanced.lomaxHi, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.lomaxHi));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_lomaxhi_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_lomaxhi (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_himaxlo_Callback(hObject, eventdata, handles)
% hObject    handle to edit_himaxlo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.himaxLo, ok] = gettextboxval(handles.opts.advanced.himaxLo, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.himaxLo));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_himaxlo_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_himaxlo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_maxmindiff_Callback(hObject, eventdata, handles)
% hObject    handle to edit_maxmindiff (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.maxminDiff, ok] = gettextboxval(handles.opts.advanced.maxminDiff, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.maxminDiff));
end
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function edit_maxmindiff_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_maxmindiff (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit_lomaxheight_Callback(hObject, eventdata, handles)
% hObject    handle to edit_lomaxheight (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[handles.opts.advanced.lomaxHeight, ok] = gettextboxval(handles.opts.advanced.lomaxHeight, hObject, 0.0, 1.0);
if ~ok,
    set(hObject, 'String', num2str(handles.opts.advanced.maxminDiff));
end
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_lomaxheight_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit_lomaxheight (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in check_displayadvanced.
function check_displayadvanced_Callback(hObject, eventdata, handles)
% hObject    handle to check_displayadvanced (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

if get(handles.check_displayadvanced, 'Value'),
    set(handles.panel_advanced, 'Visible', 'on');

    pos = get(handles.scratchsettings, 'Position');
    pos_ap = get(handles.panel_advanced, 'Position');
    pos(3) = pos_ap(1) + pos_ap(3) + 5;  % set width of window
    set(handles.scratchsettings, 'Position', pos);
    
else
    pos = get(handles.scratchsettings, 'Position');
    pos_ap = get(handles.panel_analysis, 'Position');
    pos(3) = pos_ap(1) + pos_ap(3) + 5;  % set width of window
    set(handles.scratchsettings, 'Position', pos);

    set(handles.panel_advanced, 'Visible', 'off');
end



%--------- SLIDER control ---------%

% --- Executes on slider movement.
function val = slider_Callback(step, hObject, handles)
% step       the step size for changes
% handles    structure with handles and user data (see GUIDATA)

val = round(1/step * get(hObject, 'Value')) * step;
name = get(hObject, 'String');
editboxtag = sprintf('edit_%s',name);
set(handles.(editboxtag), 'String', num2str(val));


% --- Executes during object creation, after setting all properties.
function slider_defaultthresh_CreateFcn(hObject, eventdata, handles)
% hObject    handle to slider_defaultthresh (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on slider movement.
function slider_defaultthresh_Callback(hObject, eventdata, handles)

val = slider_Callback(0.01, hObject, handles);
handles.opts.default_thresh = val;
guidata(hObject, handles);


function slider_diskradius_Callback(hObject, eventdata, handles)

val = slider_Callback(1, hObject, handles);
handles.opts.disk_radius = val;
guidata(hObject, handles);


function slider_diskradius_CreateFcn(hObject, eventdata, handles)

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


function slider_holearea_Callback(hObject, eventdata, handles)

val = slider_Callback(0.01, hObject, handles);
handles.opts.hole_area = val;
guidata(hObject, handles);


function slider_holearea_CreateFcn(hObject, eventdata, handles)

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


function slider_islandarea_Callback(hObject, eventdata, handles)

val = slider_Callback(0.01, hObject, handles);
handles.opts.island_area = val;
guidata(hObject, handles);


function slider_islandarea_CreateFcn(hObject, eventdata, handles)

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


function slider_erodesize_Callback(hObject, eventdata, handles)

val = slider_Callback(1, hObject, handles);
handles.opts.erode_size = val;
guidata(hObject, handles);


function slider_erodesize_CreateFcn(hObject, eventdata, handles)

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end




