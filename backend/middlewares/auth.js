const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
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
