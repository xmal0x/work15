const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const { JWT_KEY } = require('../config.js');

const app = express();
app.use(cookieParser());

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(cookie, JWT_KEY);
  } catch (error) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
