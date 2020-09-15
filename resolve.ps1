function Dtmi2Path
{
    param (
        [string] $dtmi
    )
    $idAndVersion = $dtmi.ToLowerInvariant().Split(';')
    [string[]] $segments = $idAndVersion[0].Split(':')
    $lastSegment = $segments[$segments.Length-1]
    $version = $idAndVersion[1]
    $fileName = "$lastSegment-$version.json"
    $segments = $segments[0..($segments.length-2)]
    $path =[String]::Join("/", $segments)
    return "$path/$fileName"
}

$repo="https://iotmodels.github.io/registry/"
$dtmi="dtmi:my:device:model;3"
$path = Dtmi2Path($dtmi)

$modelJson = Invoke-WebRequest -URI $repo$path
$model = ConvertFrom-Json -InputObject @modelJson
Write-Host $model.'@id'
$model.'contents' | ft


