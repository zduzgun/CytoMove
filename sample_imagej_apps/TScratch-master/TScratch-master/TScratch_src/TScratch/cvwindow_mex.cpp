/*
 *  cvwindow_mex.cpp
 *
 *
 *  Created by Tobias Geback on 24.4.2008.
 *  Copyright 2008 __MyCompanyName__. All rights reserved.
 *
 */

#include "mex.h"
#include <cmath>

const double EPS = 2.2205e-16;

void mexFunction(int nlhs, mxArray* plhs[], int nrhs, const mxArray* prhs[])
{
    if (nrhs != 5)
        mexErrMsgTxt("5 inputs required");
    
    if (nlhs != 1)
        mexErrMsgTxt("1 output required");
    
    double *x, *w;
    int m = mxGetM(prhs[0]);
    int n = mxGetN(prhs[0]);
    
    x = mxGetPr(prhs[0]);
    
    if (mxIsEmpty(prhs[1]) || mxIsEmpty(prhs[2]) || mxIsEmpty(prhs[3]) || mxIsEmpty(prhs[4]))
        mexErrMsgTxt("Filter parameters must be nonempty!");
    double lows = mxGetScalar(prhs[1]);
    double lowdist = mxGetScalar(prhs[2]);
    double his = mxGetScalar(prhs[3]);
    double hidist = mxGetScalar(prhs[4]);
    
    if (lowdist == 0.0 || hidist == 0.0)
        mexErrMsgTxt("LoW and HiW must be non-zero!");
    
    plhs[0] = mxCreateDoubleMatrix(m, n, mxREAL);
    w = mxGetPr(plhs[0]);
    
    
    for (int k=0; k<m*n; k++) {
        double xl = (x[k] - lows) / lowdist;
        double xr = (x[k] - his) / hidist;
        double rv, lv;
        
        if (xl < EPS || xr > 1.0 - EPS)
            w[k] = 0.0;
        else {
            if (xl > 1.0 - EPS)
                lv = 1.0;
            else {
                double a = exp(1 - 1/(1 - exp(1 - 1 / (1 - xl))));
                double b = exp(1 - 1/(1 - exp(1 - 1 / xl)));
                double nrm = sqrt(a*a + b*b);
                lv = a / nrm;
            }
            
            if (xr < EPS)
                rv = 1.0;
            else {
                double a = exp(1 - 1/(1 - exp(1 - 1 / (1 - xr))));
                double b = exp(1 - 1/(1 - exp(1 - 1 / xr)));
                double nrm = sqrt(a*a + b*b);
                rv = b / nrm;
            }
            
            w[k] = rv*lv;
        }
    }
    
    return;
}
