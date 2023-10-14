/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { initIPCListeners } from './initIPCListeners';
import { initDB } from '../data/sequelize';
import log from './log';
import setupAUListeners from './setupAUListeners';


const setupAutoUpdater = (mainWindow: BrowserWindow) => {
	autoUpdater.logger = log;
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;
	autoUpdater.checkForUpdatesAndNotify();
	setupAUListeners(mainWindow);
}

let mainWindow: BrowserWindow | null = null;

const removeListeners = initIPCListeners();

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(log.error);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		resizable: true,
		show: true,
		frame: true,
		width: 1024,
		height: 728,
		fullscreen: false,
		icon: getAssetPath('logo_dark.png'),
		fullscreenable: true,
		movable: true,
		webPreferences: {
			nodeIntegration: true,
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../.erb/dll/preload.js')
		}
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	const menuBuilder = new MenuBuilder(mainWindow, autoUpdater);
	menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((electronData) => {
		shell.openExternal(electronData.url);
		return { action: 'deny' };
	});

	setupAutoUpdater(mainWindow);
};

app.on('before-quit', ()=>{
	removeListeners.forEach((listener)=>{
		listener.removeAllListeners(listener.channel);
	});
})

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed

	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app
	.whenReady()
	.then(() => {
		initDB();
	})
	.then(() => {
		createWindow();

		app.on('activate', () => {
			// On macOS, it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});
	})
	.catch(log.error);
