const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//retrieve a blog
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
  response.json(blogs)
})

//create new blog
blogsRouter.post('/', async (request, response ) => {
  const body = request.body
  let token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //const user = await User.findById(body.userId)
  const user = await User.findById(decodedToken.id)

  // eslint-disable-next-line no-prototype-builtins
  if(body.hasOwnProperty('title') && body.hasOwnProperty('url')){
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      // eslint-disable-next-line no-prototype-builtins
      likes: (body.hasOwnProperty('likes') ? body.likes : 0),
      user: user._id
    })

    const savedBlog = await blog.save()
    //updated blogs property inside users
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  } else {
    response.status(400).end()
  }
})




//get a particular resource

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

//deleting a particular resource
blogsRouter.delete('/:id', async (request, response) => {
  let token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)
  //id received from the database is in object form, therefore needs to be changed to String for comparison
  if(user.id.toString() === blog.user.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'You are not authorized to delete this blog' })
  }
})


//update a particular resource

blogsRouter.put('/:id', async (request, response ) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    // eslint-disable-next-line no-prototype-builtins
    likes: (body.hasOwnProperty('likes') ? body.likes : 0)
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = blogsRouter