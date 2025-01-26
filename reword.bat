@REM @echo off
@REM set "filepath=%1"
@REM for /f "tokens=*" %%a in ('type "%filepath%"') do (
@REM   set "line=%%a"
@REM   set "line=!line:pick=reword!"
@REM   echo !line!>>temp.txt
@REM )
@REM del %filepath%
@REM type temp.txt>%filepath%

@echo off
@REM set "filename=%1"
@REM echo "filename=%1"
powershell.exe -File "H:\\shared\\digipowers\\vscode-git-graph\\reword-fromc.ps1" -FilePath %1
exit /b 0


@REM powershell.exe -File "H:\\shared\\digipowers\\vscode-git-graph\\reword-fromc.ps1" -FilePath %1