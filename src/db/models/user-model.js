import pkg from 'mongoose';
const { model } = pkg;
import { UserSchema } from '../schemas/user-schema.js';

const User = model('users', UserSchema);

export class UserModel {
	async findByEmail(email) {
		const user = await User.findOne({ email });
		return user;
	}

	async findById(userId) {
		const user = await User.findOne({ _id: userId });
		return user;
	}

	async create(userInfo) {
		const createdNewUser = await User.create(userInfo);
		return createdNewUser;
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