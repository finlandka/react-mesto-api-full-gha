const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { validateAuth, validateRegister } = require('./middlewares/validate');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect(DB_URL, {});

app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
}));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.post('/signin', validateAuth, login);
app.post('/signup', validateRegister, createUser);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
