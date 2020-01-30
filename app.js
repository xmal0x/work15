
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middlewares/auth.js');

const { login, createUser } = require('./controllers/users.js');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const badReq = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(badReq);


app.listen(PORT, () => {
  console.log(`App listen on ${PORT}`);
});
