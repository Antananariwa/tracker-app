- dropdown is now limited to 150 px and results are scrollable:
.dropdown {
  max-height: 150px;
  overflow-y: auto;
}




# Auto-detect the java.exe that reports version 25, then set JAVA_HOME and prepend its bin to User PATH
$javaPaths = (& where.exe java) -split "`r?`n"
$found = $null
foreach ($p in $javaPaths) {
  try {
    $v = (& "$p" --version) -join "`n"
    if ($v -match '\b25\b') { $found = $p; break }
  } catch {}
}
if (-not $found) {
  Write-Host "Did not find a java.exe on PATH that reports Java 25. Skip step 2 and use the one-time run in step 3."
  exit
}
$jdkBin = Split-Path $found -Parent
$jdkRoot = C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot
Write-Host "Found Java 25 at:`n $found`nSetting JAVA_HOME to: $jdkRoot"
# set user JAVA_HOME
setx JAVA_HOME "$jdkRoot" | Out-Null
# prepend bin to User PATH
$old = [Environment]::GetEnvironmentVariable("Path","User")
if ($old -notlike "$jdkBin*") {
  $new = "$jdkBin;" + $old
  [Environment]::SetEnvironmentVariable("Path",$new,"User")
  Write-Host "Prepended $jdkBin to User PATH."
} else {
  Write-Host "User PATH already contains $jdkBin"
}
Write-Host "Done. CLOSE and RE-OPEN PowerShell (new session) and run: java --version"