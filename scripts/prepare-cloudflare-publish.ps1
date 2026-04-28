param(
    [string]$OutputDirectory = ".cloudflare-pages"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$publishPath = Join-Path $repoRoot $OutputDirectory

if (Test-Path $publishPath) {
    Remove-Item $publishPath -Recurse -Force
}

New-Item -ItemType Directory -Path $publishPath | Out-Null

$rootFiles = @(
    "index.html",
    "akademie.html",
    "datenschutz.html",
    "impressum.html",
    "it-services.html",
    "ki-innovation.html",
    "kontakt.html",
    "ueber-uns.html",
    "styles.css",
    "script.js",
    "robots.txt",
    "sitemap.xml",
    "favicon.ico",
    "favicon.svg",
    "favicon-96x96.png",
    "apple-touch-icon.png",
    "site.webmanifest",
    "web-app-manifest-192x192.png",
    "web-app-manifest-512x512.png"
)

foreach ($file in $rootFiles) {
    $source = Join-Path $repoRoot $file
    if (-not (Test-Path $source)) {
        throw "Expected publish file is missing: $file"
    }

    Copy-Item $source -Destination $publishPath -Force
}

$assetDirectories = @(
    "Fotos",
    "Logos",
    "Referenzen"
)

foreach ($directory in $assetDirectories) {
    $source = Join-Path $repoRoot $directory
    if (-not (Test-Path $source)) {
        throw "Expected asset directory is missing: $directory"
    }

    Copy-Item $source -Destination $publishPath -Recurse -Force
}

Write-Host "Cloudflare Pages publish directory prepared at: $publishPath"
