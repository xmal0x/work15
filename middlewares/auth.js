const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const { JWT_KEY } = require('../config.js');
const AuthError = require('../errors/auth-err.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const app = express();
app.use(cookieParser());

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    const key = NODE_ENV === 'production' ? JWT_SECRET : JWT_KEY;

    payload = jwt.verify(cookie, key);
  } catch (error) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
