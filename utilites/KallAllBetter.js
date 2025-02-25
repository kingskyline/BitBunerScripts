import { scanAllServers } from 'utilites/dependacy/helpers.js'

/** @param {NS} ns **/
export async function main(ns) {
    var startingNode = ns.getHostname();
    const serverList = scanAllServers(ns);

    // Send the kill command to all servers
    for (const server of serverList) {
        if (server == startingNode)
            continue;

        if (ns.ps(server).length === 0)
            continue;

        ns.killall(server);
    }

    // Wait for scripts to terminate
    for (const server of serverList) {
        if (server == startingNode)
            continue;
        
        while (ns.ps(server).length > 0) {
            await ns.sleep(20);
        }
        
        for (let file of ns.ls(server, '.js'))
            ns.rm(file, server);
    }

    // Kill specific scripts on "home" server
    const scriptsToKill = ["/basic/basichomehack.js", "v1grow.js", "v1hack.js", "v1weaken.js"];
    for (const script of scriptsToKill) {
        ns.scriptKill(script, "home");
    }

    // Finally, kill everything on this host
    ns.killall(startingNode);
}
