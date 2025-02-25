/** @param {NS} ns */
export async function main(ns) {
    let servers = serverList(ns);
    let target = "phantasy";

    // Copy files in parallel to speed up deployment (skipping "home" server)
    await Promise.all(servers.filter(server => server !== "home")
        .map(server => ns.scp(["/aio/bin.wk.js", "/aio/bin.gr.js", "/aio/bin.hk.js"], server, "home"))
    );

    while (true) {
        for (let server of servers) {
            // Skip the "home" server
            if (server === "home") continue;

            ns.print("*************************************************");
            ns.print("* Starting Hacking Script on: " + server);
            ns.print("*************************************************");

            if (!ns.hasRootAccess(server)) {
                tryRoot(ns, server); // Try to gain root access efficiently
            }

            if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {
                let securityLevel = ns.getServerSecurityLevel(target);
                let minSecurity = ns.getServerMinSecurityLevel(target);
                let moneyAvailable = ns.getServerMoneyAvailable(target);
                let maxMoney = ns.getServerMaxMoney(target);

                let available_threads = threadCount(ns, server, 1.75);
                if (available_threads < 1) continue; // Skip if no available threads

                // Hack when money is max and security is at minimum
                if (moneyAvailable === maxMoney && securityLevel === minSecurity) {
                    ns.print("Hacking: " + server);
                    ns.exec("/aio/bin.hk.js", server, available_threads, target);
                } 
                // Condition for Weakening (only if security > min + 2)
                else if (securityLevel > minSecurity + 2) {
                    ns.print("Weakening: " + server);
                    ns.exec("/aio/bin.wk.js", server, available_threads, target);
                } 
                // If money is not at max, grow
                else if (moneyAvailable < maxMoney) {
                    ns.print("Growing: " + server);
                    ns.exec("/aio/bin.gr.js", server, available_threads, target);
                } 
                // Default fallback to hacking if nothing else applies
                else {
                    ns.print("Hacking: " + server);
                    ns.exec("/aio/bin.hk.js", server, available_threads, target);
                }
            }
        }
        await ns.sleep(5000); // Reduce wait time to 5s for faster iterations
    }
}

/* Try to open all ports and gain root */
function tryRoot(ns, server) {
    let requiredPorts = ns.getServerNumPortsRequired(server);
    let availableTools = 0;

    if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(server); availableTools++; }
    if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(server); availableTools++; }
    if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(server); availableTools++; }
    if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(server); availableTools++; }
    if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(server); availableTools++; }

    if (availableTools >= requiredPorts) {
        ns.nuke(server);
        ns.print("Root access gained: " + server);
    } else {
        ns.print("Skipping locked server: " + server);
    }
}

/* Return an array of servers to hack dynamically */
function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    connections.forEach(n => {
        if (!set.has(n)) {
            set.add(n);
            serverList(ns, n, set);
        }
    });
    return Array.from(set);
}

/* Calculate available threads for a given server */
function threadCount(ns, hostname, scriptRam) {
    let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
    return Math.floor(free_ram / scriptRam);
}
