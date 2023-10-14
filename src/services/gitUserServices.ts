import { Account, getAllUsersResult, returnStringResult, UserResult } from '../types/types';
import { ValidationError } from 'sequelize';
import { createGitUser, deleteUser, getAllGitUsers, getUser } from '../data/data_access_layer/gitUserRepository';
import log from '../main/log';

export const createGitUserService = async (user: Account): Promise<UserResult> => {
	let result: UserResult = {
		data: null,
		isSuccessful: false,
		error: null
	};

	try {
		let pathNormalized = '';
		if (user.sshFilePath) {
			pathNormalized = user.sshFilePath;
		}
		user.sshFilePath = pathNormalized;
		let createdUser = await createGitUser(user);
		log.info('User created successfully', user);
		result.isSuccessful = true;
		result.data = createdUser.toJSON();
		result.error = null;
		return result;
	} catch (error: any) {
		result.isSuccessful = false;
		if (error instanceof ValidationError) {
			result.error = [...error.errors].map(x => x.message);
		} else {
			result.error = [error.message];
		}
		log.error('Error creating user: ',...result.error);
	}
	return result;
};

export const getAllGitUsersService = async (): Promise<getAllUsersResult> => {
	let gitUsersResult: getAllUsersResult = {
		data: null,
		isSuccessful: false,
		error: null
	};
	try {
		const allUsers = await getAllGitUsers();
		gitUsersResult.data = allUsers.map((x) => x.toJSON());
		gitUsersResult.isSuccessful = true;
		log.info('Successfully fetched users list');
	} catch (error: any) {
		gitUsersResult.error = error.message;
		log.error('Error fetching users list: ',error);
	}
	return gitUsersResult;
};

export const getUserService = async (id: number): Promise<UserResult> => {
	let result: UserResult = {
		data: null,
		error: [],
		isSuccessful: false
	};

	try {
		let user = await getUser(id);
		if (user) {
			result.data = user;
			result.isSuccessful = true;
		} else {
			result.isSuccessful = false;
			result.error = ['Something went wrong'];
		}
	} catch (e: any) {
		result.error = [e.message];
		result.isSuccessful = false;
	}
	return result;
};

export const deleteUserService = async (id: number): Promise<returnStringResult> => {
	let deleteUserResult: returnStringResult = {
		data: '',
		isSuccessful: false,
		error: null
	};

	try {
		let deletedGitUser = await deleteUser(id);

		if (deletedGitUser) {
			deleteUserResult.data = 'User deleted successfully';
			deleteUserResult.isSuccessful = true;
			log.info('User deleted successfully');
		} else {
			deleteUserResult.data = 'Something went wrong';
			deleteUserResult.isSuccessful = false;
			log.error('User not exist or user id is wrong')
		}
	} catch (e: any) {
		deleteUserResult.data = e.message;
		deleteUserResult.isSuccessful = false;
		log.error(e.message);
	}

	return deleteUserResult;
};
