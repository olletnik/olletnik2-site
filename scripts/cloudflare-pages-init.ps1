param(
    [string]$ProjectName = "kintello-de",
    [string]$ProductionBranch = "main",
    [string]$PublishDirectory = ".cloudflare-pages",
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"

function Require-EnvironmentVariable {
    param([string]$Name)

    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "Missing required environment variable: $Name"
    }
}

Require-EnvironmentVariable -Name "CLOUDFLARE_API_TOKEN"
Require-EnvironmentVariable -Name "CLOUDFLARE_ACCOUNT_ID"

$repoRoot = Split-Path -Parent $PSScriptRoot
$prepareScript = Join-Path $PSScriptRoot "prepare-cloudflare-publish.ps1"

Push-Location $repoRoot
try {
    & $prepareScript -OutputDirectory $PublishDirectory

    $projectsJson = npx wrangler pages project list --json
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to list Cloudflare Pages projects."
    }

    $projects = @()
    if (-not [string]::IsNullOrWhiteSpace($projectsJson)) {
        $projects = $projectsJson | ConvertFrom-Json
    }

    $projectExists = $projects | Where-Object { $_.name -eq $ProjectName }

    if (-not $projectExists) {
        Write-Host "Creating Cloudflare Pages project '$ProjectName'..."
        npx wrangler pages project create $ProjectName --production-branch $ProductionBranch
        if ($LASTEXITCODE -ne 0) {
            throw "Unable to create Cloudflare Pages project '$ProjectName'."
        }
    }
    else {
        Write-Host "Cloudflare Pages project '$ProjectName' already exists."
    }

    if (-not $SkipDeploy) {
        Write-Host "Deploying '$PublishDirectory' to Cloudflare Pages project '$ProjectName'..."
        npx wrangler pages deploy $PublishDirectory --project-name $ProjectName --branch $ProductionBranch --commit-dirty=true --commit-message "Manual Cloudflare Pages deployment"
        if ($LASTEXITCODE -ne 0) {
            throw "Unable to deploy Cloudflare Pages project '$ProjectName'."
        }
    }
}
finally {
    Pop-Location
}
