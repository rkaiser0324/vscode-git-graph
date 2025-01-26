/* eslint-disable no-console */

import { exit } from 'process';
import { exec } from 'child_process';

function usage() {
	console.error('Usage: ts-node check.ts <commit-hash>\n');
	exit(1);
}

const commitHash = process.argv[2];

if (!commitHash) {
	usage();
}

function commitDistanceFromHead(commitHash:string): Promise<{ distance: number }> {
	return new Promise((resolve, reject) => {
		exec(`git merge-base --is-ancestor ${commitHash} HEAD`, (error, _stdout, _stderr) => {
			if (error) {
				debugger;
				if (error.message) { // .code === 1) {
					resolve({ distance: -1 });
				} else {
					reject(new Error(`Error executing git merge-base: ${error.message}`));
				}
			} else {
				exec(`git rev-list --count ${commitHash}^..HEAD`, (err, count) => {
					if (err) {
						reject(new Error(`Error executing git rev-list: ${err.message}`));
					} else {
						resolve({ distance: parseInt(count.trim()) });
					}
				});
			}
		});
	});
}

commitDistanceFromHead(commitHash)
	.then(result => {
		if (result.distance) {
			console.log(`Commit ${commitHash} is ${result.distance} commits behind HEAD.`);
		} else {
			console.log(`Commit ${commitHash} is not an ancestor of HEAD.`);
		}
		return result.distance;
	})
	.catch(error => {
		console.error(error);
	});
