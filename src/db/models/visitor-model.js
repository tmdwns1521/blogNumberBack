import pkg from 'mongoose';
const { model } = pkg;
import { visitorSchema } from '../schemas/visitor-schema.js';
import moment from 'moment';
import 'moment-timezone';
moment.tz.setDefault("Asia/Seoul");

const Visitor = model('visitor', visitorSchema);

export class VisitorModel {
	async newVisitor(visitorInfo) {
		const kr_curr = moment().format('YYYY-MM-DD HH:mm:ss')
		visitorInfo = {
			...visitorInfo,
			kr_time : kr_curr
		}
		const newVisitor = await Visitor.create(visitorInfo);
		return newVisitor;
	}

	async findById(userId) {
		const user = await Visitor.findOne({ _id: userId });
		return user;
	}
	async Visitors(){
		const visitors = await Visitor.find({})
		return visitors;
	}
}

const visitorModel = new VisitorModel();

export { visitorModel };