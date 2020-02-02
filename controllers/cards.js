const Card = require('../models/card');
const RequestError = require('../errors/request-err.js');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() === owner) {
        Card.findByIdAndDelete(cardId)
          .then(() => res.status(200).send({ data: cardId }));
      } else {
        throw new RequestError('У вас нет прав для удаления данной карточки');
      }
    }).catch(next);
};
