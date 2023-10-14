import { autoUpdater } from 'electron-updater';
import { BrowserWindow } from 'electron';
let executionFlag = true;

export default (mainWindow: BrowserWindow) => {
	autoUpdater.on('update-available', (info)=>{
		mainWindow.webContents.send('update-available', info);
	});

	autoUpdater.on('update-not-available', (info) => {
		if(executionFlag) {
			executionFlag = false;
		}
		else {
			mainWindow.webContents.send('update-not-available');
		}
	});

	autoUpdater.on('update-downloaded', (_event)=>{
		mainWindow.webContents.send('update-downloaded');
	});

}
