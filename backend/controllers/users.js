const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { OK, CREATED } = require('../constantsStatus');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден. Не существующий _id'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден. Не существующий _id'))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      const user = newUser.toObject();
      delete user.password;
      res.status(CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '30f98350f2ad0003019dc146717794d9e2e63348f3147406ce0404d05e4c2665', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        domain: '.voloh.nomoredomainsicu.ru',
      }).send({ token });
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => next(err));
};

module.exports = {
  getUsers, getUser, getCurrentUser, createUser, login, updateUser, updateAvatar,
};
