import passport from 'passport';

import { local } from './strategies/local';
import { newJwtStrategy as jwt } from './strategies/jwt';
import { newGoogleStrategy as google } from './strategies/google';
import { newKakaoStrategy as kakao } from './strategies/kakao';

const passportIndex = () => {
	passport.use(local);
	// jwt strategy 사용
	passport.use(jwt);
	passport.use(google);
	passport.use(kakao);
};

export { passportIndex };
