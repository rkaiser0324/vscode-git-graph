/* eslint-disable no-console */
import * as fs from 'fs';

const filePath = process.argv[2];

if (!filePath) {
	console.error('Usage: node script.ts <FilePath>');
	process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err}`);
		process.exit(1);
	}

	const newData = data.replace(/pick/g, 'reword');

	fs.writeFile(filePath, newData, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing file: ${err}`);
			process.exit(1);
		}

		console.log(`Successfully replaced "pick" with "reword" in ${filePath}`);
	});
});
