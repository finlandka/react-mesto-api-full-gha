const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

function getTokenFromHeaders(rawHeaders) {
  let token = null;

  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i] === 'Authorization') {
      token = rawHeaders[i + 1];
      break;
    }
  }

  if (token) {
    [, token] = token.split(' ');
  }
  return token;
}

module.exports = (req, res, next) => {
  const { token } = req.cookies.token
    ? req.cookies
    : { token: getTokenFromHeaders(req.rawHeaders) };
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? '5b862e21cb7facfaa3fed4e2f99fbd84eb55eb4d4d7226db2754a056cc3aacc6' : JWT_SECRET);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  return next();
};
