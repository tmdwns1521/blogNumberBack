import { visitorModel } from '../db/index.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class VisitorService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(visitorModel) {
		this.visitorModel = visitorModel;
	}

	// 회원가입
	async visitorAdd(visitorInfo) {
		// 객체 destructuring

		// 이메일 중복 확인
		const visitor = await this.visitorModel.newVisitor(visitorInfo);

		return visitor;
	}
	async visitors(){
		const visitor = await this.visitorModel.Visitors();

		return visitor;
	}
}

const visitorService = new VisitorService(visitorModel);

export { visitorService };