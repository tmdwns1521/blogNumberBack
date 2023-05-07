import passport from 'passport';

function getUserFromJwt(req, res, next) {
  if (!req.cookies.token) {
    next();
    return;
  }

  return passport.authenticate('jwt', { session: false })(req, res, next);
}

export {getUserFromJwt};