@REM reword.bat <filename> <action=reword|combine> [count]

@REM        setlocal & set "GIT_SEQUENCE_EDITOR='H:\\shared\\digipowers\\vscode-git-graph\\reword.bat' %1 combine 2" & git rebase -i HEAD~4 & endlocal

@echo off

setlocal

set "MY_VARIABLE=value"
REM set "GIT_SEQUENCE_EDITOR='H:\\shared\\digipowers\\vscode-git-graph\\reword.bat' tesfile combine 3" 

ts-node "H:\\shared\\digipowers\\vscode-git-graph\\src\\reword.ts" %1 %2 %3

echo "After the command: %MY_VARIABLE%"

endlocal 

exit /b 0



REM this works without using env vars, https://stackoverflow.com/questions/19713861/git-rebase-editor-something-other-than-vim-for-easier-squashing
REM first editor doesn't have an "abort" button like the second
git -c sequence.editor="code --wait" -c core.editor="code --wait" rebase -i HEAD~3

git -c sequence.editor="'H:\\shared\\digipowers\\vscode-git-graph\\reword.bat' testfile combine 2" -c core.editor="code --wait" rebase -i HEAD~3

git -c sequence.editor="ts-node 'H:\\shared\\digipowers\\vscode-git-graph\\src\\reword.ts' testfile combine 2" -c core.editor="code --wait" rebase -i HEAD~3

REM named params, the 3's must match
git -c sequence.editor="ts-node 'H:\\shared\\digipowers\\vscode-git-graph\\src\\rebase.ts' --action reword --n 3"  rebase -i HEAD~3

REM and combining
git -c sequence.editor="ts-node 'H:\\shared\\digipowers\\vscode-git-graph\\src\\rebase.ts' --action combine --n 3 --c 2"  rebase -i HEAD~3