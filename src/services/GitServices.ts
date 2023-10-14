import { IGitServices } from './IGitServices';
import { GitError, simpleGit, SimpleGit, SimpleGitProgressEvent } from 'simple-git';
import { Account, cloneRepoRequest, createRepoRequest, returnStringResult } from '../types/types';
import fs from 'fs';
import { promisify } from 'util';
import { quote } from 'shell-quote';
import { getUser } from '../data/data_access_layer/gitUserRepository';
import log from '../main/log';

const access = promisify(fs.access);

class GitServices implements IGitServices {
	async createRepository(data: createRepoRequest) {
		let result: returnStringResult = { data: '', error: [], isSuccessful: false };

		try {
			const gitInstance: SimpleGit = simpleGit(data.repoPath);
			await gitInstance.init((err, data) => {
				if (err) {
					throw err;
				}
				log.info('Repo successfully created', JSON.stringify(data));
			});

			await this.setGitUserService(data.repoPath, data, data.sshFilePath);

			result.isSuccessful = true;
			result.data = 'Repo successfully created';
			return result;
		} catch (error: any) {
			result.isSuccessful = false;
			result.error = [error.message];
			log.error(error.message);
			return result;
		}
	}

	async cloneRepository(data: cloneRepoRequest, callback: (n: number) => void) {
		let result: returnStringResult = { data: '', error: [], isSuccessful: false };
		let cloningResult;

		try {
			const gitInstance: SimpleGit = this.createInstanceForCloning(callback);
			const sshCommand = await this.getSshCommand(data);
			let cloneOptions: string[] = this.getCloneOptions(data);

			await gitInstance.env('GIT_SSH_COMMAND', sshCommand)
				.clone(data.url, quote([data.repoPath]), cloneOptions, (err: GitError | null, data: string) => {
					if (err) {
						console.error('Error cloning repo', err.message);
						throw err;
					}
					cloningResult = data;
				});

			await this.setGitUserService(data.repoPath, { ...data }, sshCommand);

			result.isSuccessful = true;
			result.data = 'Cloning completed successfully';
			log.info('Cloning completed successfully', cloningResult);
			return result;
		} catch (e: any) {
			result.isSuccessful = false;
			result.error = [e.message];
			if (e.message.includes('fatal:')) {
				result.error = [e.message.split('fatal:')[1]];
			}
			log.error('Unable to complete clone: ',e.message);
			return result;
		}
	}


	async setGitUserService(repo: string, account: Account, sshCommand?: string): Promise<returnStringResult> {
		const result: returnStringResult = {
			data: '',
			error: null,
			isSuccessful: false
		};

		const quotedRepo = quote([repo]);
		const quotedUsername = quote([account.username]);
		let sshCmd = '';
		if (!sshCommand) {
			sshCmd = await this.getSshCommand(account);
		} else {
			sshCmd = sshCommand;
		}

		try {
			await this.setGitUserEmail(quotedRepo, account.email);
			await this.setGitUserName(quotedRepo, quotedUsername);
			await this.setGitSshCommand(quotedRepo, sshCmd);
			log.info('Git account added successfully');
			result.isSuccessful = true;
			result.error = null;
			result.data = `Repo user changed to ${quotedUsername}`;

		} catch (e: any) {
			console.error(e.message);
			result.isSuccessful = false;
			result.error = [e.message || 'Something went wrong'];
			log.error('Repo user was unable to change: ',e.message);
			result.data = '';
		}
		return result;
	}

	async setGitUserEmail(repo: string, email: string): Promise<void> {
		try {
			const quotedRepo = quote([repo]);
			const git = simpleGit(quotedRepo);
			await git.addConfig('user.email', email);
			log.info('Successfully added user.email');
		} catch (e: any) {
			log.error('Error adding user.email: ', e.message);
		}
	}

	async setGitUserName(repo: string, username: string): Promise<void> {
		try {
			const quotedRepo = quote([repo]);
			const quotedUsername = quote([username]);
			const git = simpleGit(quotedRepo);
			await git.addConfig('user.name', quotedUsername);
			log.info('Successfully added user.name')
		} catch (e: any) {
			log.error('Unable to add user.name', e.message)
		}
	}

	async setGitSshCommand(repo: string, sshCommand: string) {
		try {
			const git = simpleGit(quote([repo]));
			await git.addConfig('core.sshCommand', sshCommand);
			log.info('Successfully added ssh command');
		} catch (e: any) {
			console.error(e.message);
			log.info('Unable to add ssh command: ', e.message);
		}
	}

	createInstanceForCloning(callback: (n: number) => void) {
		return simpleGit({
			binary: 'git',
			progress(progressData: SimpleGitProgressEvent): void {
				callback(progressData.progress / 100);
			}
		});
	}

	async getSshCommand(data: Account) {
		if (data.id) {
			const user = await getUser(data.id);
			if (user) {
				return quote(['ssh', '-i', user.sshFilePath]);
			} else {
				throw new Error('User not exist');
			}
		} else {
			throw new Error('Something went wrong');
		}
	}

	getCloneOptions(data: cloneRepoRequest) {
		if (data.branch) {
			return ['--branch', quote([data.branch])];
		}
		return [];
	}

}

export default GitServices;
