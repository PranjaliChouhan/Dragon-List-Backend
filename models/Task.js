// backend/models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
    position: { type: Number, required: true, default: 0  },
    completion: { type: Number, default: 0 }, // Percentage completion (0 to 100)

    assignedTo: { type: String, default: '' }, // User assigned to the task
    hoursRemaining: { type: Number, default: 0 }, // Hours remaining for the task
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
