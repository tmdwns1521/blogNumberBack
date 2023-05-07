import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../../db';
const hashPassword = require('../../utils/hash-password');

const config = {
	usernameField: 'email',
	passwordField: 'password',
};

const local = new LocalStrategy(config, async (email, password, done) => {
	try {
		const user = await userModel.findByEmail({ email });
		if (!user) {
			throw new Error('회원을 찾을 수 없습니다.');
		}
		if (user.password !== hashPassword(password)) {
			throw new Error('비밀번호가 일치하지 않습니다.');
		}

		done(null, {
			email: user.email,
			fullName: user.fullName,
			passwordReset: user.passwordReset,
		});
	} catch (err) {
		done(err, null);
	}
});

export { local };
