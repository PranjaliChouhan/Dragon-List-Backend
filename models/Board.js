// backend/models/Board.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
