const cards = require('express').Router();
const { validateCardId, validateCreateCard } = require('../middlewares/validate');
const {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', validateCreateCard, createCard);
cards.delete('/:cardId', validateCardId, deleteCard);
cards.put('/:cardId/likes', validateCardId, addLikeCard);
cards.delete('/:cardId/likes', validateCardId, deleteLikeCard);

module.exports = cards;
