export async function main(ns) {
  // Disable verbose logging for specific methods to clean up the output.
  const DISABLED_LOGS = ['getServerMaxRam', 'getServerMoneyAvailable'];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  ns.tail(); // Open a log window

  const LOOP_DELAY = ns.args[0] || 1000 * 10; // Default loop delay (10 seconds)
  const CALCULATION_DELAY = 5; // Delay after calculations or server actions
  const RESERVE_AMOUNT = 100_000_000_0; // Keep at least 100M

  let ram = 8; // Initial RAM threshold
  let servers = ns.getPurchasedServers(); // Get owned servers

  while (true) {
    ns.printf("Checking for servers with %s RAM.", ns.formatRam(ram));

    for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
      let server = "server-" + i;
      let availableMoney = ns.getServerMoneyAvailable("home");

      if (servers.includes(server)) {
        // Server exists, check if it needs an upgrade.
        if (ns.getServerMaxRam(server) < ram) {
          let cost = ns.getPurchasedServerUpgradeCost(server, ram);

          while (availableMoney < cost + RESERVE_AMOUNT) {
            ns.printf("%s needs %s to upgrade to %s. Waiting...", server, ns.formatNumber(cost), ns.formatRam(ram));
            await ns.sleep(LOOP_DELAY);
            availableMoney = ns.getServerMoneyAvailable("home"); // Recheck money
          }

          if (ns.upgradePurchasedServer(server, ram)) {
            ns.printf("%s upgraded to %s", server, ns.formatRam(ram));
            servers = ns.getPurchasedServers(); // Refresh list
          }
        }
      } else {
        // Server does not exist, attempt to purchase.
        let cost = ns.getPurchasedServerCost(ram);

        while (availableMoney < cost + RESERVE_AMOUNT) {
          ns.printf("Need %s to purchase %s with %s. Waiting...", ns.formatNumber(cost), server, ns.formatRam(ram));
          await ns.sleep(LOOP_DELAY);
          availableMoney = ns.getServerMoneyAvailable("home"); // Recheck money
        }

        if (ns.purchaseServer(server, ram)) {
          ns.printf("Purchased %s with %s", server, ns.formatRam(ram));
          servers = ns.getPurchasedServers(); // Refresh list
        }
      }
    }

    ram *= 2; // Double RAM for next loop
    await ns.sleep(CALCULATION_DELAY);
  }
}
