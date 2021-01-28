const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  //validations
  if(body.username === undefined){
    return response.status(400).json({ error: 'username missing' })
  }else if(body.password === undefined){
    return response.status(400).json({ error: 'password missing' })
  }else if (body.username.length < 3){
    return response.status(400).json({ error: 'username must have atleast three characters' })
  }else if (body.password.length < 3){
    return response.status(400).json({ error: 'password must have atleast three characters' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')

  response.json(users)
})

module.exports = usersRouter