import { Account, changeRepoRequest, cloneRepoRequest, createRepoRequest } from '../types/types';
import path from 'path';
import { createGitUserService, deleteUserService, getAllGitUsersService } from '../services/gitUserServices';
import GitServices from '../services/GitServices';
import DirectoryServices from '../services/DirectoryServices';
import { IGitServices } from '../services/IGitServices';
import { IDirectoryServices } from '../services/IDirectoryServices';
import { Channels } from './channels';
import { ipcMainOn, reply } from './util';
import { autoUpdater } from 'electron-updater';
const gitServices: IGitServices = new GitServices();
const dirServices: IDirectoryServices = new DirectoryServices();


interface InitIPCRemoveListeners {
	removeListener: (channel: string, listener: (...args: any[]) => void) => Electron.IpcMain;
	removeAllListeners: (channel?: string | undefined) => Electron.IpcMain;
	channel: Channels
}

export const initIPCListeners = (): InitIPCRemoveListeners [] => {

	let removeListeners: InitIPCRemoveListeners[] = [];

	removeListeners.push(
		ipcMainOn('on-click-browse', async (event, validationRequired: boolean) => {
			await dirServices.browseRepoDirectoryService(event, validationRequired);
		})
	);

	removeListeners.push(
		ipcMainOn('on-click-browse-file', async (event) => {
			await dirServices.browseSSHFileService(event);
		})
	);

	removeListeners.push(
		ipcMainOn('save-user', (event, user: Account) => {
			createGitUserService(user).then((value) => {
				reply(event, 'save-user-response', value);
			});
		})
	);

	removeListeners.push(
		ipcMainOn('all-users', (event) => {
			getAllGitUsersService().then((value) => {
				reply(event, 'all-users-response', value);
			});
		})
	);

	removeListeners.push(
		ipcMainOn('delete-user', (event, id: number) => {
			deleteUserService(id).then((res) => {
				reply(event, 'delete-user-response', res);
			});
		})
	);

	removeListeners.push(
		ipcMainOn('on-save-user-repo', async (event, data: changeRepoRequest) => {
			const repoPath = path.normalize(data.repoPath);
			const pathValidationResult = await dirServices.validateRepoService(repoPath);
			if (pathValidationResult.isSuccessful) {
				const result = await gitServices.setGitUserService(repoPath, data);
				reply(event, 'on-save-user-repo-response', result);
			} else {
				reply(event, 'on-save-user-repo-response', pathValidationResult);
			}
		})
	);

	removeListeners.push(
		ipcMainOn('on-clone', async (event, data: cloneRepoRequest) => {
			gitServices.cloneRepository(data, (n) => {
				reply(event, 'clone-progress', n);
			}).then((result) => {
				reply(event, 'clone-response', result);
			});
		})
	);

	removeListeners.push(
		ipcMainOn('init-repo', async (event, data: createRepoRequest) => {
			gitServices.createRepository(data).then((resp) => {
				reply(event, 'init-repo-response', resp);
			});
		})
	);

	removeListeners.push(
		ipcMainOn('download-update', ()=>{
			autoUpdater.downloadUpdate();
		})
	);

	removeListeners.push(
		ipcMainOn('install-update', ()=>{
			autoUpdater.autoRunAppAfterInstall = true;
			autoUpdater.quitAndInstall();
		})
	)

	return removeListeners;
};
