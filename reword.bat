@REM reword.bat <filename> <action=reword|combine> [count]


@echo off

ts-node "H:\\shared\\digipowers\\vscode-git-graph\\src\\reword.ts" %1 %2 %3
exit /b 0

