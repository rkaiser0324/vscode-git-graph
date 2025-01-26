set GIT_EDITOR=notepad.exe & git commit -m 



set "COMMIT_MESSAGE=new message here" & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command {(Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject}" & set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" & git rebase -i HEAD~3

set "COMMIT_MESSAGE=new message here" & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command \"{(Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject}\"" & set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" & git rebase -i HEAD~4



REM also works
set "GIT_SEQUENCE_EDITOR='H:\\shared\\digipowers\\vscode-git-graph\\reword.bat'" & git rebase -i HEAD~1