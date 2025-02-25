/** @param {NS} ns **/
export async function main(ns) {
    // List of scripts to run sequentially with a delay between them
    const scripts = [
        { script: "/utilites/BestCustomHud.js", delay: 10000 },
        { script: "/contracts/findandsolve.js", delay: 10000 },
     //   { script: "/stats/showincome.js", delay: 10000 },
     //   { script: "/stats/showallincome.js", delay: 10000 },       
        { script: "/early/EarlyhackerDeployer.js", delay: 10000 },
        { script: "/early/BoughtServerHackerDeployer.js", delay: 10000 },
        { script: "/early/HomeHackerDeployer.js", delay: 10000 },
        { script: "/early/HomeHackerXPDeployer.js", delay: 10000 }

    ];

    // Print that the process is starting
    ns.print("Starting execution of all scripts sequentially...");

    // Execute each script sequentially
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        try {
            // Log script being executed
            ns.print(`Starting script: ${script.script}`);
            
            // Run the script on 'home'
            const execResult = ns.exec(script.script, "home");

            // Check if the execution was successful
            if (execResult === 0) {
                ns.print(`ERROR: Failed to start ${script.script}`);
            } else {
                ns.print(`Successfully started: ${script.script}`);
            }

            // Wait for the specified delay before moving to the next script
            await ns.sleep(script.delay);
        } catch (error) {
            // Log any error that occurs during execution
            ns.print(`ERROR while running ${script.script}: ${error}`);
        }
    }

    // Final message to indicate all scripts have been executed
    ns.print("All scripts executed sequentially.");
}
