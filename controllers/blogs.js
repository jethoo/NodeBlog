const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//retrieve a blog
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

//create new blog
blogsRouter.post('/', async (request, response ) => {
    const body = request.body
    if(body.hasOwnProperty('title') && body.hasOwnProperty('url')){
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: (body.hasOwnProperty('likes') ? body.likes : 0)
        })
        
        const savedBlog = await blog.save()
        response.json(savedBlog)
    } else {
        response.status(400).end()
    }
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

    blogsRouter.delete('/:id', async (request, response) => {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    })


//update a particular resource

    blogsRouter.put('/:id', (request, response, next) => {
        const body = request.body

        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: (body.hasOwnProperty('likes') ? body.likes : 0)
        }

        Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
    })


module.exports = blogsRouter