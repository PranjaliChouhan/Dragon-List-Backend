// backend/routes/boards.js
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.createBoard);
router.get('/', boardController.getBoards);
router.get('/:id', boardController.getBoardById);
router.patch('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
