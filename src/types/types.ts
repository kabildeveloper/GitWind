import GitUser from '../data/models/GitUser';

export interface Account {
	id?: number;
	username: string;
	email: string;
	sshFilePath: string;
}

export interface ChangeRepoUser extends Account {
	repo: string;
}

export interface ResponseStatus {
	message: string | string[];
	success: boolean;
}

export interface AlertModalData extends ResponseStatus {
	isOpened: boolean;
}

export interface returnDataType {
	isSuccessful: boolean;
	error: string [] | null;
	data: any;
}

export interface UserResult extends returnDataType {
	data: GitUser | null;
}

export interface getAllUsersResult extends returnDataType {
	data: Account[] | null;
}

export interface returnStringResult extends returnDataType {
	data: string;
}

export interface changeRepoRequest extends Account {
	repoPath: string;
}

export interface cloneRepoRequest extends changeRepoRequest {
	branch: string;
	url: string;
}

export interface createRepoRequest extends Account {
	repoPath: string;
}
