// backend/controllers/columnController.js
const Column = require('../models/Column');
const Board = require('../models/Board');

exports.createColumn = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    const column = await Column.create({ title, boardId, tasks: [] });
    // Add column reference to the board
    await Board.findByIdAndUpdate(boardId, { $push: { columns: column._id } });
    res.status(201).json(column);
  } catch (error) {
    next(error);
  }
};

exports.getColumns = async (req, res, next) => {
  try {
    const columns = await Column.find().populate('tasks');
    res.status(200).json(columns);
  } catch (error) {
    next(error);
  }
};

exports.getColumnById = async (req, res, next) => {
  try {
    const column = await Column.findById(req.params.id).populate('tasks');
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    next(error);
  }
};

exports.updateColumn = async (req, res, next) => {
  try {
    const column = await Column.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    next(error);
  }
};

exports.deleteColumn = async (req, res, next) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    // Optionally: remove column from board and delete associated tasks.
    res.status(200).json({ message: 'Column deleted successfully' });
  } catch (error) {
    next(error);
  }
};
