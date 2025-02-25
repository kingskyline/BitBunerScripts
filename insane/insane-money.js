/** @param {NS} ns **/
export async function main(ns) {
    await ns.sleep(2000);

    var p_server = ns.getHostname();
    var i = 0, c = 0;
    var player = ns.getPlayer();

    var contstantRam = ns.getScriptRam("/insane/insane-money.js");
    var hackscriptRam = ns.getScriptRam("/insane/insane-hack.js");
    var growscriptRam = ns.getScriptRam("/insane/insane-grow.js");
    var weakenscriptRam = ns.getScriptRam("/insane/insane-weaken.js");

    var servers = [];
    var toptargets = ["ecorp", "megacorp", "nwo", "kuai-gong", "blade", "omnitek", "4sigma", "b-and-a", "clarkinc", "deltaone", "fulcrumtech"];
    toptargets.forEach(p => servers.push(p));

    var servers3 = serverList(ns);
    servers3.forEach(p => servers.push(p));

    var protected_targets = ["home", "darkweb", "CSEC", "I.I.I.I", "run4theh111z", "avmnite-02h", "The-Cave", "w0r1d_d43m0n"];
    var unprotected_targets = servers.filter(s => !protected_targets.includes(s));

    let unique = unprotected_targets.filter(server => ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server));
    unprotected_targets = [...new Set(unique)];

    var selected_target = p_server === "home" ? ["global-pharm"] : [unprotected_targets[Math.floor(Math.random() * unprotected_targets.length)]];

    while (true) {
        for (let target of selected_target) {
            let fserver = ns.getServer(target);
            let maxRam = Math.max(1, ns.getServerMaxRam(p_server) - 10000 - contstantRam);
            let weakenThreads = Math.max(1, Math.round(2000 - (ns.getServerMinSecurityLevel(target) / 0.05)));
            let maxGrowThreads = Math.max(1, Math.floor((maxRam / growscriptRam) - (weakenscriptRam * 2000)));

            let cs = ns.getServerSecurityLevel(target);
            let ms = ns.getServerMinSecurityLevel(target);
            let mm = ns.getServerMaxMoney(target);
            let ma = ns.getServerMoneyAvailable(target);

            if (ma < mm) {
                ns.exec('/insane/insane-weaken.js', p_server, weakenThreads, target, 0);
                ns.exec('/insane/insane-grow.js', p_server, maxGrowThreads, target, 0);
                await ns.sleep(ns.formulas.hacking.weakenTime(fserver, player) + 1000);
            }

            if (cs > ms) {
                ns.exec('/insane/insane-weaken.js', p_server, weakenThreads, target, 0);
                await ns.sleep(ns.formulas.hacking.weakenTime(fserver, player) + 1000);
            }

            let HPercent = ns.formulas.hacking.hackPercent(fserver, player) * 100;
            let GPercent = ns.formulas.hacking.growPercent(fserver, 1, player, 1);
            let WeakenTime = ns.formulas.hacking.weakenTime(fserver, player);
            let GrowTime = ns.formulas.hacking.growTime(fserver, player);
            let HackTime = ns.formulas.hacking.hackTime(fserver, player);

            let growThreads = Math.max(1, Math.round(5 / (GPercent - 1)));
            let hackThreads = Math.max(1, Math.round(50 / HPercent));
            weakenThreads = Math.max(1, Math.round(weakenThreads - (growThreads * 0.004)));

            let totalRamForRun = (hackscriptRam * hackThreads) + (growscriptRam * growThreads) + (weakenscriptRam * weakenThreads);
            let sleepTime = WeakenTime / Math.max(1, maxRam / totalRamForRun);

            for (let j = 0; j < 100000; j++) {
                let wsleep = 0;
                let gsleep = Math.max(0, WeakenTime - GrowTime - (sleepTime / 4));
                let hsleep = Math.max(0, WeakenTime - HackTime - (sleepTime / 2));

                let UsedRam = ns.getServerUsedRam(p_server);
                if (totalRamForRun < (maxRam - UsedRam) && cs === ms) {
                    if (weakenThreads > 0) ns.exec('/insane/insane-weaken.js', p_server, weakenThreads, target, wsleep, i);
                    if (growThreads > 0) ns.exec('/insane/insane-grow.js', p_server, growThreads, target, gsleep, i);
                    if (hackThreads > 0) ns.exec('/insane/insane-hack.js', p_server, hackThreads, target, hsleep, i);
                    await ns.sleep(sleepTime);
                    i++;
                } else {
                    await ns.sleep(1);
                }
            }
            await ns.sleep(1);
        }
    }
}

function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return serverList(ns, n, set);
    });
    return Array.from(set.keys());
}
