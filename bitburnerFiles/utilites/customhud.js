/** @param {NS} ns **/
export async function main(ns) {
    const doc = document;

    // This does not work
    //const doc = eval("ns.bypass(document);");

    // Hook into game's overview
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    while (true) {
        try {
            const headers = []
            const values = [];

            let hacknetTotalProduction = 0;
            let hacknetTotalProfit = 0;

            // Calculate total hacknet income & profit
            for (let index = 0; index <= ns.hacknet.numNodes() - 1; index++) {
                hacknetTotalProduction += ns.hacknet.getNodeStats(index).production;
                hacknetTotalProfit += ns.hacknet.getNodeStats(index).totalProduction;

                //ns.tprint("production for " + index + " " + ns.hacknet.getNodeStats(index).production.toPrecision(5));
            }

            headers.push("Hacknet Income: ");
            values.push(ns.nFormat(hacknetTotalProduction.toPrecision(5), "$0.0a") + '/s');

            headers.push("Hacknet Profit: ");
            values.push(ns.nFormat(hacknetTotalProfit.toPrecision(5), "$0.0a"));

            headers.push("Script Income: ");
            values.push(ns.nFormat(ns.getTotalScriptIncome()[0].toPrecision(5), "$0.0a") + '/s');

            headers.push("Script Experience: ");
            values.push(ns.nFormat(ns.getTotalScriptExpGain().toPrecision(5), "0.00a") + '/s');

            // Get available RAM on the home server
            const homeMaxRam = ns.getServerMaxRam("home");
            const homeUsedRam = ns.getServerUsedRam("home");
            const homeAvailRam = homeMaxRam - homeUsedRam;
            
            headers.push("Home Server RAM: ");
            values.push(ns.formatRam(homeAvailRam));

            // Calculate Script Total Profit (Total script income)
            const totalScriptProfit = ns.getTotalScriptIncome()[0];

            headers.push("Script Total Profit: ");
            values.push(ns.nFormat(totalScriptProfit.toPrecision(5), "$0.0a"));

            headers.push("City: ");
            values.push(ns.getPlayer().city);

            headers.push("Location: ");
            values.push(ns.getPlayer().location.substring(0, 10));

            headers.push("Local Time: ");
            values.push(new Date().toLocaleTimeString());

            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");

        } catch (error) {
            ns.print("ERROR- Update Skipped: " + String(error));
        }

        await ns.sleep(1000);
    }
}
