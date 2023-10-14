import { IpcMainEvent } from 'electron';
import { returnStringResult } from '../types/types';

export interface IDirectoryServices {
	browseRepoDirectoryService: (event: IpcMainEvent, validationRequired: boolean) => Promise<void>;
	browseSSHFileService: (event: IpcMainEvent) => Promise<void>;
	validateRepoService: (path: string) => Promise<returnStringResult>;
}
