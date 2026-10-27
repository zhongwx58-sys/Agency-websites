@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PREVIEW_NODE=node"
if exist "E:\REA\runtime\node-v24.22.0-win-x64\node.exe" set "PREVIEW_NODE=E:\REA\runtime\node-v24.22.0-win-x64\node.exe"
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "PREVIEW_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
echo 请在浏览器打开 http://127.0.0.1:4174
echo 关闭本窗口将停止预览。
"%PREVIEW_NODE%" server.mjs
pause
