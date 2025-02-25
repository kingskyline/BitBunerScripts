import { FileSystem } from "/lategame/data/file-system.js";
/**
 * Retrieves and records the names of all servers with root access within a game environment.
 * The script first collects all servers accessible from a starting point and checks each for root access.
 * Servers with root access are sorted by their maximum RAM capacity in descending order, 
 * and the list is saved to a specified file.
 * This script leverages a modular approach, using a custom `FileSystem` class for file operations.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes
 *                  functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Instantiate the FileSystem class for file operations, targeting a specific file.
  const ROOTED_SERVERS = new FileSystem(ns, "/lategame/data/rooted-servers.txt");

  // Retrieve a list of all servers accessible from the "home" server.
  const SERVERS = getAllServers(ns);
  let results = [];

  // Filter servers to find those with root access.
  for (let s of SERVERS) {
    if (ns.hasRootAccess(s)) results.push(s);
  }

  // Sort the servers with root access by their maximum RAM, in descending order.
  results.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));

  // Write the sorted list of servers to the targeted file.
  await ROOTED_SERVERS.write(results, "w");

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