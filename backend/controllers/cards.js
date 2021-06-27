const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');
const EmptyDatabaseError = require('../errors/empty-database-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(new EmptyDatabaseError('В базе данных нет карточек'))
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.findByIdAndDelete(req.params.cardId)
          .then(() => res.send({ message: 'Успешно удалена!' }));
      }
      throw new ForbiddenError('Недостаточно прав');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }
      next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }
      next(err);
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }
      next(err);
    });
};
