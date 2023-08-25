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
  const { token } = { token: getTokenFromHeaders(req.rawHeaders) };
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, '30f98350f2ad0003019dc146717794d9e2e63348f3147406ce0404d05e4c2665');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  return next();
};
