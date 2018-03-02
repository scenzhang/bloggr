require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
//parse forms
const bodyParser = require('body-parser');
//generate ids for new posts to write in file
const uuid = require('uuid/v1');
//put and delete for forms
const methodOverride = require('method-override');
const mongoose = require('mongoose')

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

console.log(process.env)
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));

app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'static')));
let Blog, blogSchema;
app.use(methodOverride('_method'));
mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
db.on('error', (e) => console.log(err));
db.once('open', () => {
  blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    updated: Date,
    created: Date
  })
  Blog = mongoose.model('Blog', blogSchema);
});



app.get('/hello', (req, res) => res.render('hello'));
app.get('/', (req, res) => {

  Blog && Blog.find((err, blogCollection) => { //wait until db connected before loading index to avoid console error
    if (err) {
      res.status(404).end('something went wrong');
    } else {
      res.render('index', {
        blogs: blogCollection
      });
    }
  })
});

app.get('/new', (req, res) => {
  console.log("new");
  res.render('new');
});

app.get('/:id', (req, res) => {

  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.status(404).end('Blog not found');
    } else {
      res.render('show', {
        blog
      });
    }
  })
});



app.post('/', urlencodedParser, (req, res) => {


  Blog.create({
      author: req.body.author || 'anon',
      title: req.body.title || 'blog title',
      body: req.body.blog_body || 'blog body',
      updatedAt: Date.now(),
      createdAt: Date.now()
    },
    (err, blog) => {
      if (err) {
        res.status(404).end('something went wrong');
      } else {
        res.redirect(303, '/');
      }
    }
  )
  // res.redirect('/');
});

app.get('/:blogId/edit', (req, res) => {
  const blogId = req.params.blogId;


  Blog.findById(blogId, (err, blog) => {
    if (err) {
      res.status(404).end('Blog not found');
    } else {
      res.render('edit', {
        blog
      });
    }
  })
});

app.delete('/:blogId', (req, res) => {
  const blogId = req.params.blogId
  
  Blog.deleteOne({
    _id: blogId
  }, () => {
    res.redirect(303, '/');
  });
  // res.redirect('/');
});

app.put('/:blogId', urlencodedParser, (req, res) => {
  const blogId = req.params.blogId;
  const {
    author,
    title,
    blog_body: body
  } = req.body
  Blog.findByIdAndUpdate(
    blogId, {
      author,
      title,
      body,
      updatedAt: Date.now()
    },
    err => {
      if (err) {
        res.status(404).end('Blog not found');
      } else {
        res.redirect(303, `/${blogId}`);
      }
    }
  );
});