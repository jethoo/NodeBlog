const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Testing Api',
        author: 'JB',
        url: 'https://www.jeewanbbhusal.me',
        likes: 1
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}