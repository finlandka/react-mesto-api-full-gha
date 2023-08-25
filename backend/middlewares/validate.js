const { celebrate, Joi } = require('celebrate');

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(/[\w-]+@[\w-]*\.[a-z]*/),
    password: Joi.string().required(),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/([\w-]+\.)+([a-z])+(\/[\w\-.]*)*/),
    email: Joi.string().required().email().regex(/[\w-]+@[\w-]*\.[a-z]*/),
    password: Joi.string().required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/([a-z0-9-]+\.)+([a-z])+(\/[a-z0-9\-._]*)*/),
  }).unknown(true),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/([\w-]+\.)+([a-z])+(\/[\w\-.]*)*/),
  }).unknown(true),
});

module.exports = {
  validateAuth,
  validateRegister,
  validateCardId,
  validateCreateCard,
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
};
