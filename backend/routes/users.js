const router = require('express').Router();

const {
  getUserByIdValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
} = require('../middlewares/celebrate');

const {
  getUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/me', getUser);
router.get('/', getUsers);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', updateUserProfileValidation, updateUser);
router.patch('/me/avatar', updateUserAvatarValidation, updateAvatar);

module.exports = router;
