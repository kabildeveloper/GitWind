import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';
import { Account } from '../../types/types';

class GitUser extends Model implements Account {
	public username!: string;
	public email!: string;
	public sshFilePath!: string;
}

GitUser.init({
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		sshFilePath: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true
		}
	},
	{
		sequelize: sequelize,
		modelName: 'GitUser'
	}
);

export default GitUser;
