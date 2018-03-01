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

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.listen(3000, () => console.log('Listening on port 3000'));

app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'static')));

app.use(methodOverride('_method'));



app.get('/hello', (req, res) => res.render('hello'));
app.get('/', (req, res) => {
  const blogFile = fs.readFileSync('./seeds/blogs.json', 'utf-8')
  const blogArray = JSON.parse(blogFile)
  const blogs = {}
  blogArray.forEach((blog) => {
    blogs[blog._id] = blog;
  });

  res.render('index', {
    blogs: blogArray
  });

});

app.get('/:id', (req, res) => {
  const blogFile = fs.readFileSync('./seeds/blogs.json', 'utf-8')
  const blogArray = JSON.parse(blogFile)
  const blogs = {}
  blogArray.forEach((blog) => {
    blogs[blog._id] = blog;
  });

  res.render('show', {
    blog: blogs[req.params.id]
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/', urlencodedParser, (req, res) => {
  const blogFile = fs.readFileSync('./seeds/blogs.json', 'utf-8')
  const blogArray = JSON.parse(blogFile)

  
  const newBlog = {
    author: req.body.author || 'anon',
    title: req.body.title || 'BLOG TITLE',
    _id: uuid(),
    body: req.body.blog_body || 'Just blog things',
    updatedAt: Date.now(),
    createdAt: Date.now()
  };
  blogArray.push(newBlog);
  fs.writeFileSync('./seeds/blogs.json', JSON.stringify(blogArray, null, 2));
  res.redirect('/');
});

app.get('/:blogId/edit', (req, res) => {
  const blogId = req.params.blogId;
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'));
  let blog;
  for (let i = 0; i < blogArray.length; i++) {
    if (blogArray[i]._id === blogId) {
      blog = blogArray[i];
      break;
    }
  }
  if (blog !== undefined) {
    res.render('edit', {
      blog
    });
  } else {
    res.status(404).end('Blog Not Found');
  }
});

app.delete('/:blogId', (req, res) => {
  const blogId = req.params.blogId
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  const newBlogArray = blogArray.filter(b => b._id !== blogId)

  fs.writeFileSync('./seeds/blogs.json', JSON.stringify(newBlogArray, null, 2))
  res.redirect('/');
});

app.put('/:blogId', urlencodedParser, (req, res) => {
  const blogId = req.params.blogId;
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'));
  let blog, blogIdx;
  for (let i = 0; i < blogArray.length; i++) {
    if (blogArray[i]._id === blogId) {
      blog = blogArray[i];
      blogIdx = i;
      break;
    }
  }
  if (blog !== undefined) {
    const {
      author,
      title,
      blog_body: body
    } = req.body;
    const updatedBlog = Object.assign({}, blog, {
      author,
      title,
      body,
      updatedAt: Date.now()
    });
    blogArray[blogIdx] = updatedBlog;
    fs.writeFileSync('./seeds/blogs.json', JSON.stringify(blogArray, null, 2));
    res.redirect(`/${blogId}`);
  } else {
    res.status(404).end('Blog Not Found');
  }
});