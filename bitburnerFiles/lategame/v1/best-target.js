import { FileSystem } from "/lategame/data/file-system.js";
/**
 * Evaluates a list of hackable servers and identifies the most profitable target
 * for hacking activities, based on a scoring system. The script reads a list of previously identified
 * hackable servers, assesses each based on its profitability and security level, and records
 * the best target into a file. The decision is based on the ratio of potential money gains to the
 * minimum security level of each server, while excluding servers that take too long to weaken.
 * This script uses a custom `FileSystem` class to facilitate file operations.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes
 *                  functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Instantiate FileSystem classes for file operations, targeting specific files for hackable targets and the best target.
  const HACKABLE_TARGETS = new FileSystem(ns, "/lategame/data/hackable-targets.txt");
  const BEST_TARGET = new FileSystem(ns, "/lategame/data/best-target.txt");

  // Read the list of hackable targets from the file.
  const TARGETS = await HACKABLE_TARGETS.read();

  // Define the maximum allowed time for weakening a server in minutes.
  const MAX_MINUTES = 30;
  let score = 0;
  let results = "n00dles";  // Default target if no other server qualifies.

  // Evaluate each target based on its weaken time and profitability-security ratio.
  for (let target of TARGETS) {
    let has_long_weaken_time = ns.getWeakenTime(target) > 1000 * 60 * MAX_MINUTES;
    if (has_long_weaken_time) continue;  // Skip servers that take too long to weaken.

    // Calculate the score as the ratio of maximum potential money to minimum security level.
    let new_score = ns.getServerMaxMoney(target) / ns.getServerMinSecurityLevel(target);
    if (new_score > score) {
      score = new_score;  // Update the best score found.
      results = target;   // Update the best target found.
    }
  }

  // Write the name of the best target server to the file.
  await BEST_TARGET.write(results, "w");
}