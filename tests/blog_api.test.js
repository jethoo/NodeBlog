const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

//this runs first
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('only one blog is present', async() => {
    const response = await api.get('/api/blogs')
    console.log('response from only one', response.text)
    expect(response.body).toHaveLength(1)
})


afterAll(() => {
    mongoose.connection.close()
})