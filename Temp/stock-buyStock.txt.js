import { jsonReplacer } from 'utilites/dependacy/helpers.js'
export async function main(ns) { let r;try{r=JSON.stringify(
    ns.stock.buyStock(ns.args[0], ns.args[1])
, jsonReplacer);}catch(e){r="ERROR: "+(typeof e=='string'?e:e?.message??JSON.stringify(e));}
const f="/Temp/stock-buyStock.txt"; if(ns.read(f)!==r) ns.write(f,r,'w') }