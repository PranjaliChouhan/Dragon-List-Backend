// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
// Put /update BEFORE /:id
router.patch('/move', taskController.updateTaskPosition);
router.patch('/update', taskController.updateTaskDetails);  // <-- define this first
router.patch('/:id', taskController.updateTask);            // <-- define this last


router.delete('/:id', taskController.deleteTask);


module.exports = router;
