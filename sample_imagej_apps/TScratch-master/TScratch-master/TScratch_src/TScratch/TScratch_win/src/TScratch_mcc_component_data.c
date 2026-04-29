/*
 * MATLAB Compiler: 4.8 (R2008a)
 * Date: Tue Jul 01 22:35:36 2008
 * Arguments: "-B" "macro_default" "-o" "TScratch" "-W" "WinMain:TScratch" "-d"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\TScratch_win\src" "-T" "link:exe" "-v"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratchassay.m" "-a" "C:\Documents and
 * Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\crvlt_getmagnitudeME.mexw32" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\cvwindow_mex.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\cvwindow_mex.mexw32" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\dlg_question.fig" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\dlg_question.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\ipticondir.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\makeanalimgfilename.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\makedatafilename.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\mecombine.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\mefcv2_variant.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\mescatter_mex.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\mescatter_mex.mexw32" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratch_applythresh.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratch_fillholes.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratch_getdefaultopts.m"
 * "-a" "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratch_removeislands.m" "-a" "C:\Documents
 * and Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratcharea_dir.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratcharea_multidir.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratcharea_one.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratcharea_reanalyze.m" "-a" "C:\Documents
 * and Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratchassay.fig" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratchopts.mat" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\scratchsettings.fig" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\scratchsettings.m" "-a" "C:\Documents and
 * Settings\Tobias\My Documents\MATLAB\ScratchAssay\writemultidata.m" "-a"
 * "C:\Documents and Settings\Tobias\My
 * Documents\MATLAB\ScratchAssay\crvlt_getmagnitudeME.m" 
 */

#include "mclmcrrt.h"

#ifdef __cplusplus
extern "C" {
#endif
const unsigned char __MCC_TScratch_session_key[] = {
    '6', 'A', 'D', 'C', '5', '8', 'F', '0', '5', 'C', '3', '0', '8', 'A', '0',
    'D', '4', '1', 'D', '7', '6', '0', 'F', '7', 'A', '4', '8', 'C', '7', 'F',
    'C', '5', '7', 'B', '1', 'C', 'F', 'F', '4', '4', 'B', '1', '3', '3', '8',
    '5', 'A', '7', '1', '6', '7', '7', 'C', 'B', 'B', '9', 'C', '5', '0', '8',
    '6', 'F', 'C', '4', 'F', 'E', 'B', '5', 'C', '1', '5', '2', 'F', '1', '0',
    '8', '1', '0', 'F', 'C', 'F', 'F', 'E', '7', 'B', '4', '0', '5', '8', 'A',
    'C', 'C', '6', '1', 'C', 'B', '3', '2', 'E', '8', '3', '2', '9', '1', 'E',
    '1', 'B', 'F', 'E', '9', '8', 'E', 'C', '0', '3', 'B', '5', 'C', '6', '7',
    '8', 'C', 'B', '9', '2', '3', '8', '3', '8', '3', '3', 'A', 'D', '6', '2',
    '1', 'D', '2', '0', '4', '7', 'C', 'D', 'B', '2', 'A', 'C', '3', '9', 'D',
    '5', '6', '0', 'A', '1', 'B', '4', '4', 'E', '0', '0', 'D', 'A', 'E', 'D',
    'F', 'F', 'A', '1', '1', '4', '1', 'A', 'C', 'B', '5', '4', 'C', 'C', 'B',
    'A', 'A', '2', 'D', '2', 'B', '0', '5', '9', '7', 'E', '8', '9', 'E', '0',
    '7', '0', '4', '3', 'D', '0', '2', '0', 'F', '9', '4', '0', 'B', '3', '1',
    'B', '6', 'E', '5', '5', 'C', '1', '9', 'E', 'F', 'B', '7', '7', 'B', 'C',
    '5', '7', '1', '9', '1', 'F', '7', '1', '1', 'F', '0', '3', '5', 'A', 'A',
    '6', '3', '3', 'C', '9', 'D', 'A', 'A', 'E', '5', '5', 'F', '7', '6', '3',
    'C', '\0'};

const unsigned char __MCC_TScratch_public_key[] = {
    '3', '0', '8', '1', '9', 'D', '3', '0', '0', 'D', '0', '6', '0', '9', '2',
    'A', '8', '6', '4', '8', '8', '6', 'F', '7', '0', 'D', '0', '1', '0', '1',
    '0', '1', '0', '5', '0', '0', '0', '3', '8', '1', '8', 'B', '0', '0', '3',
    '0', '8', '1', '8', '7', '0', '2', '8', '1', '8', '1', '0', '0', 'C', '4',
    '9', 'C', 'A', 'C', '3', '4', 'E', 'D', '1', '3', 'A', '5', '2', '0', '6',
    '5', '8', 'F', '6', 'F', '8', 'E', '0', '1', '3', '8', 'C', '4', '3', '1',
    '5', 'B', '4', '3', '1', '5', '2', '7', '7', 'E', 'D', '3', 'F', '7', 'D',
    'A', 'E', '5', '3', '0', '9', '9', 'D', 'B', '0', '8', 'E', 'E', '5', '8',
    '9', 'F', '8', '0', '4', 'D', '4', 'B', '9', '8', '1', '3', '2', '6', 'A',
    '5', '2', 'C', 'C', 'E', '4', '3', '8', '2', 'E', '9', 'F', '2', 'B', '4',
    'D', '0', '8', '5', 'E', 'B', '9', '5', '0', 'C', '7', 'A', 'B', '1', '2',
    'E', 'D', 'E', '2', 'D', '4', '1', '2', '9', '7', '8', '2', '0', 'E', '6',
    '3', '7', '7', 'A', '5', 'F', 'E', 'B', '5', '6', '8', '9', 'D', '4', 'E',
    '6', '0', '3', '2', 'F', '6', '0', 'C', '4', '3', '0', '7', '4', 'A', '0',
    '4', 'C', '2', '6', 'A', 'B', '7', '2', 'F', '5', '4', 'B', '5', '1', 'B',
    'B', '4', '6', '0', '5', '7', '8', '7', '8', '5', 'B', '1', '9', '9', '0',
    '1', '4', '3', '1', '4', 'A', '6', '5', 'F', '0', '9', '0', 'B', '6', '1',
    'F', 'C', '2', '0', '1', '6', '9', '4', '5', '3', 'B', '5', '8', 'F', 'C',
    '8', 'B', 'A', '4', '3', 'E', '6', '7', '7', '6', 'E', 'B', '7', 'E', 'C',
    'D', '3', '1', '7', '8', 'B', '5', '6', 'A', 'B', '0', 'F', 'A', '0', '6',
    'D', 'D', '6', '4', '9', '6', '7', 'C', 'B', '1', '4', '9', 'E', '5', '0',
    '2', '0', '1', '1', '1', '\0'};

static const char * MCC_TScratch_matlabpath_data[] = 
  { "TScratch/", "toolbox/compiler/deploy/", "$TOOLBOXMATLABDIR/general/",
    "$TOOLBOXMATLABDIR/ops/", "$TOOLBOXMATLABDIR/lang/",
    "$TOOLBOXMATLABDIR/elmat/", "$TOOLBOXMATLABDIR/elfun/",
    "$TOOLBOXMATLABDIR/specfun/", "$TOOLBOXMATLABDIR/matfun/",
    "$TOOLBOXMATLABDIR/datafun/", "$TOOLBOXMATLABDIR/polyfun/",
    "$TOOLBOXMATLABDIR/funfun/", "$TOOLBOXMATLABDIR/sparfun/",
    "$TOOLBOXMATLABDIR/scribe/", "$TOOLBOXMATLABDIR/graph2d/",
    "$TOOLBOXMATLABDIR/graph3d/", "$TOOLBOXMATLABDIR/specgraph/",
    "$TOOLBOXMATLABDIR/graphics/", "$TOOLBOXMATLABDIR/uitools/",
    "$TOOLBOXMATLABDIR/strfun/", "$TOOLBOXMATLABDIR/imagesci/",
    "$TOOLBOXMATLABDIR/iofun/", "$TOOLBOXMATLABDIR/audiovideo/",
    "$TOOLBOXMATLABDIR/timefun/", "$TOOLBOXMATLABDIR/datatypes/",
    "$TOOLBOXMATLABDIR/verctrl/", "$TOOLBOXMATLABDIR/codetools/",
    "$TOOLBOXMATLABDIR/helptools/", "$TOOLBOXMATLABDIR/winfun/",
    "$TOOLBOXMATLABDIR/demos/", "$TOOLBOXMATLABDIR/timeseries/",
    "$TOOLBOXMATLABDIR/hds/", "$TOOLBOXMATLABDIR/guide/",
    "$TOOLBOXMATLABDIR/plottools/", "toolbox/local/",
    "toolbox/shared/dastudio/", "$TOOLBOXMATLABDIR/datamanager/",
    "toolbox/compiler/", "toolbox/curvefit/curvefit/",
    "toolbox/images/images/", "toolbox/images/imuitools/",
    "toolbox/images/iptutils/", "toolbox/shared/imageslib/",
    "toolbox/images/medformats/", "toolbox/stats/" };

static const char * MCC_TScratch_classpath_data[] = 
  { "java/jar/toolbox/images.jar" };

static const char * MCC_TScratch_libpath_data[] = 
  { "" };

static const char * MCC_TScratch_app_opts_data[] = 
  { "" };

static const char * MCC_TScratch_run_opts_data[] = 
  { "" };

static const char * MCC_TScratch_warning_state_data[] = 
  { "off:MATLAB:dispatcher:nameConflict" };


mclComponentData __MCC_TScratch_component_data = { 

  /* Public key data */
  __MCC_TScratch_public_key,

  /* Component name */
  "TScratch",

  /* Component Root */
  "",

  /* Application key data */
  __MCC_TScratch_session_key,

  /* Component's MATLAB Path */
  MCC_TScratch_matlabpath_data,

  /* Number of directories in the MATLAB Path */
  45,

  /* Component's Java class path */
  MCC_TScratch_classpath_data,
  /* Number of directories in the Java class path */
  1,

  /* Component's load library path (for extra shared libraries) */
  MCC_TScratch_libpath_data,
  /* Number of directories in the load library path */
  0,

  /* MCR instance-specific runtime options */
  MCC_TScratch_app_opts_data,
  /* Number of MCR instance-specific runtime options */
  0,

  /* MCR global runtime options */
  MCC_TScratch_run_opts_data,
  /* Number of MCR global runtime options */
  0,
  
  /* Component preferences directory */
  "TScratch_C11948737993188788D22DA1FAA1448B",

  /* MCR warning status data */
  MCC_TScratch_warning_state_data,
  /* Number of MCR warning status modifiers */
  1,

  /* Path to component - evaluated at runtime */
  NULL

};

#ifdef __cplusplus
}
#endif


