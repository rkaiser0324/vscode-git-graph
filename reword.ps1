(Get-Content -Raw) -replace "pick", "reword" | Set-Content -Path $inputObject



echo "C:\path\to\your\file.txt" | & { 
    param([string]$FilePath)
    (Get-Content -Path $FilePath) | ForEach-Object { $_ -replace "^pick", "reword" } | Set-Content -Path $FilePath 
}


echo "C:\path\to\your\file.txt" | & {  param([string]$FilePath) (Get-Content -Path $FilePath) | ForEach-Object { $_ -replace "^pick", "reword" } | Set-Content -Path $FilePath  }


echo testfile | %{ (Get-Content -Path $_) | ForEach-Object { $_ -replace "^pick", "reword" } | Set-Content -Path $_ } 


set GIT_SEQUENCE_EDITOR='%{ (Get-Content -Path $_) | ForEach-Object { $_ -replace "^pick", "reword" } | Set-Content -Path $_ } '