const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() === owner) {
        Card.findByIdAndDelete(cardId)
          .then(() => res.status(200).send({ data: cardId }))
          .catch((err) => res.status(500).send({ message: err.message }));
      } else {
        return res.status(403).send({ message: 'У вас нет прав для удаления данной карточки' });
      }
    }).catch((err) => res.status(404).send({ message: err }));
};
