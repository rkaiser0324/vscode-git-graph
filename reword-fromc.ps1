# git rebase -c "sequence.editor=some command --args" -i will start an interactive rebase but will not pop an editor on the todo file. Instead, it will run some command --args <path to the todo file>. The provided command should edit the given todo file in-place and exit. Then, git-rebase will process instructions from the todo file as usual.

# https://indigo.re/posts/2018-06-01-git-rebase-tips.html

# git rebase -c "sequence.editor=H:\shared\digipowers\vscode-git-graph\reword-fromc.ps1" -i HEAD~1

# $env:GIT_SEQUENCE_EDITOR = "H:\\shared\\digipowers\\vscode-git-graph\\reword-fromc.ps1"; git rebase -i HEAD~1

param([string]$FilePath)

Write-Output "Rewording file: $FilePath"

if (!(Test-Path -Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit 1
}

(Get-Content -Path $FilePath) | ForEach-Object { $_ -replace "pick", "reword" } | Set-Content -Path $FilePath


#### this is the problem, does not work and should

# powershell -File H:\shared\digipowers\vscode-git-graph\reword-fromc.ps1 -ArgumentList "sds" 


# works from PS console
$env:GIT_SEQUENCE_EDITOR = "H:\\shared\\digipowers\\vscode-git-graph\\reword.bat"; git rebase -i HEAD~1
