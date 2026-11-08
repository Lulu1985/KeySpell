; KeySpell 安装脚本（Inno Setup 6）
; 用法：ISCC.exe KeySpell.iss

#define MyAppName "KeySpell"
#define MyAppVersion "1.1.0"
#define MyAppPublisher "Cici"
#define MyAppExeName "KeySpell.exe"

[Setup]
AppId={{A7F3E1C2-5B4D-4E8A-9C1F-2D6B8A4E7F30}
AppName={#MyAppName} · 代码打字练习
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\KeySpell
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=output
OutputBaseFilename=KeySpell-Setup-{#MyAppVersion}
SetupIconFile=..\desktop\app.ico
Compression=lzma2/normal
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName} · 代码打字练习

[Languages]
Name: "chinesesimplified"; MessagesFile: "languages\ChineseSimplified.isl"

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加选项："; Flags: unchecked

[Files]
Source: "..\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "assets\MicrosoftEdgeWebView2RuntimeInstallerX64.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{tmp}\MicrosoftEdgeWebView2RuntimeInstallerX64.exe"; Parameters: "/silent /install"; StatusMsg: "正在安装 Microsoft Edge WebView2 运行库，请稍候……"; Flags: runhidden waituntilterminated; Check: not WebView2Installed
Filename: "{app}\{#MyAppExeName}"; Description: "立即启动 KeySpell"; Flags: nowait postinstall skipifsilent

[Code]
function WebView2Installed(): Boolean;
begin
  Result := DirExists(ExpandConstant('{commonpf32}\Microsoft\EdgeWebView\Application'))
         or DirExists(ExpandConstant('{commonpf}\Microsoft\EdgeWebView\Application'))
         or DirExists(ExpandConstant('{localappdata}\Microsoft\EdgeWebView\Application'));
end;
