(Get-Content -Path (Get-Content -Raw)) -replace "pick", "reword" | Set-Content -Path (Get-Content -Raw)



$filename = (Get-Content -Raw); (Get-Content -Path $filename) -replace "pick", "reword" | Set-Content -Path $filename


COMMIT_MESSAGE="new message here" GIT_SEQUENCE_EDITOR='sed -i "1s/^pick/reword/"' GIT_EDITOR="printf \"%s\n\" \"$COMMIT_MESSAGE\" >" git rebase -i  HEAD~4