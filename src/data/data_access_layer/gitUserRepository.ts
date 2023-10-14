import GitUser from '../models/GitUser';
import { Account } from '../../types/types';

export const createGitUser = async (user: Account): Promise<GitUser> => {
	return await GitUser.create({ ...user });
};

export const getAllGitUsers = async (): Promise<GitUser[]> => {
	return await GitUser.findAll();
};

export const getUser = async (id: number): Promise<GitUser | null> => {
	return await GitUser.findOne({
		where: {
			id: id
		}
	});
};

export const deleteUser = async (id: number): Promise<number> => {
	return await GitUser.destroy({
		where: {
			id: id
		}
	});
};


