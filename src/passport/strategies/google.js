import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userService } from '../../services';
import 'dotenv/config';

const config = {
	clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID', // clientId 설정하기
	clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET', // clientSecret 설정하기
	callbackURL: '/auth/google/callback',
};

async function findOrCreateUser({ name, email }) {
	const user = await userService.findByEmail(email);
	if (user) {
		return user;
	}
	const created = await userService.addUser({
		fullName: name,
		email,
		password: 'GOOGLE_OAUTH',
		provider: 'GOOGLE',
	});

	return created;
}

const newGoogleStrategy = new GoogleStrategy(
	config,
	async (accessToken, refreshToken, profile, done) => {
		const { email, name } = profile._json;
		try {
			// 여기서 유저를 생성해주긴 해야 함
			const user = await findOrCreateUser({ name, email });
			done(null, {
				_id: user._id,
				email: user.email,
				name: user.fullName,
				role: user.role,
			});
		} catch (e) {
			done(e, null);
		}
	},
);

export { newGoogleStrategy };
