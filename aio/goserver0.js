/** @param {NS} ns */
export async function main(ns) {

    let servers = serverList(ns); // Start here.    
    let defaultTarget = "omega-net"; // Default target for servers with 64GB or more RAM
    let altTarget = "phantasy"; // Target for servers with less than 64GB RAM

    // Copy files between servers.
    for (let server of servers) {
        // Skip copying to "home"
        if (server !== "home") {
            await ns.scp(["aio/bin.wk.js", "aio/bin.gr.js", "aio/bin.hk.js"], server, "home");
        }
    }
ns.tail();
    while (true) {
        for (let server of servers) {
            // Skip the "home" server for actions
            if (server === "home") continue;

            ns.print("*************************************************");
            ns.print("*");
            ns.print("*       Starting Hacking Script on: " + server);
            ns.print("*");
            ns.print("*************************************************");

            // Check the server's RAM to determine the target
            let target = (ns.getServerMaxRam(server) < 64) ? altTarget : defaultTarget;

            // Divert all of this server's available threads to the most valuable command. 
            // To do this we need to know how many threads are available on the server.
            if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {

                // Get target's current status
                let securityLevel = ns.getServerSecurityLevel(target);
                let minSecurity = ns.getServerMinSecurityLevel(target);
                let moneyAvailable = ns.getServerMoneyAvailable(target);
                let maxMoney = ns.getServerMaxMoney(target);

                // Check if the money is over 90% and if the security level is within 1 of the minSecurity level
                if (moneyAvailable >= maxMoney * 0.9 && securityLevel <= minSecurity + 2) {
                    // Proceed with hacking if conditions are met
                    let available_threads = threadCount(ns, server, 1.75);
                    if (available_threads >= 1) {
                        ns.print("hacking: " + server);
                        ns.exec("aio/bin.hk.js", server, available_threads, target); // Hack the target                        
                    }
                } 
                // If not, proceed to weaken or grow
                else {
                    // Weakening if security is above minimum security
                    if (securityLevel > minSecurity) {
                        let available_threads = threadCount(ns, server, 1.75);
                        if (available_threads >= 1) {
                            ns.print("weakening: " + server);
                            ns.exec("aio/bin.wk.js", server, available_threads, target); // Weaken the target
                        }
                    }
                    // Growing if money is less than maxMoney
                    else if (moneyAvailable < maxMoney) {
                        let available_threads = threadCount(ns, server, 1.75);
                        if (available_threads >= 1) {
                            ns.print("growing: " + server);
                            ns.exec("aio/bin.gr.js", server, available_threads, target); // Grow the target                        
                        }
                    }
                }
            } else {
                try {
                    ns.print("*************************************************");
                    ns.print("*");
                    ns.print("*       Opening all possible ports on all servers ");
                    ns.print("*       (SSH, FTP, SMTP, HTTP, SQL) ");
                    ns.print("*       before using unlocked bursters.");
                    ns.print("*");
                    ns.print("*************************************************");

                    if (ns.fileExists("BruteSSH.exe")) {
                        await ns.brutessh(server);
                    } else { ns.print("BruteSSH.exe unavailable for " + server); }

                    if (ns.fileExists("FTPCrack.exe")) {
                        await ns.ftpcrack(server);
                    } else { ns.print("FTPCrack.exe unavailable for " + server); }

                    if (ns.fileExists("relaySMTP.exe")) {
                        await ns.relaysmtp(server);
                    } else { ns.print("relaySMTP.exe unavailable for " + server); }

                    if (ns.fileExists("HTTPWorm.exe")) {
                        await ns.httpworm(server);
                    } else { ns.print("HTTPWorm.exe unavailable for " + server); }

                    if (ns.fileExists("SQLInject.exe")) {
                        await ns.sqlinject(server);
                    } else { ns.print("SQLInject.exe unavailable for " + server); }
                }
                catch {
                    // ...
                }

                try {
                    ns.print("*************************************************");
                    ns.print("*       Nuking " + server + " on all open ports.");
                    ns.print("*************************************************");
                    await ns.nuke(server);
                }
                catch {
                    // ...
                }

            }
            await ns.sleep(5000); // 5 seconds, to avoid 'not using await' error.
        }
    }
}

/* Return an array of servers to hack dynamically */
function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));

    next.forEach(n => {
        set.add(n);
        return serverList(ns, n, set);
    });

    return Array.from(set.keys());
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam) {
    let threads = 0;
    let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

    threads = free_ram / scriptRam;
    return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}
