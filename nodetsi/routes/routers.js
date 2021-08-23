const express = require('express');
const router = express.Router();
const Auth = require('../src/middlleware/middleware');
const AuthValidator = require('../src/validators/authvalidator');
const UserValidator = require('../src/validators/UserValidator');

const AuthController = require('../src/controller/AuthController');
const UserController = require('../src/controller/UserController');
const AdsController = require('../src/controller/AdsController');

router.get('/ping', (req, res) => {
    res.json({ pong: true });
});

router.get('/states', UserController.getStates);

router.post('/user/singin', AuthValidator.signin, AuthController.signin);
router.post('/user/singup', AuthValidator.signup, AuthController.signup);

router.get('/user/me', Auth.private, UserController.info);
router.put('/user/me', UserValidator.editAction, Auth.private, UserController.editAction);

router.get('/categories', AdsController.geCategories);

router.post('/ad/add', AdsController.addAction);
router.get('/ad/list', AdsController.getList);
router.get('/ad/item', AdsController.getItem);
router.put('/ad/:id', AdsController.editAction);

module.exports = router;