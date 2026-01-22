const { app, BrowserWindow, screen } = require('electron');

// 高DPI設定による座標のズレを防止
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  // .size はタスクバーを含む物理的な画面解像度を返します
  const { width, height } = primaryDisplay.size;

  const win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    focusable: false, // キーボードイベントも透過させる
    // フルスクリーンにすることでタスクバーの制限を回避
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Windows 11でタスクバーより前面に出すための呪文
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true);

  win.loadFile('index.html');

  // マウス操作を透過（これがないと下のボタンが押せません）
  win.setIgnoreMouseEvents(true);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});