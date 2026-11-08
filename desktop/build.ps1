# 一键打包 KeySpell 桌面版（Nuitka 原生编译 + 资源加密，Windows 64 位）
# 用法：在 PowerShell 中执行  .\build.ps1
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Version = "1.1.0"
Set-Location $PSScriptRoot

Write-Host "[1/4] 生成图标 ..."
python make_icon.py

Write-Host "[2/4] 加密网页资源 ..."
python pack_assets.py

Write-Host "[3/4] Nuitka 编译 exe（首次会自动下载编译器，耗时较长）..."
python -m nuitka --onefile --windows-console-mode=disable --windows-icon-from-ico=app.ico `
    --nofollow-import-to=tkinter --assume-yes-for-downloads `
    --output-dir="$PSScriptRoot\nuitka_out" --output-filename=KeySpell.exe `
    --company-name=Cici --product-name=KeySpell `
    --file-version=$Version --product-version=$Version `
    --file-description="KeySpell 代码打字练习" `
    "$PSScriptRoot\main.py"

Write-Host "[4/4] 复制到项目根目录 ..."
Copy-Item "$PSScriptRoot\nuitka_out\KeySpell.exe" "$Root\KeySpell.exe" -Force

Write-Host "完成：$Root\KeySpell.exe"
