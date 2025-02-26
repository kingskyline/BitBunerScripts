import { jsonReplacer } from 'utilites/dependacy/helpers.js'
export async function main(ns) { let r;try{r=JSON.stringify(
    ns.stock.has4SDataTIXAPI()
, jsonReplacer);}catch(e){r="ERROR: "+(typeof e=='string'?e:e?.message??JSON.stringify(e));}
const f="/Temp/stock-has4SDataTIXAPI.txt"; if(ns.read(f)!==r) ns.write(f,r,'w') }