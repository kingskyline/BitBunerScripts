/** @param {NS} ns **/
export async function main(ns) {
	// Sleep for given amount,
	const sleep = ns.args[1] || 1;
	await ns.sleep(sleep);
	// and then weaken!
	await ns.weaken(ns.args[0]);
}