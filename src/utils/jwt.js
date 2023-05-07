import jwt from 'jsonwebtoken';
import 'dotenv/config';

const setUserToken = (res, user) => {
	const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

	// 2개 프로퍼티를 jwt 토큰에 담음
	const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

	// return { token };
	localStorage.setItem('token', token);
	// 유저 jwt 토큰생성
	// const token = jwt.sign(user, secretKey);
	// 토큰을 쿠키로 전달
	// res.cookie('token', token);
};

export { setUserToken };
