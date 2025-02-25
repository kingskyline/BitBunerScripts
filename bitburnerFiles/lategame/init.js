/**
 * Executes a loop that periodically runs a set of scripts to manage various aspects of a game environment.
 * It repeatedly executes scripts related to deploying resources, analyzing server vulnerabilities, 
 * identifying hackable targets, and determining the best targets for hacking.
 * The loop runs indefinitely, pausing for a specified interval between each iteration.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes
 *                  functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Log settings: Currently, no logs are disabled, but this array can be populated with log identifiers
  // to suppress verbose output from specific game functions.
  const DISABLED_LOGS = [];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  // Opens a tail window in the game to display log outputs.
  ns.tail();

  // LOOP_DELAY: Time in milliseconds to wait between script executions.
  // Set to 3000 milliseconds (3 seconds).
  const LOOP_DELAY = 1000 * 3;

  // Continuously loop to manage various scripting tasks.
  while (true) {
    // Run scripts to manage deployment, server vulnerabilities, hackable targets, and optimal targets.
    // Each script is launched with a single thread.
    ns.run("/lategame/v1/deployer.js", 1);            // Script to hack servers and deploying scripts.
    ns.run("/lategame/v1/rooted-servers.js", 1);      // Script to identify servers with root access.
    ns.run("/lategame/v1/hackable-targets.js", 1);    // Script to identify servers that can be hacked.
    ns.run("/lategame/v1/best-target.js", 1);         // Script to identify the best server for hacking.

    // Pause the loop for the specified delay, allowing time for scripts to execute before the next iteration.
    await ns.sleep(LOOP_DELAY);
  }
}