import { Account, cloneRepoRequest, createRepoRequest, returnStringResult } from '../types/types';

export interface IGitServices {
	createRepository: (data: createRepoRequest) => Promise<returnStringResult>;
	cloneRepository: (data: cloneRepoRequest, callback: (n: number) => void) => Promise<returnStringResult>;
	setGitUserService: (repo: string, account: Account) => Promise<returnStringResult>;
}
