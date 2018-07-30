const _ = require("lodash");
mongoose = require("mongoose");
cardModel = require("./card.model");
listModel = require("../list/list.model");

exports.createCard = (req, res, next) => {
  const newCard = new cardModel({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    list: req.body.list,
    position: req.body.position
  });

  newCard
    .save()
    .then(card => {
      listModel
        .findByIdAndUpdate(card.list, { $push: { cards: card } }, { new: true })
        .then(list => {
          res.status(200).json(card);
        });
    })
    .catch(error => next(error));
};

exports.editCard = (req, res, next) => {
  const cardId = req.params.id;
  const updatedCard = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    list: req.body.list,
    position: req.body.position
  };

  cardModel
    .findByIdAndUpdate(cardId, updatedCard, { new: true })
    .then(card => {
      res.status(200).json(card);
    })
    .catch(error => next(error));
};

exports.transferCard = (req, res, next) => {
  const cardId = req.params.id;
  const listaFuente = req.body;
  const listaDestino = req.body;

  cardModel
    .findByIdAndUpdate(cardId, { $set: { list: listaDestino } }, { new: true })
    .then(card => {
      Promise.all([
        listModel
          .findByIdAndUpdate(listaFuente, { $pull: { cards: cardId } })
          .exec(),
        listModel
          .findByIdAndUpdate(listaDestino, { $push: { cards: cardId } })
          .exec()
      ]).then(list =>
        res
          .status(200)
          .json({ message: "card successfully updated", list: list })
      );
    })
    .catch(error => next(error));
};

exports.removeCard = (req, res, next) => {
  const cardId = req.params.id;
  cardModel
    .findByIdAndRemove(cardId)
    .then(response => {
      listModel
        .findOneAndUpdate(
          { cards: cardId },
          { $pull: { cards: cardId } },
          { new: true }
        )
        .then(list => {
          res.status(200).json({ message: "Card removed!" });
        });
    })
    .catch(error => next(error));
};

