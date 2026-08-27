import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot=fileURLToPath(new URL('.',import.meta.url));
const requestedOutput=process.argv[2]||'dist';
const outputDir=resolve(projectRoot,requestedOutput);
const outputRelative=relative(projectRoot,outputDir).replaceAll('\\','/');

if(isAbsolute(requestedOutput)||!outputRelative||outputRelative.startsWith('../')||outputRelative==='..') {
  throw new Error('The Pages output directory must be inside the project.');
}

const excludedPrefixes=['video_tutorial/'];
const trackedFiles=execFileSync('git',['ls-files','-z'],{cwd:projectRoot})
  .toString('utf8')
  .split('\0')
  .filter(Boolean)
  .filter(path=>path!==outputRelative&&!path.startsWith(`${outputRelative}/`))
  .filter(path=>!excludedPrefixes.some(prefix=>path.startsWith(prefix)));

rmSync(outputDir,{recursive:true,force:true});
mkdirSync(outputDir,{recursive:true});

for(const trackedPath of trackedFiles) {
  const source=join(projectRoot,...trackedPath.split('/'));
  const destination=join(outputDir,...trackedPath.split('/'));
  mkdirSync(dirname(destination),{recursive:true});
  copyFileSync(source,destination);
}

const maxAssetBytes=25*1024*1024;
for(const trackedPath of trackedFiles) {
  const destination=join(outputDir,...trackedPath.split('/'));
  const size=statSync(destination).size;
  if(size>maxAssetBytes) {
    throw new Error(`${trackedPath} exceeds the Cloudflare Pages 25 MiB asset limit.`);
  }
}

console.log(`Prepared ${trackedFiles.length} tracked site files in ${outputRelative}${sep}`);
