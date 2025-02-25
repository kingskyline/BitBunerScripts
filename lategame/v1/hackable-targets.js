import { FileSystem } from "/lategame/data/file-system.js";
/**
 * Identifies servers that are hackable based on their security and economic attributes,
 * and records their names, sorted by potential profitability. This script first gathers all accessible servers,
 * excluding the starting point ("home"), and then checks each for hackability criteria:
 * root access, hacking level requirement, and the presence of money. It records the names of qualifying servers,
 * sorted by their maximum money capacity, to a file.
 * This script leverages a custom `FileSystem` class to handle file operations.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes
 *                  functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Instantiate the FileSystem class for file operations, targeting a specific file for hackable targets.
  const HACKABLE_TARGETS = new FileSystem(ns, "/lategame/data/hackable-targets.txt");

  // Retrieve a list of all servers accessible from the "home" server.
  const SERVERS = getAllServers(ns);
  let results = [];

  // Filter servers based on hackability criteria.
  for (let server of SERVERS) {
    if (server === "home") continue;
    let has_root = ns.hasRootAccess(server);
    let is_hackable = ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel();
    let has_money = ns.getServerMaxMoney(server) > 0;
    if (is_hackable && has_root && has_money) results.push(server);
  }

  // Sort the hackable servers by their maximum money capacity, in descending order.
  results.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));

  // Write the sorted list of hackable servers to the targeted file.
  await HACKABLE_TARGETS.write(results, "w");

  /**
   * Discovers all servers connected to the starting server ("home"), using a depth-first search.
   * Unique servers are recorded to ensure each is processed only once.
   * @param {NS} ns - The namespace object for accessing game functions.
   * @returns {string[]} An array of unique server names.
   */
  function getAllServers(ns) {
    let servers = [];
    let stack = ["home"];

    while (stack.length > 0) {
      const CURRENT = stack.pop();
      if (!servers.includes(CURRENT)) {
        servers.push(CURRENT);
        stack.push(...ns.scan(CURRENT).filter(next => !servers.includes(next)));
      }
    }
    return servers;
  }
}