var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
const uuidv4 = require("uuid/v4")

db.serialize(function() {
  db.run(`CREATE TABLE todos (
      todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      completed INTEGER DEFAULT 0,
      id TEXT NULL
    )`
  );

  db.run(`INSERT INTO todos (description, id) VALUES ('Fake Todo Item', '${uuidv4()}')`);
});

module.exports = db