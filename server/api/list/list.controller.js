const listModel = require('./list.model');
const cardModel = require('../card/card.model');

exports.getLists = function(req, res, next) {
  listModel.find({})
  .populate('cards')
  .then(lists => res.status(200).json(lists))
  .catch(error => next(error))
}

exports.createList = function(req, res, next) {
  const newList = new listModel({
	  title: req.body.title,
    position: req.body.position
  });
  newList.save()
  .then(list => res.status(200).json(list))
  .catch(error => next(error))
}

exports.editList = function(req, res, next) {
  const listId = req.params.id;
    const updatedList = req.body;
    listModel.findByIdAndUpdate(listId, updatedList, { new: true })
    .then(list => {
        if(list) res.status(200).json(list)
        else res.status(404).json({ message: 'list not found'})
    })
    .catch(error => next(error))
}

exports.removeList = function(req, res, next) {
  const listId = req.params.id;
  listModel.findByIdAndRemove(listId)
  .then(list => {
    const promisesArray = []
    list.cards.forEach(element => {
      promisesArray.push(cardModel.findByIdAndRemove(element).exec())
    });
    Promise.all(promisesArray)
    .then(() => res.status(200).json({message: 'cards removed'}))
    res.status(200).json({message: 'list removed'})
  })
  .catch(error => next(error))
}

