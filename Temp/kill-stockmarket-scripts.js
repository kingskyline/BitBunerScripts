export async function main(ns) { ns.ps().filter(proc => proc.filename == 'stocks/stockmaster.js' && !proc.args.includes('-l') && !proc.args.includes('--liquidate')).forEach(proc => ns.kill(proc.pid)) }