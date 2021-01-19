const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//retrieve a blog
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

//create new blog
blogsRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)

    blog
       .save()
       .then(result => {
           response.status(201).json(result)
       })
})


//get a particular resource 
    /*  
    blogsRouter.get('/:id', (request, response, next) => {
        Blog.findById(request.params.id)
            .then(blog => {
                if (blog) {
                    response.json(blog)
                } else {
                    response.status(404).end()
                }
            })
            .catch(error => next(error))
    })
*/


//deleting a particular resource
/*
    blogsRouter.delete('/:id', (request, response, next) => {
        Blog.findByIdAndRemove(request.params.id)
            .then(() => {
                response.status(204).end()
            })
            .catch(error => next(error))
    })
*/

//update a particular resource
/*
    blogsRouter.put('/:id', (request, response, next) => {
        const body = request.body

        const blog = {
            
        }

        Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
    })
*/

module.exports = blogsRouter