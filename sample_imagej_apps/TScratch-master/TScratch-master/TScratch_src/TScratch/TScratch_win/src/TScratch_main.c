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

#include <stdio.h>
#include "mclmcrrt.h"
#ifdef __cplusplus
extern "C" {
#endif

extern mclComponentData __MCC_TScratch_component_data;

#ifdef __cplusplus
}
#endif

static HMCRINSTANCE _mcr_inst = NULL;


#ifdef __cplusplus
extern "C" {
#endif

static int mclDefaultPrintHandler(const char *s)
{
  return mclWrite(1 /* stdout */, s, sizeof(char)*strlen(s));
}

#ifdef __cplusplus
} /* End extern "C" block */
#endif

#ifdef __cplusplus
extern "C" {
#endif

static int mclDefaultErrorHandler(const char *s)
{
  int written = 0;
  size_t len = 0;
  len = strlen(s);
  written = mclWrite(2 /* stderr */, s, sizeof(char)*len);
  if (len > 0 && s[ len-1 ] != '\n')
    written += mclWrite(2 /* stderr */, "\n", sizeof(char));
  return written;
}

#ifdef __cplusplus
} /* End extern "C" block */
#endif

/* This symbol is defined in shared libraries. Define it here
 * (to nothing) in case this isn't a shared library. 
 */
#ifndef LIB_TScratch_C_API 
#define LIB_TScratch_C_API /* No special import/export declaration */
#endif

LIB_TScratch_C_API 
bool MW_CALL_CONV TScratchInitializeWithHandlers(
    mclOutputHandlerFcn error_handler,
    mclOutputHandlerFcn print_handler
)
{
  if (_mcr_inst != NULL)
    return true;
  if (!mclmcrInitialize())
    return false;
  if (!mclInitializeComponentInstanceWithEmbeddedCTF(&_mcr_inst,
                                                     &__MCC_TScratch_component_data,
                                                     true, NoObjectType,
                                                     ExeTarget, error_handler,
                                                     print_handler, 805283, NULL))
    return false;
  return true;
}

LIB_TScratch_C_API 
bool MW_CALL_CONV TScratchInitialize(void)
{
  return TScratchInitializeWithHandlers(mclDefaultErrorHandler,
                                        mclDefaultPrintHandler);
}

LIB_TScratch_C_API 
void MW_CALL_CONV TScratchTerminate(void)
{
  if (_mcr_inst != NULL)
    mclTerminateInstance(&_mcr_inst);
}

int run_main(int argc, const char **argv)
{
  int _retval;
  /* Generate and populate the path_to_component. */
  char path_to_component[(PATH_MAX*2)+1];
  separatePathName(argv[0], path_to_component, (PATH_MAX*2)+1);
  __MCC_TScratch_component_data.path_to_component = path_to_component; 
  if (!TScratchInitialize()) {
    return -1;
  }
  _retval = mclMain(_mcr_inst, argc, argv, "scratchassay", 1);
  if (_retval == 0 /* no error */) mclWaitForFiguresToDie(NULL);
  TScratchTerminate();
#if defined( _MSC_VER)
  PostQuitMessage(0);
#endif
  mclTerminateApplication();
  return _retval;
}

#if defined( _MSC_VER)

#define argc __argc
#define argv __argv

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPTSTR lpCmdLine, int nCmdShow)
#else
int main(int argc, const char **argv)

#endif
{
  if (!mclInitializeApplication(
    __MCC_TScratch_component_data.runtime_options,
    __MCC_TScratch_component_data.runtime_option_count))
    return 0;
  
  return mclRunMain(run_main, argc, argv);
}
