/** @param {NS} ns */
export async function main(ns) {
  const distroScript = "/hacks/PrivateServersHack.js";
  const scriptTarget = ns.args[0] || "phantasy";
  
  while (true) {  // Infinite loop
    const allServers = new Set();
    const toVisit = ['home'];
    var ignoredServers = ['home', 'darkweb',"blade","clarkinc","b-and-a","ecorp","megacorp","fulcrumassets","The-Cave","powerhouse-fitness","nwo",".","omnitek","kuai-gong","4sigma","run4theh111z","fulcrumtech","helios","stormtech","vitalife","nova-med","microdyne","applied-energetics","titan-labs","zeus-med","infocomm","taiyang-digital","zb-def","solaris","univ-energy","icarus","deltaone","unitalife","defcomm","global-pharm","snap-fitness","omnia","galactic-cyber","aerocorp","millenium-fitness","lexo-corp","rho-construction","alpha-ent","aevum-police",'n00dles','foodnstuff','sigma-cosmetics','joesguns','nectar-net','hong-fang-tea','harakiri-sushi','neo-net','zer0 ','max-hardware','iron-gym','phantasy','silver-helix','omega-net','computek','SEC','the-hub','zb-institute','syscore','crush-fitness','I.I.I.I','avmnite-02h','rothman-uni','summit-uni','omega-net','johnson-ortho','catalyst','harakiri-sushi','nectar-net','netlink'];

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
