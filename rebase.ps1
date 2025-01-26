(Get-Content -Path (Get-Content -Raw)) -replace "pick", "reword" | Set-Content -Path (Get-Content -Raw)



$filename = (Get-Content -Raw); (Get-Content -Path $filename) -replace "pick", "reword" | Set-Content -Path $filename