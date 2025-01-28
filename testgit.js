/* eslint no-use-before-define: 0 */  // --> OFF
/* eslint no-console: 0 */  // --> OFF

/*

commit 5 - HEAD - fix: refactor error suppression, updating check to accommodate new PHP 8.2 error message
commit 4 - chore: woocommerce-gateway-authorize-net-cim v3.10.8
commit 3 - chore: woocommerce-subscriptions v6.8.0
commit 2 - chore: woocommerce-gateway-authorize-net-cim 3.6.2
commit 1 - chore: gravityforms 2.8.18

To combine commits 2-3, numFirstCommitToCombine = 3, numCommitsToCombine = 2


*/
// node testgit.js <numFirstCommitToCombine> <numCommitsToCombine>

const { exec } = require('child_process');

const args = process.argv.slice(2); 

if (args.length !== 2) {
  console.error("Usage: node testgit.js <numFirstCommitToCombine> <numCommitsToCombine>");
  process.exit(1);
}

const numFirstCommitToCombine = parseFloat(args[0]);     // must be > 0
const numCommitsToCombine = parseFloat(args[1]);    // must be > 1, and <= numFirstCommitToCombine

if (isNaN(numFirstCommitToCombine) || isNaN(numCommitsToCombine)) {
  console.error("Invalid input. Please enter valid numbers.");
  process.exit(1);
}


function getLatestCommits(count) {
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

getLatestCommits(numFirstCommitToCombine)
  .then(commits => {
    let reversed = commits.reverse();
    reversed.forEach((c, i) => {
        let action = "pick"
        if (i > 0 && i < numCommitsToCombine) 
        {
            action = "s   ";
        }
        console.log(`${action} ${c.hash} ${c.shortMessage}`);
    });
  })
  .catch(error => {
    console.error('Error fetching commits:', error);
  });