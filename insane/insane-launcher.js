/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog('ALL');

    var servers = [ "server-0", "server-1", "server-2", "server-3", "server-4", "server-5", "server-6", "server-7", "server-8", "server-9",
        "server-10", "server-11", "server-12", "server-13", "server-14", "server-15", "server-16", "server-17", "server-18", "server-19", "server-20",
        "server-21", "server-22", "server-23", "server-24"];
    /*    
        make sure that list above only has the servers you bought!  
    */
    
    var origin = ns.getHostname();

    for (var i = 0; i < servers.length; i++) {

        var server = servers[i];

        if (server == "home") {
            // ignore.
        } else {
            // copy to server.
            ns.scp("/insane/insane-money.js", server, "home"); // 6.25 gb
            ns.scp("/insane/insane-hack.js", server, "home"); // 1.70 gb 
            ns.scp("/insane/insane-grow.js", server, "home"); // 1.75 gb
            ns.scp("/insane/insane-weaken.js", server, "home"); // 1.75 gb
        }

        await ns.sleep(100);

        let random_arg = Date.now() + Math.random();
        let pid = ns.exec("/insane/insane-money.js", server, 1, "", random_arg); // only use ONE thread to start.
        let dt = i + '. PID: ' + pid + ', /insane/insane-money.js from ' + origin + ' on ' + server + '.\n';
        ns.print(dt);

        await ns.sleep(1000);
    }
}