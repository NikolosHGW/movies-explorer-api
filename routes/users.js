const express = require('express');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { updateUser, getCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', cookieParser(), auth, getCurrentUser);

router.patch('/users/me', express.json(), cookieParser(), auth, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
