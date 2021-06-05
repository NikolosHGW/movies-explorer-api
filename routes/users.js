const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, getCurrentUser, login, createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', cookieParser(), auth, getCurrentUser);

router.patch('/users/me', express.json(), cookieParser(), auth, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

module.exports = router;
