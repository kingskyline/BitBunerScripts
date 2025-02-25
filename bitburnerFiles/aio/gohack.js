/** @param {NS} ns */
export async function main(ns) {

    let servers = serverList(ns); // Start here.	
    let target = "phantasy"; // Our target.

    // Copy files between servers (skip home)
    for (let server of servers) {
        if (server !== "home") {
            await ns.scp(["/aio/bin.wk.js", "/aio/bin.gr.js", "/aio/bin.hk.js"], server, "home");
        }
    }

    while (true) {
        for (let server of servers) {
            if (server === "home") continue;  // Skip "home" server

            ns.print("*************************************************");
            ns.print("* Starting Hacking Script");
            ns.print("*");
            ns.print("*************************************************");

            // Divert all of this server's available threads to the most valuable command.
            // To do this we need to know how many threads are available on the server.
            if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {

                let securityLevel = ns.getServerSecurityLevel(target);
                let minSecurity = ns.getServerMinSecurityLevel(target);
                let moneyAvailable = ns.getServerMoneyAvailable(target);
                let maxMoney = ns.getServerMaxMoney(target);

                let available_threads = threadCount(ns, server, 1.75);
                if (available_threads < 1) continue; // Skip if no available threads

                // Hacking if security is at min and money is at max
                if (securityLevel <= minSecurity && moneyAvailable >= maxMoney) {
                    ns.print("hacking: " + server);
                    ns.exec("/aio/bin.hk.js", server, available_threads, target); // Hack the target
                }
                // Weakening if security is +2 over the minimum
                else if (securityLevel > minSecurity + 1) {
                    ns.print("weakening: " + server);
                    ns.exec("/aio/bin.wk.js", server, available_threads, target); // Weaken the target while security > minSecurity.
                }
                // Growing if money < maxMoney
                else if (moneyAvailable < maxMoney) {
                    ns.print("growing: " + server);
                    ns.exec("/aio/bin.gr.js", server, available_threads, target); // Grow the target while money < maxMoney.						
                }
            } else {
                try {

                    ns.print("*************************************************");
                    ns.print("* Opening all possible ports on all servers ");
                    ns.print("* (SSH, FTP, SMTP, HTTP, SQL) ");
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
                    ns.print("* Nuking " + server + " on all open ports.");
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
    return Math.floor(threads); // Flooring this returns an integer.
}
