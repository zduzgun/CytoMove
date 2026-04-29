/*
 *  crvlt_getmagnitude.cpp
 *  
 *
 *  Created by Tobias Geback on 1.2.2008.
 *  Copyright 2008 ETH Zurich. All rights reserved.
 *
 */

#include "mex.h"

#include <vector>
#include <fstream>
#include <complex>
#include <algorithm>
#include <assert.h>

using namespace std;

#ifdef _WIN32
template<class T> const T& max(const T& a, const T& b) { return (a>b) ? a : b; }
template<class T> const T& min(const T& a, const T& b) { return (a<b) ? a : b; }
#endif

typedef std::complex<double> cpx;

// Matrix class definitions

template <class F>
class NumMat {
public:
  int _m, _n;
  F* _data;
public:
  NumMat(int m=0, int n=0): _m(m), _n(n) {
		if(_m>0 && _n>0) {		_data = new F[_m*_n]; assert( _data!=NULL );	 memset(_data, 0, _m*_n*sizeof(F));	 } else		_data = NULL;
  }
  NumMat(const NumMat& C): _m(C._m), _n(C._n) {
		if(_m>0 && _n>0) {		_data = new F[_m*_n]; assert( _data!=NULL );	 memset(_data, 0, _m*_n*sizeof(F));	 } else 		_data = NULL;
		if(_m>0 && _n>0) {		memcpy( _data, C._data, _m*_n*sizeof(F) );	 }
  }
  ~NumMat() {
		if(_m>0 && _n>0) {		delete[] _data; _data = NULL; }
  }
  NumMat& operator=(const NumMat& C) {
		if(_m>0 && _n>0) {		delete[] _data; _data = NULL; }
		_m = C._m; _n=C._n;
		if(_m>0 && _n>0) {		_data = new F[_m*_n]; assert( _data!=NULL );	 memset(_data, 0, _m*_n*sizeof(F));	 } else		_data = NULL;
		if(_m>0 && _n>0) {		memcpy( _data, C._data, _m*_n*sizeof(F) );	 }
		return *this;
  }
  void resize(int m, int n)  {
		if(_m!=m || _n!=n) {
			if(_m>0 && _n>0) {		delete[] _data; _data = NULL;		}
			_m = m; _n = n;
			if(_m>0 && _n>0) {		_data = new F[_m*_n]; assert( _data!=NULL );		memset(_data, 0, _m*_n*sizeof(F));		} else		  _data = NULL;
		}
  }
  const F& operator()(int i, int j) const  {
		assert( i>=0 && i<_m && j>=0 && j<_n );
		return _data[i + j*_m];
  }
  F& operator()(int i, int j)  {
		assert( i>=0 && i<_m && j>=0 && j<_n );
		return _data[i + j*_m];
  }
  int m() const { return _m; }
  int n() const { return _n; }
  F* data() const { return _data; }
};

//INPUT
template <class F> inline istream& operator>>(istream& is, NumMat<F>& mat)
{
  int m,n; is>>m>>n;
  mat.resize(m,n);
  for(int i=0; i<mat.m(); i++)
		for(int j=0; j<mat.n(); j++)
			is>>mat(i,j);
  return is;
}

//OUTPUT
template <class F> inline ostream& operator<<(ostream& os, const NumMat<F>& mat)
{
  os<<mat.m()<<" "<<mat.n()<<endl;
  for(int i=0; i<mat.m(); i++) {
		for(int j=0; j<mat.n(); j++)
			os<<" "<<mat(i,j);
		os<<endl;
  }
  return os;
}
//SET VALUE
template <class F> inline void setvalue(NumMat<F>& M, F val)
{
  for(int i=0; i<M.m(); i++)
		for(int j=0; j<M.n(); j++)
			M(i,j) = val;
}
//CLEAR
template <class F> inline void clear(NumMat<F>& M)
{
  memset(M.data(), 0, M.m()*M.n()*sizeof(F));
}

typedef NumMat<int>    IntNumMat;
typedef NumMat<double> DblNumMat;
typedef NumMat<cpx>    CpxNumMat;


// Vector class definitions

template <class F>
class NumVec {
public:
  int _m;
  F* _data;
public:
  NumVec(int m=0): _m(m) {
		if(_m>0) {		_data = new F[_m]; assert( _data!=NULL );	 memset(_data, 0, _m*sizeof(F));	 } else		_data=NULL;
  }
  NumVec(const NumVec& C): _m(C._m) {
		if(_m>0) {		_data = new F[_m]; assert( _data!=NULL );	 memset(_data, 0, _m*sizeof(F));	 } else 		_data=NULL;
		if(_m>0) {		memcpy( _data, C._data, _m*sizeof(F) );	 }
  }
  ~NumVec() {
		if(_m>0) {		delete[] _data; _data = NULL;	 }
  }
  NumVec& operator=(const NumVec& C) {
		if(_m>0) {		delete[] _data; _data = NULL;	 }
		_m = C._m;
		if(_m>0) {		_data = new F[_m]; assert( _data!=NULL );	 memset(_data, 0, _m*sizeof(F));	 } else		_data = NULL;
		if(_m>0) {		memcpy( _data, C._data, _m*sizeof(F) );	 }
		return *this;
  }
  void resize(int m)  {
		if(_m!=m) {
			if(_m>0) {		  delete[] _data; _data = NULL;		}
			_m = m;
			if(_m>0) {		  _data = new F[_m]; assert( _data!=NULL );		memset(_data, 0, _m*sizeof(F));		}		else		  _data = NULL;
		}
  }
  const F& operator()(int i) const  {
		assert( i>=0 && i<_m);
		return _data[i];
  }
  F& operator()(int i)  {
		assert( i>=0 && i<_m);
		return _data[i];
  }
  int m() const { return _m; }
  F* data() const { return _data; }
};

//INPUT
template <class F> inline istream& operator>>(istream& is, NumVec<F>& vec)
{
  int m; is>>m;
  vec.resize(m);
  for(int i=0; i<vec.m(); i++)
		is>>vec(i);
  return is;
}

//OUTPUT
template <class F> inline ostream& operator<<(ostream& os, const NumVec<F>& vec)
{
  os<<vec.m()<<endl;
  for(int i=0; i<vec.m(); i++)
		os<<" "<<vec(i)<<endl;
  return os;
}

//SET VALUE
template <class F> inline void setvalue(NumVec<F>& vec, F val)
{
  for(int i=0; i<vec.m(); i++)
		vec(i) = val;
}
//CLEAR
template <class F> inline void clear(NumVec<F>& vec)
{
  memset(vec.data(), 0, vec.m()*sizeof(F));
}

typedef NumVec<int>    IntNumVec;
typedef NumVec<double> DblNumVec;
typedef NumVec<cpx>    CpxNumVec;


// Matlab <-> C++ conversion routines

inline int mex2cpp(const mxArray*& md, int& cd)
{
  if (mxIsEmpty(md))
      return 1;
  cd = int(mxGetScalar(md));
  return 0;
}


inline int mex2cpp(const mxArray*& md, CpxNumMat& cd)
{
  int m = mxGetM(md);
  int n = mxGetN(md);
  double* xr = mxGetPr(md);
  double* xi = mxGetPi(md);
  cd.resize(m,n);
  if(xr!=NULL && xi!=NULL) {
		int cnt = 0;
		for(int j=0; j<n; j++)
			for(int i=0; i<m; i++) {
				cd(i,j) = cpx(xr[cnt], xi[cnt]);
				cnt++;
			}
  } else if(xr!=NULL && xi==NULL) {
		int cnt = 0;
		for(int j=0; j<n; j++)
			for(int i=0; i<m; i++) {
				cd(i,j) = cpx(xr[cnt], 0);
				cnt++;
			}
  } else if(xr==NULL && xi!=NULL) {
		int cnt = 0;
		for(int j=0; j<n; j++)
			for(int i=0; i<m; i++) {
				cd(i,j) = cpx(0, xi[cnt]);
				cnt++;
			}
  }
  return 0;
}


inline int mex2cpp(const mxArray*& md, IntNumVec& cd)
{
  int m = mxGetM(md);
  int n = mxGetN(md);
  assert(m==1 || n==1);
  double* xr = mxGetPr(md);
  cd.resize(m*n);
  
  if (xr != NULL) {
    for(int j=0, cnt=0; j<m*n; j++)
      cd(j) = (int) xr[cnt++];
  }
  return 0;
}

template <class T> inline int mex2cpp(const mxArray*& md, std::vector<T>& cd)
{
  int m = mxGetM(md); 
  int n = mxGetN(md); 
	assert(min(m,n)==1);
	
	int len = max(m,n);
  cd.resize(len);
  for(int ci=0; ci<len; ci++) {
		const mxArray*tt = mxGetCell(md, ci);
        if (!tt)
            return 1;
		int err = mex2cpp(tt, cd[ci]);
        if (err)
            return err;
  }
  return 0;
}


inline void cpp2mex(const DblNumMat& cd, mxArray*& md)
{
  int m = cd.m();
  int n = cd.n();
  md = mxCreateDoubleMatrix(m, n, mxREAL);
  double* xr = mxGetPr(md);
  int cnt = 0;
  for(int j=0; j<n; j++)
    for(int i=0; i<m; i++) {
      xr[cnt] = cd(i,j);
      cnt++;
    }
  return;
}


// Data types 

typedef std::vector< std::vector<CpxNumMat> > CurveletData;
enum CurvUtilError { CUError_NoError = 0, CUError_BadParams = 1 };


// Coefficient extraction routines

void GetFinestSizes(const CurveletData &c, const IntNumVec &levs, int &m, int &n)
{
  int mmax=0, nmax=0;
  for (int j=0; j<levs.m(); j++) {
    int lev = levs(j); 
    for (int k=0; k<c[lev].size(); k++) {
      if (c[lev][k].m() > mmax) mmax = c[lev][k].m();
      if (c[lev][k].n() > nmax) nmax = c[lev][k].n();
    }
  }  
  
  m=mmax;
  n=nmax;
}


// Map coordinates (ix,iy) with max dimensions (m,n) to level of actual size (mp,np)
// return indices on this level in (levx,levy)
void MapCoordToLevelME(int mp, int np, int ix, int iy, int m, int n, int& levx, int& levy)
{
	levx = (int) (ix / double(m) * double(mp) + 0.5);
	levy = (int) (iy / double(n) * double(np) + 0.5);
	if (levx >= mp) levx = mp-1;
	if (levy >= np) levy = np-1;
}



/*
 Sums the _mirror-extended_ curvelet coefficient magnitudes on specified levels, over all directions, onto a grid of size (m,n)
 */
CurvUtilError GetMagnitudeME(int m, int n, const CurveletData &cdata, const IntNumVec &levels, DblNumMat &mag, int crvlt_size)
{
	// Check inputs
	if (m<=0 || n<=0)
		return CUError_BadParams;
	for (int k=0; k<levels.m(); k++) {
		if (levels(k) >= cdata.size())
			return CUError_BadParams;
	}
	if (crvlt_size < 0)
		return CUError_BadParams;
	
	mag.resize(m,n);
	
	// At each pixel, add coefficient magnitudes and pick maximum
	double magsum;
	for (int xi=0; xi<m; xi++) {
		for (int yi=0; yi<n; yi++) {
			magsum = 0.0;
			for (int levx=0; levx<levels.m(); levx++) {
				int lev = levels(levx);
				int nang = cdata[lev].size();
				for (int angx=0; angx<nang; angx++) {
					int lx, ly;
					int mp = (int)(cdata[lev][angx].m() / 2) + 1; // actual sizes for mirror-extended levels
					int np = (int)(cdata[lev][angx].n() / 2) + 1;
					MapCoordToLevelME(mp, np, xi, yi, m, n, lx, ly);
					
					// Add neighboring curvelets, to compute average
					double avg = 0.0;
					const CpxNumMat *mat = &(cdata[lev][angx]);
					int nel = (1 + 2*crvlt_size) * (1 + 2*crvlt_size);
					int nely = 1 + 2*crvlt_size;
					for (int lxi=lx-crvlt_size; lxi <= lx+crvlt_size; lxi++) {
						if (lxi < 0)
							nel -= nely;
						else if	(lxi >= mp) 
							nel -=nely;
						else {
							for (int lyi=ly-crvlt_size; lyi <= ly+crvlt_size; lyi++) {
								if (lyi < 0)
									nel -= 1;
								else if (lyi >= np)
									nel -= 1;
								else {
									avg += abs((*mat)(lxi,lyi));          
									avg += abs((*mat)(lxi, ((*mat).n() - lyi) % (*mat).n()));  // add direction pi - theta
								}
							}
						}
					}
					magsum += avg / nel;
				}
			}
			
			mag(xi,yi) = 2.0 * magsum;
		}
	}
	
	return CUError_NoError;
}




// main function

void mexFunction(int nlhs, mxArray* plhs[], int nrhs, const mxArray* prhs[])
{
  if (nrhs < 2)
    mexErrMsgTxt("At least 2 inputs required");
  if (nrhs > 3)
    mexErrMsgTxt("Too many input arguments!");
  
  if (nlhs != 1)
    mexErrMsgTxt("One output required!");
  
  CurveletData c;
  if (mex2cpp(prhs[0], c))
    mexErrMsgTxt("Input 1 is not a valid curvelet data structure!");
  
  IntNumVec levs;
  mex2cpp(prhs[1], levs);
  for (int k=0; k<levs.m(); k++) {  // go from matlab's 1-based index to 0-based
      levs(k)--;
      if (levs(k) >= c.size() || levs(k) < 0)
          mexErrMsgTxt("levels out of range");
  }
  
  int csize = 1;
  if (nrhs == 3) {
      mex2cpp(prhs[2], csize);
  }
  if (csize < 0) 
      mexErrMsgTxt("Bad value for CurveletSize!");

  int m, n; 
  GetFinestSizes(c, levs, m, n);   // get sizes from finest specified level
  m = m / 2 + 1;                   // output sizes for mirror-extended curvelets 
  n = n / 2 + 1;
  
  // Extract fields
  DblNumMat mags(m,n);
  GetMagnitudeME(m, n, c, levs, mags, csize);
  
  cpp2mex(mags, plhs[0]);
	
  return;
}
