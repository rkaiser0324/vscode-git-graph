/* eslint-disable no-console */

/*
npm install -g ts-node

* use "dummy" when not calling via reword.bat

ts-node src/reword.ts dummy <FilePath> <action> <count>

*/

import * as fs from 'fs';

const filePath = process.argv[2];
const action = process.argv[3];
const countArg = process.argv[4];

console.log(process.argv);

if (!filePath) {
	console.error('Usage: node script.ts <FilePath> <action> [count]');
	process.exit(1);
}

let count: number;

if (action === 'combine') {
	if (!countArg) {
		console.error('Count not specified.');
		process.exit(1);
	}

	const countNumber = parseInt(countArg, 10);
	if (isNaN(countNumber) || countNumber < 2) {
		console.error('Invalid count. Count must be an integer greater than 1.');
		process.exit(1);
	}
	count = countNumber;

}

fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err}`);
		process.exit(1);
	}

	let newData;
	if (action === 'reword') {
		newData = data.replace(/pick/g, 'reword');
	} else {
		const lines = data.split('\n').reverse();
		newData = lines.map((line, index) => {
			if (index === 0 || index >= count) {
				return line;
			} else {
				return line.replace(/pick/g, 'squash');
			}
		}).join('\n');
	}

	console.log(newData);

	fs.writeFile(filePath, newData, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing file: ${err}`);
			process.exit(1);
		}

		console.log(`Successfully modified file: ${filePath}`);
	});
});
