const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_KEY } = require('../config.js');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({ data: user.omitPrivate() }))
      .catch((err) => res.status(500).send({ message: err }));
  }).catch(() => res.status(500).send({ message: 'Некоректнные данные' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCred(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
