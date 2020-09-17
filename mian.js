const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
let mainWindow;
const log = require('electron-log')

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show:false,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    log.info('esta buscando actualizaciones - funciona');
    log.warn('Some problem appears - funciona');

    // mainWindow.webContents.on('did-finish-load', () => {
    //     autoUpdater.checkForUpdatesAndNotify();
    // })
    mainWindow.once('ready-to-show', () => {
        log.info('esta buscando actualizaciones');
        log.warn('Some problem appears');
        autoUpdater.checkForUpdatesAndNotify();
        mainWindow.show()
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    console.log("verifico version")
    event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
    log.info('esta buscando actualizaciones - data available');
    log.warn('Some problem appears - data available');
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    log.info('esta buscando actualizaciones - update downloaded');
    log.warn('Some problem appears - update downloaded');
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    log.info('esta buscando actualizaciones - restart app');
    log.warn('Some problem appears - restart app');
    autoUpdater.quitAndInstall();
});
