import path from 'path';
import { Sequelize } from 'sequelize';
import { app } from 'electron';
import fs from 'fs';
import log from '../main/log';


const userDataPath = app.getPath('userData');
const gitWindFolderPath = path.join(userDataPath, 'gitwind');
const dataFolderPath = path.join(gitWindFolderPath, 'data');

console.log('FPATH', dataFolderPath);

if (!fs.existsSync(dataFolderPath)) {
	fs.mkdirSync(dataFolderPath, { recursive: true });
}

const dbPath = path.join(dataFolderPath, 'myapp.db');

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: dbPath
});

export const initDB = () => {

	log.info('Database creation initiated');
	sequelize.sync({ force: false }).then(() => {
		log.info('Database and tables have been created (if they do not exist).');
	}).catch((error) => {
		log.error('Error syncing the database:', error);
	});
};


