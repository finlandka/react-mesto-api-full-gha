const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const { OK, CREATED } = require('../constantsStatus');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link, owner: req.user,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена. Не существующий id'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card.deleteOne(card)
        .then((deletedCard) => {
          res.status(OK).send({ data: deletedCard });
        });
    })
    .catch((err) => next(err));
};

const addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => next(err));
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => next(err));
};

module.exports = {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
};
