import pkg from 'mongoose';
import {UserSchema} from '../schemas/user-schema.js';
import {mysqlRead, mysqlReadServer, mysqlWrite, mysqlWriteServer} from '../../config/database.js';

const { model } = pkg;

const User = model('users', UserSchema);

export class UserModel {
	async userState(id) {
		return await mysqlWriteServer.query('UPDATE user SET is_block = 0, is_use = 0 WHERE id = ?', id);
	}
	async userStatus() {
		return await mysqlReadServer.query('SELECT id, naverId, is_block, is_use FROM user');
	}
	async findByEmail(email) {
		const user = await mysqlRead.query('SELECT * FROM user WHERE email = ?', [email]);
		return user[0];
	}


}

const userModel = new UserModel();

export { userModel };