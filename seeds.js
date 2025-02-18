// // seeds.js
// const mongoose = require('mongoose');
// const Board = require('./models/Board');
// const Column = require('./models/Column');
// const Task = require('./models/Task');

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(async () => {
//     console.log('Connected to MongoDB');

//     // Clear existing data
//     await Board.deleteMany({});
//     await Column.deleteMany({});
//     await Task.deleteMany({});

//     // Create a board
//     const board = await Board.create({ title: 'Dragon List', columns: [] });

//     // Create default columns
//     const defaultColumnTitles = ['Backlog', 'Doing', 'Review', 'Done'];
//     const columns = [];
//     for (const title of defaultColumnTitles) {
//       const col = await Column.create({
//         title,
//         boardId: board._id,
//         tasks: []
//       });
//       columns.push(col);
//     }

//     // Update board with column references
//     board.columns = columns.map(c => c._id);
//     await board.save();

//     // Create a couple of tasks in "Backlog" column as an example.
//     const backlogColumn = columns.find(col => col.title === 'Backlog');
//     if (backlogColumn) {
//       const task1 = await Task.create({
//         title: 'Initial Task 1',
//         description: 'This is a seeded task.',
//         columnId: backlogColumn._id,
//         position: 0
//       });
//       const task2 = await Task.create({
//         title: 'Initial Task 2',
//         description: 'Another seeded task.',
//         columnId: backlogColumn._id,
//         position: 1
//       });
//       // Update the column with tasks
//       backlogColumn.tasks = [task1._id, task2._id];
//       await backlogColumn.save();
//     }

//     console.log('Seeding complete');
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error('Seed error:', err);
//     process.exit(1);
//   });
// backend/seed.js
const mongoose = require('mongoose');
const Board = require('./models/Board');
const Column = require('./models/Column');
const Task = require('./models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Board.deleteMany({});
    await Column.deleteMany({});
    await Task.deleteMany({});

    // Create a board
    const board = await Board.create({ title: 'Dragon List', columns: [] });

    // Create default columns and save their IDs
    const defaultColumnTitles = ['Backlog', 'Doing', 'Review', 'Done'];
    const columnIds = [];

    for (const title of defaultColumnTitles) {
      const col = await Column.create({
        title,
        boardId: board._id,
        tasks: []
      });
      columnIds.push(col._id);

      // For demonstration, add a sample task to the "Backlog" column only
      if (title === 'Backlog') {
        const task = await Task.create({
          title: 'Initial Task 1',
          description: 'This is a seeded task.',
          columnId: col._id,      // Use the actual column _id!
          position: 0
        });
        // Update column with task reference
        col.tasks.push(task._id);
        await col.save();
      }
    }

    // Update the board with the created column IDs
    board.columns = columnIds;
    await board.save();

    console.log('Seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
