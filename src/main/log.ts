import log from 'electron-log';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

const userDataPath = app.getPath('userData');
const logFolderPath = path.join(userDataPath, 'logs');

if (!fs.existsSync(logFolderPath)) {
	fs.mkdirSync(logFolderPath, { recursive: true });
}

log.transports.file.resolvePath = () => path.join(logFolderPath, 'main.log');

export default log;
