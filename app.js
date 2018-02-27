const express = require('express');

const app = express();

// app.get('/', (req, res) => res.end('hello world'))

app.listen(3000, () => console.log('Listening on port 3000'))

app.set('views', 'views')
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('hello', { body: "asdf"}, (err, html) => {
  console.log(html);
  res.send(html);
}))