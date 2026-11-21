import { cp, rm } from 'node:fs/promises';
import '../lib/hackersbay/build-landing.js';

const output = new URL('../dist/public/hackersbay/', import.meta.url);
await rm(output, {recursive:true, force:true});
await cp(new URL('../public/hackersbay/', import.meta.url), output, {recursive:true});
