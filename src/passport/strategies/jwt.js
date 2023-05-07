import JwtStrategy from 'passport-jwt'
import { Strategy } from 'passport-jwt';
import {secret} from '../../utils/jwt';

const cookieExtractor = (req) => {
  // req 의 cookies 에서 token 사용하기
  const { token } = req.cookies;
  return token;
};

const opts = {
  secretOrKey: secret,//./utils/jwt 의 secret 사용하기
  jwtFromRequest: cookieExtractor,
}

function newJwtStrategy() {
    new Strategy(opts, (user, done) => {
      done(null, user);
    })
};

export {newJwtStrategy};