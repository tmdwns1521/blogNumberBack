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

	async findById(userId) {
		const user = await User.findOne({ _id: userId });
		return user;
	}

	async create(userInfo) {
		const { email, fullName, password, provider } = userInfo;
		const result = await mysqlWrite.query('')
		return await User.create(userInfo);
	}

	async findAll() {
		const users = await User.find({});
		return users;
	}

	async update({ userId, update }) {
		const filter = { _id: userId };
		const option = { returnOriginal: false };

		const updatedUser = await User.findOneAndUpdate(filter, update, option);
		return updatedUser;
	}

	async updateByEmail({ email, update }) {
		const filter = { email };
		const option = { returnOriginal: false };

		const updatedUser = await User.findOneAndUpdate(filter, update, option);
		return updatedUser;
	}

	async delete(userId) {
		await User.deleteOne({ _id: userId });
		return;
	}
}

const userModel = new UserModel();

export { userModel };