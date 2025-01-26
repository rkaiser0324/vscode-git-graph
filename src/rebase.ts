/* eslint-disable no-console */

/*
npm install -g ts-node

*/

function usage() {
	console.error('Usage: ts-node rebase.ts --action <reword|combine> --n <num-commits-back> [--c <count-to-combine>] <git-rebase-todo-filename>\n');
	exit(1);
}

interface Options {
	action: string,
	numCommitsBack: number,
	count?: number,
	filename: string
  }

import * as fs from 'fs';
import { exit } from 'process';
import { exec } from 'child_process';

// const action = process.argv[2];
// const numCommitsBackArg = process.argv[3];
// const countArg = process.argv[4];

console.log(process.argv);

// Parse command-line arguments
const args = process.argv.slice(2);
const options: Options = {
	action: '',
	numCommitsBack: 0,
	filename: ''
};

for (let i = 0; i < args.length; i += 2) {

	const key = args[i];
	const value = args[i + 1];

	switch (key) {
		case '--action':
			options.action = value;
			break;
		case '--n':
			options.numCommitsBack = parseInt(value, 10);
			break;
		case '--c':
			options.count = parseInt(value, 10);
			break;
		default:
			if (i === args.length - 1 && !value) {
				// This is the filename of git-rebase-todo
				options.filename = key;
			} else {
				console.error(`Unknown option: ${key}`);
				process.exit(1);
			}
	}
}

const action = options.action;
const numCommitsBack = options.numCommitsBack;
const count = options.count;

if (!action) {
	usage();
}

if (action === 'combine') {
	if (!count) {
		console.error('Count not specified.');
		usage();
	} else if (count < 2) {
		console.error('Invalid count. Count must be an integer greater than 1.');
		usage();
	}
} else if (action !== 'reword') {
	console.error('Invalid action.');
	usage();
}

if (!numCommitsBack) {
	console.error('Num commits back not specified.');
	usage();
}

// numCommitsBack = parseInt(numCommitsBackArg, 10);
if (isNaN(numCommitsBack) || numCommitsBack < 0) {
	console.error('Invalid numCommitsBack. numCommitsBack must be an integer greater than 0.');
	usage();
}

function getLatestCommits(count: number):Promise<{hash: string, shortMessage: string}[]> {
	return new Promise((resolve, reject) => {
		exec(`git log -n ${count} --format="%h %s"`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			if (stderr) {
				reject(new Error(stderr));
				return;
			}

			const commits = stdout.trim().split('\n').map(commit => {
				const lines = commit.split('\n');
				const hash = lines[0].split(' ')[0];
				const shortMessage = lines[0].substring(lines[0].indexOf(' ') + 1);
				return { hash, shortMessage};
			});

			resolve(commits);
		});
	});
}

getLatestCommits(numCommitsBack)
	.then(commits => {
		if (action === 'reword') {
			console.log('rewording commits');
		} else console.log(`combining ${count} commits`);
		 console.log(commits);

		let newData = '';
		commits.reverse().forEach((c, i) => {
			let commitAction = 'pick';

			if (action === 'reword') {
				// console.log('rewording commits');
				if (i === 0) {
					commitAction = 'r   ';
				}
			} else {
				// console.log(`combining ${count} commits`);
				if (count && i > 0 && i < count) {
					commitAction = 's   ';
				}
			}
			// The message is included just to aid in debugging, it's not used by git.
			let line = `${commitAction} ${c.hash} ${ellipsis(c.shortMessage)}`;
			newData += line + '\n';
			console.log(line);

		});

		fs.writeFile(options.filename, newData, 'utf8', (err) => {
			if (err) {
				console.error(`Error writing file ${options.filename}: ${err}`);
				exit(1);
			}

			console.log(`Successfully modified file: ${options.filename}`);
		});
	})
	.catch(error => {
		console.error('Error fetching commits:', error);
	});


/*
fs.readFile(options.filename, 'utf8', (err: any, data: string) => {
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

function ellipsis(str:string, maxLength = 50) {
	if (str.length <= maxLength) {
	  return str;
	} else {
	  return str.substring(0, maxLength - 3) + '...';
	}
}
