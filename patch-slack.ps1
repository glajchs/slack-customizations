<#

If any windows users like myself hate having to manually update this whenever a new Slack version is released. Here is a powershell script I found in another repository (credit to the original author) and edited to support being able to run on startup and append if required.
# SOURCE: Andrew Cartwright saved me a ton of time...
# Original Post: https://github.com/laCour/slack-night-mode/issues/73#issuecomment-385613286
Instructions:
Search for Powershell in windows search
Open "Windows Powershell ISE"
Copy below script into Windows Powershell ISE
Hit save, give it any name, keep the file type as "PowerShell Files" and remember the location you saved it at. (This means you can just run that file in future from now on)
Press F5 on the keyboard to execute the script
Close Windows Powershell ISE

changes
2018-05-01 // Andrew Cartwright // original authoring
2018-10-10 // SheldonH          // Updated invoking of slack after startup.
2019-03-04 // Sheldon           // Updated to handle app installed to program x86 and remove the custom content with new
2019-03-07 // SheldonH          // signficant changes to handle usage with slack-customizations, patching, symlink and copying contents from repo into local folder. This eliminates remote calls

#>
$script:RepoDirectory = $PSScriptRoot

# used for better logging and output
if ((Get-Module PSFramework -ListAvailable | Select-Object -First 1).Count -eq 0)
{
    Write-Verbose "preimport.ps1 > installing PSFramework as not showing currently available to current user"
    Install-Module PSFramework -Scope CurrentUser -Force -AllowClobber -Confirm:$false
}


$PatchFiles = [pscustomobject]@{
    'ssb-interop-snippet-append.js' = (Get-Content -Path (Join-Path $script:RepoDirectory 'patch-files\ssb-interop-snippet-append.js') -Raw)
    'index-snippet-append.js'       = (Get-Content -Path (Join-Path $script:RepoDirectory 'patch-files\index-snippet-append.js') -Raw)
}

#----------------------------------------------------------------------------#
#                               Local Storage                                #
#----------------------------------------------------------------------------#

$PluginDirectory = (New-Item -Path (Join-Path $env:UserProfile '.slack') -ItemType Directory -Force).FullName
$SymLinkLocation = (    New-Item -Path $SymLinkLocation -ItemType SymbolicLink -Value $PluginDirectory -Force).FullName
Start-Process -FilePath 'CMD.EXE' -ArgumentList ('/C robocopy.exe "{0}" "{1} " /NFL /NC  /XD "*tests"' -f "$script:RepoDirectory\.slack ", $PluginDirectory) -NoNewWindow -PassThru | Wait-Process


#----------------------------------------------------------------------------#
#                                 Stop Slack                                 #
#----------------------------------------------------------------------------#
Get-Process Slack -ErrorAction SilentlyContinue | Stop-Process



#----------------------------------------------------------------------------#
#                 Identify Paths Based on Install Locations                  #
#----------------------------------------------------------------------------#
$slackBaseDir = "$env:LocalAppData\Slack", "C:\Program Files (x86)\Slack"
$installations = Get-ChildItem $slackBaseDir  -Filter *.exe -ea SilentlyContinue  | Where-Object { $_.Name.StartsWith("app-") -or $_.Name -match 'slack.exe'} | Select-PSFObject * -ScriptProperty @{
    Version = {
        try
        {
            [version]$this.Name.Substring(4)
            Write-PSFMessage -Level Important -Function 'patch-slack.ps1' -message "Matched Version from [version]`$this.Name.Substring(4): $([version]$this.Name.Substring(4))"

        }
        catch
        {

            $this.VersionInfo.ProductVersion
            Write-PSFMessage -Level Important -Function 'patch-slack.ps1' -message "Matched Version from `$this.VersionInfo.ProductVersion: $($this.VersionInfo.ProductVersion)"
        }

    }
} | Sort-Object -Property Version | Select-Object -Last 1
$Version = $installations.Version # to ensure if windows 10 + app, etc installed, this is updating the most recent version installed
Write-PSFMessage -Level Important -Message "Choosing highest present Slack version: $version";




#----------------------------------------------------------------------------#
#                            PATCH index.js                                  #
#----------------------------------------------------------------------------#
$filename = (Get-ChildItem -Path $installations.Directory -Recurse | Where-Object FullName -match 'resources\\app.asar.unpacked\\src\\static\\index\.js').FullName
$content = Get-Content $filename -Raw
$modAdded = $false;
$MatchPlugins = '(?ms)(\/\*\*\sStart\sSlack\sPlugins\sSection\s\*\*\/.*\/\*\*\sEnd\sSlack\sPlugins\sSection\s\*\*\/)'
#----------------------------------------------------------------------------#
#                      Clear Custom Content & Add Back                       #
#----------------------------------------------------------------------------#
if ($content -match $MatchPlugins)
{
    Write-PSFMessage -Level Important -Message "Clearing the custom content"

    # replace for each match identified. Simple loop to do this. Found inspiration on this from technet here -- http://bit.ly/2Uxspyk
    ([Regex]::Matches($content, $MatchPlugins)).Groups.Name | ForEach-Object {
        $content = $content -replace $MatchPlugins, ''
    }
    Set-Content  -Path $FileName -Value  $content  -Force
}
#----------------------------------------------------------------------------#
#                            add custom injection                            #
#----------------------------------------------------------------------------#
if ($content -notmatch '\/\/ CUSTOM START')
{
    Add-Content -Path $filename -Value $PatchFiles.'index-snippet-append.js'
    Write-PSFMessage -Level Important -Message "Mod Added To index.js";
    $modAdded = $true;
}
else
{
    Write-PSFMessage -Level Important -Message "Mod Detected In index.js - Skipping";
    Write-PSFMessage -Level Warning "To remove theme edit this file: $($version.FullName)\resources\app.asar.unpacked\src\static\index.js"
}




#----------------------------------------------------------------------------#
#                               PATCH ssb-interop.js                         #
#----------------------------------------------------------------------------#
$filename = (Get-ChildItem -Path $installations.Directory -Recurse | Where-Object FullName -match "resources\\app.asar.unpacked\\src\\static\\ssb\-interop\.js").FullName
$content = Get-Content $filename -Raw

#----------------------------------------------------------------------------#
#                      Clear Custom Content & Add Back                       #
#----------------------------------------------------------------------------#
if ($content -match $MatchPlugins)
{
    Write-PSFMessage -Level Important -Message "Clearing the custom content"
    # replace for each match identified. Simple loop to do this. Found inspiration on this from technet here -- http://bit.ly/2Uxspyk
    ([Regex]::Matches($content, $MatchPlugins)).Groups.Name | ForEach-Object {
        $content = $content -replace $MatchPlugins, ''
    }
    Set-Content  -Path $FileName -Value  $content  -Force
}

#----------------------------------------------------------------------------#
#                            add custom injection                            #
#----------------------------------------------------------------------------#
if ($content -notmatch $MatchPlugins)
{
    Add-Content -Path $filename -Value $PatchFiles.'ssb-interop-snippet-append.js'
    Write-PSFMessage -Level Important -Message "Mod Added To ssb-interop.js";
    $modAdded = $true;
}
else
{
    Write-PSFMessage -Level Important -Message "Mod Detected In ssb-interop.js - Skipping";
    Write-PSFMessage -Level Warning "To remove theme edit this file: $($version.FullName)\resources\app.asar.unpacked\src\static\ssb-interop.js"
}

if (@(Get-Process "slack" -ErrorAction SilentlyContinue).Count -gt 0)
{
    Write-PSFMessage -Level Important -Message "Mod Complete - Mod Will Take Effect After Slack Is Restarted";
    Get-Process Slack -ErrorAction SilentlyContinue | Stop-Process
}
else
{
    Write-PSFMessage -Level Important -Message "Mod Complete";
}
Start-Process $Installations.FullName -NoNewWindow
