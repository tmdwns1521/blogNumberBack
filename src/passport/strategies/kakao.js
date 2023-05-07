import { Strategy as KakaoStrategy } from 'passport-kakao';
import { userService } from '../../services';
import 'dotenv/config';

const config = {
	clientID: process.env.KAKAO_ID || 'KAKAO_ID', // clientId 설정하기
	callbackURL: '/auth/kakao/callback',
};

async function findOrCreateUser({ name, email }) {
	const user = await userService.findByEmail(email);
	if (user) {
		return user;
	}
	const created = await userService.addUser({
		fullName: name,
		email,
		password: 'KAKAO_OAUTH',
		provider: 'KAKAO',
	});

	return created;
}

const newKakaoStrategy = new KakaoStrategy(
	config,
	async (accessToken, refreshToken, profile, done) => {
		const email = profile._json && profile._json.kakao_account.email;
		const name = profile.displayName;
		try {
			// 여기서 유저를 생성 해야 함
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

export { newKakaoStrategy };
