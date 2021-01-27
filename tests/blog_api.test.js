const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

let token
let usersAtStart
//this runs first
beforeEach(async () => {
    await Blog.deleteMany({})
    usersAtStart = await helper.usersInDb()
    //adding user property to the blog, so that blog can be associated with the right user
    let modifyInitialBlog = helper.initialBlogs.map(blog => blog.user = usersAtStart[1].id)
    const blogs = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    const userIs = {
      username: 'Jiban',
      password: 'Jiban'
    }
    const tokenResponse = await api
              .post('/api/login')
              .send(userIs)
              .expect(200)
              .expect('Content-Type', /application\/json/)
    token = tokenResponse.body.token
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
    expect(response.body).toHaveLength(1)
})

test('Unique Identifier property is named Id', async () => {
    const response = await helper.blogsInDb()
    const firstBlog = response[0]
    expect(firstBlog.id).toBeDefined()
})

test('Valid blog can be added', async () => {
    const newBlog = {
        title: 'Another Test using Supertest',
        author: 'JB',
        url: 'www.test.com',
        likes: 2,
        user: usersAtStart[1].id
    }

    await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}`})
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(r => r.title)
    expect(title).toContain(
      'Another Test using Supertest'
    )
})

//creating blog without token
test('blog sent without token cannot be added', async () => {

  const newBlog = {
      title: 'Another Test using Supertest',
      author: 'JB',
      url: 'www.test.com',
      likes: 2,
      user: usersAtStart[1].id
  }

  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

})

test('Blog without likes', async () => {
    const newBlog = {
        title: 'How to improve Teeth Health',
        author: 'Health Magazine',
        url: 'www.health.com'
    }

    await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}`})
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const blogObj = blogsAtEnd.find(r => r.author === 'Health Magazine')
    expect(blogObj.likes).toBe(0)
})

test('Blog missing Title and Url Properties', async () => {
    const newBlog = {
        author: 'JB'
    }

    await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}`})
        .send(newBlog)
        .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
    //as blog without title and url cannot be added to the backend 
    //therefore we should expect the same number of blogs present in initialBlogs
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

//testcase for updating of blog
  describe('Updating & deleting of a blog', () => {
    test('Updates the blog successfully', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
    
      const updateBlog = {
        title: 'Trying to Update Blog',
        author: 'JB again',
        url: 'www.update.com'
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
  
      const title = blogsAtEnd.map(r => r.title)
        
      expect(title).toContain(updateBlog.title)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `bearer ${token}`})
        .expect(204)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )
  
      const title = blogsAtEnd.map(r => r.title)
  
      expect(title).not.toContain(blogToDelete.title)
    })
  })


  afterAll(() => {
    mongoose.connection.close()
})