import pkg from 'mongoose';
const { Schema } = pkg;

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			default: 'no_email',
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: false,
		},
		role: {
			type: String,
			required: false,
			default: 'basic-user',
		},
	},
	{
		collection: 'user',
		timestamps: true,
	},
);

export { UserSchema };