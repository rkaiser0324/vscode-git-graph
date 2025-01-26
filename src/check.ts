/* eslint-disable no-console */

import { exit } from 'process';
import { execSync } from 'child_process';

function usage() {
	console.error('Usage: ts-node check.ts <commit-hash>\n');
	exit(1);
}

const commitHash = process.argv[2];

if (!commitHash) {
	usage();
}
/*
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
*/
// const text = Promise.resolve('Hey there');
// console.log('outside: ' + text);

// commitDistanceFromHead(commitHash)
// 	.then(result => {
// 		if (result.distance) {
// 			console.log(`Commit ${commitHash} is ${result.distance} commits behind HEAD.`);
// 		} else {
// 			console.log(`Commit ${commitHash} is not an ancestor of HEAD.`);
// 		}
// 		return result.distance;
// 	})
// 	.catch(error => {
// 		console.error(error);
// 	});


function getCommitDistanceFromHead(commitHash:string):{ distance: number } {
	let count = -1;
	try {

		// This throws an error if the commit is not an ancestor
		execSync(`git merge-base --is-ancestor ${commitHash} HEAD`, { stdio: 'ignore' });

		count = parseInt(execSync(`git rev-list --count ${commitHash}^..HEAD`, { encoding: 'utf8' }).trim());

	} catch (error) {
		// if (error.code === 1) {
		// 	return { isAncestor: false };
		// } else {
		// debugger;
		// console.error(error);
		// count = -1;
		// throw new Error(`Error executing Git command: ${error}`);
		// }
	} finally {
		return { distance: count };
	}
}

let d = getCommitDistanceFromHead(commitHash);
console.log(d);
