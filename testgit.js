/* eslint no-use-before-define: 0 */  // --> OFF
/* eslint no-console: 0 */  // --> OFF

const { exec } = require('child_process');

function getLatestCommits(count = 5) {
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

getLatestCommits()
  .then(commits => {
    console.log(commits); 
  })
  .catch(error => {
    console.error('Error fetching commits:', error);
  });