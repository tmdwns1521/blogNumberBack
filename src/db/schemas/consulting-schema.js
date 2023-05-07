import pkg from 'mongoose';
const { Schema } = pkg;

const consultingSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		car: {
			type: String,
			required: true,
		},
		selects: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: false,
		},
		city: {
			type: String,
			required: false,
		},
		kr_time: {
			type: String,
			required: true,
		},
	},
	{
		collection: 'consulting',
		timestamps: true,
	},
);

export { consultingSchema };
