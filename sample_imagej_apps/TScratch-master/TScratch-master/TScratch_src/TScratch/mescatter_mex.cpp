/*
 *  mescatter_mex.cpp
 *  
 *
 *  Created by Tobias Geback on 24.4.2008.
 *  Copyright 2008 __MyCompanyName__. All rights reserved.
 *
 */

#include "mex.h"
#include <cmath>

const double SQRT2 = 1.414213562373095;

void mexFunction(int nlhs, mxArray* plhs[], int nrhs, const mxArray* prhs[])
{
    if (nrhs != 3)
        mexErrMsgTxt("3 inputs required");
    
    if (nlhs != 1)
        mexErrMsgTxt("1 output required");
    
    double *x, *w;
    x = mxGetPr(prhs[0]);
    int m = mxGetM(prhs[0]);
    int n = mxGetN(prhs[0]);
    
    if (mxIsEmpty(prhs[1]) || mxIsEmpty(prhs[2]))
        mexErrMsgTxt("Arguments NumEx and Transp must be non-empty!");
    int Ne = (int) mxGetScalar(prhs[1]);
    int transpose = mxGetScalar(prhs[2]);
    
    if (transpose) {
        int a = 2 * (n + Ne);
        int ff = Ne / n + 1;
        
        plhs[0] = mxCreateDoubleMatrix(m, a, mxREAL);
        w = mxGetPr(plhs[0]);
        
        {for (int k1 = a - n - Ne; k1 < a-n; k1++) {
            int ri = k1*m;
            int fi = ((k1 - a + (ff + 1)*n) % n) * m;
            for (int j = 0; j < m; j++)
                w[ri + j] = -x[fi + j];
        }}
        {for (int k1 = a-n+1; k1 < a; k1++) {
            int ri = k1*m;
            int fi = ((a-k1) % n) * m;
            for (int j = 0; j < m; j++)
                w[ri + j] = x[fi + j];
        }}
        for (int j = 0; j < m; j++)
            w[j] = x[j] * SQRT2;
        
        {for (int k1 = 1; k1 < n; k1++) {
            int ri = k1*m;
            int fi = k1*m;
            for (int j = 0; j < m; j++)
                w[ri + j] = x[fi + j];
        }}
        {for (int k1 = n+1; k1 < n+Ne; k1++) {
            int ri = k1*m;
            int fi = ((-k1 + (ff+1)*n) % n) * m;
            for (int j = 0; j < m; j++)
                w[ri + j] = -x[fi + j];
        }}
        
    }
    else {
        int a = 2 * (m + Ne);
        int ff = Ne / m + 1;
        
        plhs[0] = mxCreateDoubleMatrix(a, n, mxREAL);
        w = mxGetPr(plhs[0]);
        
        {for (int k1 = a - m - Ne; k1 < a-m; k1++) {
            int fi = (k1 - a + (ff + 1)*m) % m;
            for (int j = 0; j < n; j++)
                w[k1 + j*a] = -x[fi + j*m];
        }}
        {for (int k1 = a-m+1; k1 < a; k1++) {
            int fi = (a-k1) % m;
            for (int j = 0; j < n; j++)
                w[k1 + j*a] = x[fi + j*m];
        }}
        for (int j = 0; j < n; j++)
            w[j*a] = x[j*m] * SQRT2;
        
        {for (int k1 = 1; k1 < m; k1++) {
            int fi = k1;
            for (int j = 0; j < n; j++)
                w[k1 + j*a] = x[fi + j*m];
        }}
        {for (int k1 = m+1; k1 < m+Ne; k1++) {
            int fi = (-k1 + (ff+1)*m) % m;
            for (int j = 0; j < n; j++)
                w[k1 + j*a] = -x[fi + j*m];
        }}
    }
    
    
    return;

}
