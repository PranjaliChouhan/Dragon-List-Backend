// backend/controllers/taskController.js
const Task = require('../models/Task');
const Column = require('../models/Column');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, columnId } = req.body;
    const task = await Task.create({ title, description, columnId, position:0 });
    // Add task reference to the column
    await Column.findByIdAndUpdate(columnId, { $push: { tasks: task._id } });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
exports.updateTaskDetails = async (req, res, next) => {
  try {
    const { taskId, completion, assignedTo, hoursRemaining } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task details
    if (completion !== undefined) task.completion = completion;
    if (assignedTo!== undefined) task.assignedTo = assignedTo;
    if (hoursRemaining !== undefined) task.hoursRemaining = hoursRemaining;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    // Remove task from its column’s tasks array
    await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: task._id } });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Endpoint to update task position (when dragged & dropped)
exports.updateTaskPosition = async (req, res, next) => {
  try {
    const { taskId, newColumnId, newPosition } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    // Remove task from its current column
    await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: task._id } });
    // Update task properties
    task.columnId = newColumnId;
    task.position = newPosition;
    await task.save();
    // Add task to the new column
    await Column.findByIdAndUpdate(newColumnId, { $push: { tasks: task._id } });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
