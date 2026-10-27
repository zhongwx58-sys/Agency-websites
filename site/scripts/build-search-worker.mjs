import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
// The retained slimsearch release emits a classic Worker with one ESM import.
// Bundle that import as well, so the published worker runs without import maps.
const file=new URL('../dist/slimsearch.worker.js',import.meta.url);
const source=await readFile(file,'utf8');
const result=await build({stdin:{contents:source,resolveDir:process.cwd(),sourcefile:'slimsearch.worker.js'},bundle:true,format:'iife',platform:'browser',target:'es2022',minify:true,write:false});
await writeFile(file,result.outputFiles[0].text);
console.log('Search worker bundled for classic Worker.');
