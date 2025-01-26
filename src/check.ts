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

function checkCommitDistance(commitHash:string): Promise<{ isAncestor: boolean, distance?: number }> {
	return new Promise((resolve, reject) => {
		exec(`git merge-base --is-ancestor ${commitHash} HEAD`, (error, _stdout, _stderr) => {
			if (error) {
				debugger;
				if (error.message) { // .code === 1) {
					resolve({ isAncestor: false });
				} else {
					reject(new Error(`Error executing git merge-base: ${error.message}`));
				}
			} else {
				exec(`git rev-list --count ${commitHash}^..HEAD`, (err, count) => {
					if (err) {
						reject(new Error(`Error executing git rev-list: ${err.message}`));
					} else {
						resolve({ isAncestor: true, distance: parseInt(count.trim()) });
					}
				});
			}
		});
	});
}

checkCommitDistance(commitHash)
	.then(result => {
		if (result.isAncestor) {
			console.log(`Commit ${commitHash} is ${result.distance} commits behind HEAD.`);
		} else {
			console.log(`Commit ${commitHash} is not an ancestor of HEAD.`);
		}
	})
	.catch(error => {
		console.error(error);
	});
