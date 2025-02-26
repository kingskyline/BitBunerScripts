import { jsonReplacer } from 'utilites/dependacy/helpers.js'
export async function main(ns) { let r;try{r=JSON.stringify(
    ( ()=> { let player = ns.getPlayer();
            const excludeProperties = ['playtimeSinceLastAug', 'playtimeSinceLastBitnode', 'bitNodeN'];
            return Object.keys(player).reduce((pCopy, key) => {
                if (!excludeProperties.includes(key))
                   pCopy[key] = player[key];
                return pCopy;
            }, {});
        })()
, jsonReplacer);}catch(e){r="ERROR: "+(typeof e=='string'?e:e?.message??JSON.stringify(e));}
const f="/Temp/getPlayer.txt"; if(ns.read(f)!==r) ns.write(f,r,'w') }