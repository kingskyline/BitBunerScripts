/** @param {NS} ns */
export async function main(ns) {
  const distroScript = "/hacks/HackedServersHack.js";
  const scriptTarget = ns.args[0] || "foodnstuff";

  while (true) {  // Infinite loop
    const allServers = new Set();
    const toVisit = ['home'];
    var ignoredServers = ['home', 'darkweb','server-0','server-1','server-2','server-3','server-4','server-5','server-6','server-7','server-8','server-9','server-10','server-11','server-12','server-13','server-14','server-15','server-16','server-17','server-18','server-19','server-20','server-21','server-22','server-23','server-24'];

    let totalThreads = 0;
    let serversNeedingPrograms = 0;
    let serversNeedingSkills = 0;

    while (toVisit.length > 0) {
      const currentServer = toVisit.shift();

      if (allServers.has(currentServer)) {
        continue;
      }
      allServers.add(currentServer);

      const connectedServers = ns.scan(currentServer);
      for (const server of connectedServers) {
        if (!allServers.has(server)) {
          toVisit.push(server);
        }
      }

      if (!ignoredServers.includes(currentServer)) {
        ns.scp(distroScript, currentServer);
        ns.print(`INFO: ${distroScript} copied to ${currentServer}.`);

        if (!ns.hasRootAccess(currentServer)) {
          ns.print(`ERROR: You do not have root access to ${currentServer}`);

          if (ns.getServerRequiredHackingLevel(currentServer) <= ns.getHackingLevel()) {
            const prog = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];

            if (ns.fileExists(prog[0], 'home')) ns.brutessh(currentServer);
            if (ns.fileExists(prog[1], 'home')) ns.ftpcrack(currentServer);
            if (ns.fileExists(prog[2], 'home')) ns.relaysmtp(currentServer);
            if (ns.fileExists(prog[3], 'home')) ns.httpworm(currentServer);
            if (ns.fileExists(prog[4], 'home')) ns.sqlinject(currentServer);

            if (ns.getServerNumPortsRequired(currentServer) <= prog.filter(p => ns.fileExists(p, 'home')).length) {
              try {
                ns.nuke(currentServer);
                ns.tprint(`SUCCESS: Gained root access to ${currentServer}.`);
              } catch (ERROR) {
                ns.print(`WARNING: Could not run NUKE.exe on ${currentServer}.`)
              }
            } else {
              serversNeedingPrograms++;
            }
          } else {
            serversNeedingSkills++;
          }
        }

        if (ns.hasRootAccess(currentServer)) {
          var numThreads = Math.floor(ns.getServerMaxRam(currentServer) / ns.getScriptRam(distroScript));
          totalThreads += numThreads;

          if (numThreads > 0) {
            ns.killall(currentServer);
            ns.exec(distroScript, currentServer, numThreads, scriptTarget);
            ns.print(`SUCCESS: Running ${distroScript} on ${currentServer} using ${numThreads} threads, targeting ${scriptTarget}.`);
          } else {
            ns.print(`ERROR: ${currentServer} does not have the necessary RAM to run ${distroScript}.`);
          }
        } else {
          ns.print(`WARNING: Could not run ${distroScript} on ${currentServer}`);
        }
      }
    }

    if (serversNeedingPrograms > 0) {
      ns.tprint(`WARNING: Root access could not be gained on ${serversNeedingPrograms} servers due to missing programs.`);
    }

    if (serversNeedingSkills > 0) {
      ns.tprint(`WARNING: Root access could not be gained on ${serversNeedingSkills} servers due to insufficient skill.`);
    }

    ns.tprint(`SUCCESS: ${distroScript} is now running on ${totalThreads} total threads, targeting ${scriptTarget}.`);
    
    ns.tprint("Waiting 5 minutes before restarting...");
    await ns.sleep(300000); // Wait 5 minutes before looping again
  }
}
