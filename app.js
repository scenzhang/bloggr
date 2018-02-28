const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')
// app.get('/', (req, res) => res.end('hello world'))

app.listen(3000, () => console.log('Listening on port 3000'))

app.set('views', 'views')
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'static')));

const blogFile = fs.readFileSync('./seeds/blogs.json', 'utf-8')
const blogArray = JSON.parse(blogFile)
const blogs = {}
blogArray.forEach((blog) => {
  blogs[blog._id] = blog;
});

app.get('/hello', (req, res) => res.render('hello'))
app.get('/', (req, res) =>
  res.render('index', {
    blogs: blogArray
  })
)

app.get('/blogs/:id', (req, res) => {
  res.render('show', {
    blog: blogs[req.params.id]
  })
})

app.get('/new', (req, res) => {
  res.render('new');
})