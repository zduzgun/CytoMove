function c = mefcv2_variant(x, levels)
% mefcv2 - 2D forward mirror-extended curvelet transform
% -----------------
% INPUT
% --
% x is an N1-by-N2 matrix. 
% levels is a vector with the levels to compute (level 1 is always
%   computed)
% -----------------
% OUTPUT
% --
% c is a cell array which contains the curvelets coefficients. If
% tp=='ortho', then c{j}{l}(n1,n2) is the coefficient at scale j,
% direction l and spatial index (n1,n2). The directional index l
% iterates through the wedges in the first quadrant. Notice that for
% the mirror-extended curvelets, the spatial indices wrap around once.
% -----------------
% Written by Lexing Ying and Laurent Demanet, 2007
% Modified by Tobias Gebaeck, 2008
  
% default number of levels and angles
[N1,N2] = size(x);
ns = floor(log2(min(N1,N2))) - 3;
nag = 16;

if nargin < 2.
    levels = 2:ns;
else
    levels = unique(max(min(levels, ns), 2));
end

if any(levels < 1)
    error('wrong levels')
end

  if(mod(nag,4)~=0)
    error('wrong');
  end
  
  %1. dct
  fd = dct2(x);
  
  %2. scatter
  E1 = ceil(N1/3);  E2 = ceil(N2/3);  %E1 = 0;  E2 = 0;
  fd = mescatter_mex(fd,E1, 0);
  fd = mescatter_mex(fd,E2, 1);
  A1 = size(fd,1);    A2 = size(fd,2);
  
  G1 = 4/3*N1;  G2 = 4/3*N2;
  
  c = cell(ns,1);
  ttl = 0;
  
  % set default sizes for non-selected levels
  for s=ns:-1:2,
      nbangles = nag*2^(ceil((s-2)/2)) / 4;
      c{s} = cell(nbangles,1);
      for k=1:nbangles,
          c{s}{k} = 0;
      end
  end
  
  for s = sort(levels, 'descend'),
  
    %get ring
    R1 = 2^(s-ns)*G1;
    R2 = 2^(s-ns)*G2;
    
    idx1 = ceil(-R1):floor(R1);
    %tmpa = cwindow_mex((idx1+R1/1)/(R1/2), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx1-R1/2)/(R1/2), 0);    %tmpb = wr;
    %coef1 = tmpa.*tmpb;
    coef1 = cvwindow_mex(idx1, -R1, R1/2, R1/2, R1/2);
    idx2 = ceil(-R2):floor(R2);
    %tmpa = cwindow_mex((idx2+R2/1)/(R2/2), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx2-R2/2)/(R2/2), 0);    %tmpb = wr;
    %coef2 = tmpa.*tmpb;
    coef2 = cvwindow_mex(idx2, -R2, R2/2, R2/2, R2/2);
    lowpass = coef1'*coef2;
    
    idx1 = ceil(-R1):floor(R1);
    %tmpa = cwindow_mex((idx1+R1/2)/(R1/4), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx1-R1/4)/(R1/4), 0);    %tmpb = wr;
    %coef1 = tmpa.*tmpb;
    coef1 = cvwindow_mex(idx1, -R1/2, R1/4, R1/4, R1/4);
    idx2 = ceil(-R2):floor(R2);
    %tmpa = cwindow_mex((idx2+R2/2)/(R2/4), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx2-R2/4)/(R2/4), 0);    %tmpb = wr;
    %coef2 = tmpa.*tmpb;
    coef2 = cvwindow_mex(idx2, -R2/2, R2/4, R2/4, R2/4);
    tmppass = coef1'*coef2;
    hghpass = sqrt(1-tmppass.^2);
    
    pass = lowpass.*hghpass;
    [M1,M2] = size(pass);
    fh = zeros(M1,M2);
    fh(mod(idx1,M1)+1,mod(idx2,M2)+1) = pass .* fd(mod(idx1,A1)+1,mod(idx2,A2)+1);
    %ggg = ggg + norm(fh(:))^2;
    
    nbangles = nag*2^(ceil((s-2)/2));
    
    %c{s} = fcv2_sepangle(R1,R2,fh,nbangles);
    %---------
    [M1,M2] = size(fh);
    nd = nbangles/4;
    cs = cell(nd,1);
    W1 = 2*R1/nd;  W2 = 2*R2/nd;
    
    %take only first quadrant
    cnt = 1;
    for g=nd/2:nd-1
      xs = R1/4-(W1/2)/4;    xe = R1;
      ys = -R2 + (2*g-1)*W2/2;		ye = -R2 + (2*g+3)*W2/2;
      xn = ceil(xe-xs);    yn = ceil(ye-ys);
      if(g==0)
        thts = atan2(-1.0, 1.0-1.0/nd);
        thtm = atan2(-1.0+1.0/nd, 1.0);
        thte = atan2(-1.0+3.0/nd, 1.0);
      elseif(g==nd-1)
        thts = atan2(-1.0+(2.0*g-1.0)/nd, 1.0);
        thtm = atan2(-1.0+(2.0*g+1.0)/nd, 1.0);
        thte = atan2(1.0, 1.0-1.0/nd);
      else
        thts = atan2(-1.0+(2.0*g-1.0)/nd, 1.0);
        thtm = atan2(-1.0+(2.0*g+1.0)/nd, 1.0);
        thte = atan2(-1.0+(2.0*g+3.0)/nd, 1.0);
      end
      %fprintf(1,'%d %d %d\n',thts,thtm,thte);
      R21 = R2/R1;
      wpdata = zeros(xn,yn);
      for xcur=ceil(xs):xe
        yfm = ceil( max([-R2, R21*xcur*tan(thts)]) );
        yto = floor( min([R2, R21*xcur*tan(thte)]) );
        ycur = yfm:yto;
        thtcur = atan2(ycur/R2,xcur/R1);
        %al = cwindow_mex((thtcur-thts)/(thtm-thts), 1);
        %br = cwindow_mex((thtcur-thtm)/(thte-thtm), 0);
        %pou = al.*br;
        pou = cvwindow_mex(thtcur, thts, thtm-thts, thtm, thte-thtm);
        wpdata(mod(xcur,xn)+1,mod(ycur,yn)+1) = fh(mod(xcur,M1)+1,mod(ycur,M2)+1) .* pou;
      end
      cs{cnt} = ifft2(wpdata) * sqrt(numel(wpdata));      ttl = ttl + norm(cs{cnt}(:))^2;
      cnt = cnt+1;
    end
    
    for f=nd-1:-1:nd/2
      ys = R2/4-(W2/2)/4;		  ye = R2;
      xs = -R1 + (2*f-1)*W1/2;		  xe = -R1 + (2*f+3)*W1/2;
      xn = ceil(xe-xs);		  yn = ceil(ye-ys);
      if(f==0)
        phis = atan2(-1.0, 1.0-1.0/nd);
        phim = atan2(-1.0+1.0/nd, 1.0);
        phie = atan2(-1.0+3.0/nd, 1.0);
      elseif(f==nd-1)
        phis = atan2(-1.0+(2.0*f-1.0)/nd, 1.0);
        phim = atan2(-1.0+(2.0*f+1.0)/nd, 1.0);
        phie = atan2(1.0, 1.0-1.0/nd);
      else
        phis = atan2(-1.0+(2.0*f-1.0)/nd, 1.0);
        phim = atan2(-1.0+(2.0*f+1.0)/nd, 1.0);
        phie = atan2(-1.0+(2.0*f+3.0)/nd, 1.0);
      end
      %fprintf(1,'%d %d %d\n',phis,phim,phie);
      R12 = R1/R2;
      wpdata = zeros(xn,yn);
      for ycur=ceil(ys):ye
        xfm = ceil( max([-R1, R12*ycur*tan(phis)]) );
        xto = floor( min([R1, R12*ycur*tan(phie)]) );
        xcur = xfm:xto;
        phicur = atan2(xcur/R1, ycur/R2);
        %al = cwindow_mex((phicur-phis)/(phim-phis), 1);
        %br = cwindow_mex((phicur-phim)/(phie-phim), 0);
        %pou = al.*br;
        pou = cvwindow_mex(phicur, phis, phim-phis, phim, phie-phim);
        wpdata(mod(xcur,xn)+1,mod(ycur,yn)+1) = fh(mod(xcur,M1)+1,mod(ycur,M2)+1) .* pou';
      end
      cs{cnt} = ifft2(wpdata) * sqrt(numel(wpdata));      ttl = ttl + norm(cs{cnt}(:))^2;
      cnt = cnt+1;
    end
    c{s} = cs;
  
    %fprintf(1,'%d %d\n', ttl, ggg/4);
  end
  
  
  %do the first level
  if (1),
    s = 1;
    R1 = 2^(s-ns)*G1;
    R2 = 2^(s-ns)*G2;
    idx1 = ceil(-R1):floor(R1);
    %tmpa = cwindow_mex((idx1+R1/1)/(R1/2), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx1-R1/2)/(R1/2), 0);    %tmpb = wr;
    %coef1 = tmpa.*tmpb;
    coef1 = cvwindow_mex(idx1, -R1, R1/2, R1/2, R1/2);
    idx2 = ceil(-R2):floor(R2);
    %tmpa = cwindow_mex((idx2+R2/1)/(R2/2), 1);    %tmpa = wl;
    %tmpb = cwindow_mex((idx2-R2/2)/(R2/2), 0);    %tmpb = wr;
    %coef2 = tmpa.*tmpb;
    coef2 = cvwindow_mex(idx2, -R2, R2/2, R2/2, R2/2);
    pass = coef1'*coef2;
    [M1,M2] = size(pass);
    
    fh = zeros(M1,M2);
    fh(mod(idx1,M1)+1,mod(idx2,M2)+1) = pass .* fd(mod(idx1,A1)+1,mod(idx2,A2)+1);    %ggg = ggg + norm(fh(:))^2;
    
    cs = cell(1,1);
    K1 = M1+1;    K2 = M2+1;
    tmp = zeros(K1,K2);
    tmp(mod(idx1,K1)+1,mod(idx2,K2)+1) = fh(mod(idx1,M1)+1,mod(idx2,M2)+1);
    tmp = mecombine(tmp,0);
    tmp = mecombine(tmp',0)';
    tmp = tmp/4;
    cs{1} = ifft2(tmp) * sqrt(numel(tmp));  % Added ifft2 here! TG  %ttl = ttl + norm(cs{1}(:))^2;
    c{s} = cs;
    
    %fprintf(1,'%d\n', ttl);
  end
  
  
  
  
  
  
  