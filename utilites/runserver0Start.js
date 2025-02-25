/** @param {NS} ns */
export async function main(ns) {
    // Define the list of files to copy and the target server
    const filesToCopy = [
        "aio/bin.wk.js",
        "aio/bin.gr.js",
        "aio/bin.hk.js",
        "aio/goserver0.js"
    ];
    const targetServer = "server-0";

    ns.print("Starting to copy files to " + targetServer);

    // Loop through the list of files and copy each to the target server
    for (let i = 0; i < filesToCopy.length; i++) {
        const file = filesToCopy[i];
        ns.print(`Copying ${file} to ${targetServer}... (${i + 1}/${filesToCopy.length})`);
        await ns.scp(file, targetServer, "home");

        // Print progress after each file is copied
        ns.print(`${file} copied successfully to ${targetServer}`);
    }

    // After copying the files, execute the script "aio/goserver0.js" on server-0
    ns.print("All files copied. Now running aio/goserver0.js on " + targetServer);
    await ns.exec("aio/goserver0.js", targetServer);

    // Print final message indicating the script has been executed
    ns.print("Script aio/goserver0.js is now running on " + targetServer);
}
