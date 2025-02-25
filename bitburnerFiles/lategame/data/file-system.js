export class FileSystem {
    #ns;
    #file;

    /**
     * Creates an instance of the FileSystem class.
     * @param {object} ns - The namespace API that includes file operations.
     * @param {string} file - The name of the file to be managed.
     */
    constructor(ns, file) {
        this.#ns = ns;
        this.#file = file;
    }

    /**
     * Creates a new file or clears an existing one.
     */
    async newFile() {
        await this.#ns.write(this.#file, "", "w");
    }

    /**
     * Appends or writes data to the file.
     * @param {any} data - The data to write into the file.
     * @param {string} mode - The writing mode, 'a' for append and 'w' for write (overwrite).
     */
    async write(data, mode = "a") {
        const formattedData = JSON.stringify(data);
        await this.#ns.write(this.#file, formattedData, mode);
    }

    /**
     * Reads data from the file and parses it from JSON.
     * @returns {Promise<any>} A promise that resolves to the parsed data from the file.
     */
    async read() {
        let dataString = await this.#ns.read(this.#file);
        return dataString.length > 0 ? JSON.parse(dataString) : [];
    }
}