const express = require('express');
const controller = require('./card.controller');

const router = express.Router();

router.post('/', controller.createCard);
router.put('/:id', controller.editCard);
router.put('transfer/:id', controller.transferCard);
router.delete('/:id', controller.removeCard);

module.exports = router;