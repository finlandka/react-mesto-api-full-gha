const users = require('express').Router();
const { validateUserId, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validate');

const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getCurrentUser);
users.get('/:userId', validateUserId, getUser);
users.patch('/me', validateUpdateUser, updateUser);
users.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = users;
