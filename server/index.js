const express = require("express");
const db = require('../database.js')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/data', (req, res) => {
  db.all('select * from todos', (err, rows) => {
    res.json({
      message: 'success',
      data: rows
    })
  })
})

app.post('/data', (req, res) => {
  req.body.forEach(todo => {
    db.exec(`
      insert into todos(description, completed, id)
      select '${todo.description}', ${todo.completed}, '${todo.id}'
      where not exists (select 1 from todos where id = '${todo.id}')
    `)
    db.exec(`
      update todos
        set description = '${todo.description}',
            completed = ${todo.completed}
        where id = '${todo.id}'
    `)
  })
  res.json({message: 'success'})
})

app.post('/delete', (req, res) => {
  db.exec(`
    delete from todos
    where id = '${req.body.id}'
  `)
  res.json({message: 'success'})
})

app.post('/bulkDelete', (req, res) => {
  db.exec(`
    delete from todos
    where completed = 1
  `)
  res.json({message: 'success'})
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
