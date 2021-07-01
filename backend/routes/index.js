const router = require('express').Router();
const auth = require('../middlewares/auth');

const { login, createUser, signout } = require('../controllers/users');

const { createUserValidation, loginValidation } = require('../middlewares/celebrate');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use(auth);

router.delete('/signout', signout);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;
