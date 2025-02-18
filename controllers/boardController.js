// backend/controllers/boardController.js
const Board = require('../models/Board');
const Column = require('../models/Column');



exports.createBoard = async (req, res, next) => {
  try {
    const { title } = req.body;

    // 1. Create the board
    const board = new Board({ title ,columns: [] });
    await board.save();

    // 2. Create default columns
    const defaultColumnTitles = ['Backlog', 'Doing', 'Review', 'Done'];
    const columnIds = [];

    for (const colTitle of defaultColumnTitles) {
      const column = await Column.create({
        title: colTitle,
        boardId: board._id,
        tasks: []
      });
      columnIds.push(column._id);
    }

    // 3. Assign columns to the board
    board.columns = columnIds;
    await board.save();

    return res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};


exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find().populate({
      path: 'columns',
      populate: { path: 'tasks' }
    });
    res.status(200).json(boards);
  } catch (error) {
    next(error);
  }
};

exports.getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'columns',
        populate: { path: 'tasks' }
      });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    // Optionally: remove associated columns and tasks here.
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    next(error);
  }
};
