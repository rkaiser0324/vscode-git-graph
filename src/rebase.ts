/* eslint-disable no-console */

/*
npm install -g ts-node

ts-node src/rebase.ts <action=reword|combine> <num-commits-back> [count-to-combine]

*/

// import * as fs from 'fs';
import { exit } from 'process';
import { exec } from 'child_process';

const action = process.argv[2];
const numCommitsBackArg = process.argv[3];
const countArg = process.argv[4];

console.log(process.argv);

if (!action) {
	console.error('Usage: ts-node rebase.ts <action=reword|combine> <num-commits-back> [count-to-combine]');
	exit(1);
}

function getLatestCommits(count: number):Promise<{hash: string, shortMessage: string, fullMessage: string}[]> {
	return new Promise((resolve, reject) => {
		exec(`git log -n ${count} --format="%h %s%n%b"`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr) {
				reject(new Error(stderr));
				return;
			}

			const commits = stdout.trim().split('\n\n').map(commit => {
				const lines = commit.split('\n');
				const hash = lines[0].split(' ')[0];
				const shortMessage = lines[0].substring(lines[0].indexOf(' ') + 1);
				const fullMessage = lines.slice(1).join('\n');
				return { hash, shortMessage, fullMessage };
			});

			resolve(commits);
		});
	});
}

let count: number;

if (action === 'combine') {
	if (!countArg) {
		console.error('Count not specified.');
		exit(1);
	}

	const countNumber = parseInt(countArg, 10);
	if (isNaN(countNumber) || countNumber < 2) {
		console.error('Invalid count. Count must be an integer greater than 1.');
		exit(1);
	}
	count = countNumber;

} else if (action !== 'reword') {
	console.error('Invalid action.');
	exit(1);
}

let numCommitsBack: number;

if (!numCommitsBackArg) {
	console.error('Num commits back not specified.');
	exit(1);
}

numCommitsBack = parseInt(numCommitsBackArg, 10);
if (isNaN(numCommitsBack) || numCommitsBack < 0) {
	console.error('Invalid numCommitsBack. numCommitsBack must be an integer greater than 0.');
	exit(1);
}


getLatestCommits(numCommitsBack)
	.then(commits => {
		if (action === 'reword') {
			console.log('rewording commits');
		} else console.log(`combining ${count} commits`);

		let reversed = commits.reverse();
		reversed.forEach((c, i) => {
			let commitAction = 'pick';

			if (action === 'reword') {
				// console.log('rewording commits');
				if (i === 0) {
					commitAction = 'r   ';
				}
			} else {
				// console.log(`combining ${count} commits`);
				if (i > 0 && i < count) {
					commitAction = 's   ';
				}
			}
			console.log(`${commitAction} ${c.hash} ${c.shortMessage}`);
		});
	})
	.catch(error => {
		console.error('Error fetching commits:', error);
	});


/*
fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err}`);
		exit(1);
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
			exit(1);
		}

		console.log(`Successfully modified file: ${filePath}`);
	});
});
*/
