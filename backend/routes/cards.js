const router = require('express').Router();

const {
  createCardValidation,
  deleteCardValidation,
  changeCardLikeStatus,
} = require('../middlewares/celebrate');

const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCardValidation, postCard);
router.delete('/:cardId', deleteCardValidation, deleteCard);
router.put('/:cardId/likes', changeCardLikeStatus, putLike);
router.delete('/:cardId/likes', changeCardLikeStatus, removeLike);

module.exports = router;
