import pkg from 'mongoose';
const { Schema } = pkg;

const visitorSchema = new Schema(
	{
		ip: {
			type: String,
			required: false,
		},
		referrer: {
			type: String,
			required: false,
		},
		browser: {
			type: String,
			required: true,
		},
		os: {
			type: String,
			required: true,
		},
		kr_time: {
			type: String,
			required: false,
		},
	},
	{
		collection: 'visitor',
		timestamps: true,
	},
);

export { visitorSchema };
