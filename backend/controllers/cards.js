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
  const { name, link } = { ...req.body };
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;

  Card.findById({ _id: id })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        Card.findByIdAndDelete({ _id: id })
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
  const id = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
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
  const id = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }
      next(err);
    });
};
