import crypto from 'crypto';

function passwordGetHash(password){
  const hash = crypto.createHash('sha1');
  hash.update(password);
  return hash.digest("hex");
}

export {passwordGetHash};