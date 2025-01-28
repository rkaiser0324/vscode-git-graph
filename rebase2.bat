@echo off
set "COMMIT_MESSAGE=new message here" 
set "GIT_SEQUENCE_EDITOR=powershell.exe -Command \"& { (Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject }\"" 
set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" 
git rebase -i HEAD~4

@echo off
set "COMMIT_MESSAGE=new message here" 
set "GIT_SEQUENCE_EDITOR=powershell.exe -Command '{ (Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject }'" 
set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" 
git rebase -i HEAD~4

set "COMMIT_MESSAGE=new message here" ^
& set "GIT_SEQUENCE_EDITOR=powershell.exe -Command \"& {(Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject}\"" ^
& set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" ^
& git rebase -i HEAD~4

set "COMMIT_MESSAGE=new message here" & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command '{ (Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject }'" ^
& set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" ^
git rebase -i HEAD~4


set "COMMIT_MESSAGE=new message here" & set "GIT_EDITOR=cmd /c echo %COMMIT_MESSAGE% >" git rebase -i HEAD~4


set "GIT_EDITOR=cmd /c echo hi mom >" & git rebase -i HEAD~4 & set "GIT_EDITOR="


setLocal enableDelayedExpansion & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command ""& { (Get-Content -Raw) -replace 'pick', 'reword' | Set-Content -Path $inputObject }""" 

REM works and now has | and & escaped
setLocal enableDelayedExpansion & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command "^& { (Get-Content -Raw) -replace 'pick', 'reword' ^| Set-Content -Path $inputObject }""


setLocal enableDelayedExpansion & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command "^& {  param([string]$FilePath) (Get-Content -Path $FilePath) ^| ForEach-Object { $_ -replace "^pick", "reword" } ^| Set-Content -Path $FilePath  }""




setLocal enableDelayedExpansion & echo "pick me" | powershell.exe -Command "^& { (Get-Content -Raw) -replace 'pick', 'reword' ^| Set-Content -Path $inputObject }"



setLocal enableDelayedExpansion & set "GIT_SEQUENCE_EDITOR=powershell.exe -Command "^& %{ (Get-Content -Path $_) ^| ForEach-Object { $_ -replace "^pick", "reword" } ^| Set-Content -Path $_ }""

setLocal enableDelayedExpansion & set "GIT_SEQUENCE_EDITOR=%{ (Get-Content -Path $_) ^| ForEach-Object { $_ -replace "^pick", "reword" } ^| Set-Content -Path $_ }"