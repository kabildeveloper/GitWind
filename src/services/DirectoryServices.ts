import { IDirectoryServices } from './IDirectoryServices';
import { dialog, IpcMainEvent } from 'electron';
import { returnStringResult } from '../types/types';
import fs from 'fs';
import sshpk from 'sshpk';
import { promisify } from 'util';
import log from '../main/log';

const access = promisify(fs.access);

class DirectoryServices implements IDirectoryServices {
	async browseRepoDirectoryService(event: IpcMainEvent, validationRequired: boolean): Promise<void> {
		const dialogResult = await dialog.showOpenDialog({
			properties: ['openDirectory']
		});
		if (!dialogResult.canceled) {
			const dir = dialogResult.filePaths[0];
			if (validationRequired) {
				const validatedResult = await this.validateRepoService(dir);
				event.reply('selected-dir-path', validatedResult);
			} else {
				event.reply('selected-dir-path', dir);
			}
		}
	}

	async browseSSHFileService(event: IpcMainEvent): Promise<void> {
		const dialogResult = await dialog.showOpenDialog({
			properties: ['openFile']
		});

		let result: returnStringResult = {
			data: '', error: null, isSuccessful: false
		};

		if (!dialogResult.canceled) {
			const selectedFile = dialogResult.filePaths[0];
			const file = fs.readFileSync(selectedFile, 'utf8');

			try {
				sshpk.parseKey(file, 'auto');
				log.info('ssh key parsed successfully and assume to be valid');
				result.data = selectedFile;
				result.isSuccessful = true;
				event.reply('selected-ssh-file-path', result);
			} catch (e: any) {
				result.error = [e.message];
				log.error('ssh key was unable to parse', e.message);
				result.isSuccessful = false;
				event.reply('selected-ssh-file-path', result);
			}
		}
	}

	async validateRepoService(path: string): Promise<returnStringResult> {
		const result: returnStringResult = {
			data: '',
			error: null,
			isSuccessful: false
		};
		try {
			await access(`${path}/.git`, fs.constants.F_OK);
			result.data = path;
			result.isSuccessful = true;
			result.error = null;
			return result;
		} catch (e) {
			result.isSuccessful = false;
			result.error = ['The selected folder either does not contain a .git folder or not accessible.'];
			log.error('The selected folder either does not contain a .git folder or not accessible.');
			return result;
		}
	}
}

export default DirectoryServices;
