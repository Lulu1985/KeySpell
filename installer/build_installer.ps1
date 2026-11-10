# 一键生成带 WebView2 运行库的安装包
# 用法：在 PowerShell 中执行  .\build_installer.ps1
$ErrorActionPreference = "Stop"

$Here = $PSScriptRoot
$Root = Split-Path -Parent $Here
$Asset = Join-Path $Here "assets\MicrosoftEdgeWebView2RuntimeInstallerX64.exe"

# 1. 确认应用 exe 已存在，否则先跑桌面版打包
if (-not (Test-Path (Join-Path $Root "KeySpell.exe"))) {
    Write-Host "[1/3] 未找到 KeySpell.exe，先打包桌面版 ..."
    & (Join-Path $Here "..\desktop\build.ps1")
} else {
    Write-Host "[1/3] 已找到 KeySpell.exe"
}

# 2. 缺少 WebView2 离线安装包时自动下载（约 205 MB）
if (-not (Test-Path $Asset)) {
    Write-Host "[2/3] 下载 WebView2 离线安装包 ..."
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Asset) | Out-Null
    curl.exe -L --fail --retry 2 -o $Asset "https://go.microsoft.com/fwlink/?linkid=2124701"
} else {
    Write-Host "[2/3] 已找到 WebView2 离线安装包"
}

# 3. 编译安装包
$Iscc = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if (-not (Test-Path $Iscc)) { $Iscc = "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe" }
if (-not (Test-Path $Iscc)) { throw "未找到 ISCC.exe，请先安装 Inno Setup 6：winget install JRSoftware.InnoSetup" }

Write-Host "[3/3] 编译安装包 ..."
& $Iscc (Join-Path $Here "KeySpell.iss")

Write-Host "完成：$(Join-Path $Here 'output\KeySpell-Setup-1.2.0.exe')"
