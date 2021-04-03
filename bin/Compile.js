#!/usr/bin/env node
const { promisify } = require("util");
const glob = promisify(require("glob"));
const exec = promisify(require("child_process").exec);

async function main()
{
	if (process.argv.length < 3)
		throw "invalid parameter";

	const {err, files} = await glob(process.argv[2]);
	
	if (err)
		throw "Could not list .less files.";

	const promises = [];

	// Start compiling each file.
	for(let i in files)
	{
		const inFile 	= files[i];
		const outFile 	= inFile.substr(0, inFile.lastIndexOf(".")) + ".css";

		console.log(`# [${i + 1}/${files.length}] Compiling: "${inFile}" -> "${outFile}"`);

		const prom = exec(`lessc "${inFile}" "${outFile}"`);
		promises.push(prom);
	}

	// Wait for all compilations to end.
	await Promise.all(promises);

	console.log(`# Finished compiling ${promises.length} files.`);

	return 0;
}

(async ()=> {
	try {
		await main();
	}
	catch(exc) {
		console.error(`Error: an exception occurred.\nDetails: "${exc}"`);
	}
})();
