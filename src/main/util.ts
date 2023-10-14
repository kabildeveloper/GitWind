/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { Channels } from './channels';
import { ipcMain } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
	if (process.env.NODE_ENV === 'development') {
		const port = process.env.PORT || 1212;
		const url = new URL(`http://localhost:${port}`);
		url.pathname = htmlFileName;
		return url.href;
	}
	return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}


export function ipcMainOn(channel: Channels, listener: (event: Electron.IpcMainEvent, ...args: any[]) => void) {
	const listenerEvent = ipcMain.on(channel, listener);
	return { removeListener: listenerEvent.removeListener, removeAllListeners: listenerEvent.removeAllListeners, channel };
}

export function reply(event: Electron.IpcMainEvent, channel: Channels, ...args: any[]) {
	event.reply(channel, ...args);
}
