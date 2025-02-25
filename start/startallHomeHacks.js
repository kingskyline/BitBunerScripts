/** @param {NS} ns **/
export async function main(ns) {
    // List of targets to hack with the script
    const hackTargets = [

        "n00dles",
        "foodnstuff",
        "sigma-cosmetics",
        "joesguns",
        "nectar-net",
        "hong-fang-tea",
        "harakiri-sushi",
        "neo-net",
        "zer0",
        "max-hardware",
        "iron-gym",
        "phantasy",
        "silver-helix",
        "crush-fitness",
        "omega-net",
        "johnson-ortho",
        "the-hub",
        "rothman-uni",
        "computek",
        "millenium-fitness",
        "netlink",
        "aevum-police",
        "summit-uni",
        "catalyst",
        "rho-construction",
        "alpha-ent",
        "syscore",
        "lexo-corp"
     
    ];
    
    const hackScript = "/basic/basichomehack.js"; // Path to the hack script
    const delayBetweenHacks = 2000; // 2 seconds delay between starting each hack

    // Function to print and log messages nicely
    function logMessage(type, message) {
        let formattedMessage;
        switch (type) {
            case "start":
                formattedMessage = `\n🟢 === STARTING HACKING SEQUENCE ===\n${message}\n`;
                break;
            case "hack":
                formattedMessage = `💀 [HACKING] → Targeting ${message}...`;
                break;
            case "success":
                formattedMessage = `✅ [SUCCESS] → Hack started on: ${message}`;
                break;
            case "error":
                formattedMessage = `❌ [ERROR] → Failed to start hack on ${message}`;
                break;
            case "wait":
                formattedMessage = `⏳ [WAIT] → Waiting ${delayBetweenHacks / 1000} seconds before next hack...`;
                break;
            case "done":
                formattedMessage = `\n🎉 === HACKING SEQUENCE COMPLETE ===\n${message}\n`;
                break;
            default:
                formattedMessage = message;
        }
        ns.print(formattedMessage);
        ns.tprint(formattedMessage);
    }

    logMessage("start", "🚀 Initiating hacking sequence...");

    // Loop through each target and start a hack
    for (let target of hackTargets) {
        try {
            logMessage("hack", `Running ${hackScript} on ${target}...`);

            // Run the hack script on the target
            const execResult = ns.run(hackScript, 1, target);

            // Check if the execution was successful
            if (execResult === 0) {
                logMessage("error", target);
            } else {
                logMessage("success", target);
            }

            logMessage("wait", "");
            await ns.sleep(delayBetweenHacks);
        } catch (error) {
            logMessage("error", `Exception while hacking ${target}: ${error}`);
        }
    }

    logMessage("done", "✅ All hack scripts have been started!");
}
