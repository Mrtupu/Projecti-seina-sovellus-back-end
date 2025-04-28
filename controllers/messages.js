const messageRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Message = require('../models/message')
const { error } = require('../utils/logger')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    console.log('authorization', authorization)
    if(authorization && authorization.startsWith('bearer ')){
      return authorization.replace('bearer ', '')
    }
    return null
}

messageRouter.get('/', async (request, response) => {
    const messages = await Message.find({})
        .populate('user', { username: 1, name: 1 })
        .populate('project', { name: 1 })
    response.json(messages)
})

messageRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const message = await Message.findById(id)
        .populate('user', { username: 1, name: 1 })
        .populate('project', { name: 1 })
    if (message) {
        response.json(message)
    } else {
        response.status(404).end()
    } 
})

messageRouter.delete('/:id', async (req, res) => {
    await Message.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

messageRouter.put('/:id', async (req, res) => {
    const body = req.body
    const message = {
        text: body.text,
        project: body.project,
        user: body.user,
    }
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, message, { new: true })
    res.json(updatedMessage)
})

messageRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const message = new Message({
        text: body.text,
        project: body.project,
        user: user._id,
    })
    const savedMessage = await message.save()
    response.status(201).json(savedMessage)
})

module.exports = messageRouter
