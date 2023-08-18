import {blogModel} from '../db/index.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class BlogService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(blogModel) {
		this.blogModel = blogModel;
	}

	async getBlogRankData() {
		try {
			return await this.blogModel.getBlogRankData()
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async blogRankData(req) {
		try {
			return await this.blogModel.blogRankData(req)
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getBlogs() {
		try {
			return await this.blogModel.getBlogs()
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getCheckBlogs() {
		try {
			return await this.blogModel.getCheckBlogs()
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getOptimizationBlogs() {
		try {
			return await this.blogModel.getOptimizationBlogs()
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getUsedBlogs() {
		try {
			return await this.blogModel.getUsedBlogs()
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getNumberBlogs() {
		try {
			return await this.blogModel.getNumberBlogs()
		} catch (e) {
			console.log(e);
		}
	}

	async getNumberBlogsText(){
		try {
			return await this.blogModel.getNumberBlogsText()
		} catch (e) {
			console.log(e);
		}
	}







	// 회원가입
	async addUser(userInfo) {
		// 객체 destructuring
		const { email, fullName, password, provider } = userInfo;

		// // 이메일 중복 확인
		// const user = await this.userModel.findByEmail(email);
		// if (user) {
		// 	throw new Error(
		// 		'이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
		// 	);
		// }

		// 이메일 중복은 이제 아니므로, 회원가입을 진행함

		// 우선 비밀번호 해쉬화(암호화)
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUserInfo = { fullName, email, password: hashedPassword, provider };
		console.log(newUserInfo)

		// db에 저장
		// return this.userModel.create(newUserInfo);
	}

	// 로그인
	async getUserToken(loginInfo) {
		// 객체 destructuring
		const { id, password } = loginInfo;

		// 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
		const user = await this.userModel.findByEmail(id);
		if (!user) {
			return { "status": 400, "result": "해당 아이디는 가입 내역이 없습니다. 다시 한 번 확인해 주세요." };
		}

		// 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

		// 비밀번호 일치 여부 확인
		const correctPasswordHash = user[0].password; // db에 저장되어 있는 암호화된 비밀번호

		// 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
		const isPasswordCorrect = await bcrypt.compare(
			password,
			correctPasswordHash,
		);

		if (!isPasswordCorrect) {
			return { "status": 400, "result": "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요." };
		}

		// 로그인 성공 -> JWT 웹 토큰 생성
		const secretKey = process.env.JWT_SECRET_KEY;
		console.log(secretKey);

		// 2개 프로퍼티를 jwt 토큰에 담음
		const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

		return { "status": 200, "result":token };
	}

}

const blogService = new BlogService(blogModel);

export { blogService };