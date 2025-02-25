/** @param {NS} ns **/
export async function main(ns) {
  // Defaults to the n00dles server the script is running on if no target is specified
  const target = ns.args[0] || "foodnstuff ";

  ns.print("Starting hacking script on target: " + target);

  while (true) {
    const securityThreshold = ns.getServerMinSecurityLevel(target) + 3;
    const moneyThreshold = ns.getServerMaxMoney(target) * 0.50;

    if (ns.getServerSecurityLevel(target) > securityThreshold) {
      // Weaken the server if security level is too high
      ns.print("Weakening " + target + " due to high security level.");
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
      // Grow the server's money if it's below our threshold
      ns.print("Growing " + target + " due to low available money.");
      await ns.grow(target);
    } else {
      // Hack the server if security is low and money is high
      ns.print("Hacking " + target + ".");
      const hackedAmount = await ns.hack(target);
      const formattedAmount = Number(hackedAmount.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 });
      ns.toast(`Hacked \$${formattedAmount} from ${target} through ${ns.getHostname()}.`, "success", 5000);
    }
  }
}