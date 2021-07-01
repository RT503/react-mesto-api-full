const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const ExistingEmailError = require('../errors/existing-email-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const EmptyDatabaseError = require('../errors/empty-database-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new EmptyDatabaseError('В базе данных нет пользователей'))
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет пользователя с таким ID'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет пользователя с таким ID!'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email и пароль не должны быть пустыми');
  }
  User.findOne({ email })
    .then((existedUser) => {
      if (existedUser) {
        throw new ExistingEmailError('Пользователь с таким email уже существует');
      }

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((createdUser) => {
          if (!createdUser) {
            throw new BadRequestError('Переданы некорректные данные');
          }

          User.findOne({ email })
            .then((user) => res.send(user));
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (!name || !about) {
    throw new ValidationError('Заполните все поля!');
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true, upsert: true })
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    throw new ValidationError('Введены некорректные данные');
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true, upsert: true })
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((updatedAvatar) => res.send(updatedAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Не введены почта или пароль');
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expiresIn: (3600 * 24 * 7),
      }).send({ message: 'Аутентификация успешна!' });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  }).send({ message: 'Успешный выход' });
};
