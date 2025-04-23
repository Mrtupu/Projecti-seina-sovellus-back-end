const projectRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Project = require('../models/project')
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

projectRouter.get('/', async (request, response) => {
    const projects = await Project.find({}).populate('user', { username: 1, name: 1 })
    response.json(projects)
})

projectRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const project = await Project.findById(id).populate('user', { username: 1, name: 1 })
    if (project) {
        response.json(project)
    } else {
        response.status(404).end()
    }
})

projectRouter.delete('/:id', async (req, res) => {
    await Project.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

projectRouter.put('/:id', async (req, res) => {
    const body = req.body
    const project = {
        members: body.members,
        status: body.status,
        deadline: body.deadline,
    }
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, project, { new: true })
    res.json(updatedProject)
})

projectRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const project = new Project({
        name: body.name,
        projectType: body.projectType,
        codelanguage: body.codelanguage,
        description: body.description,
        status: body.status,
        members: body.members,
        deadline: body.deadline,
    })

    const savedProject = await project.save()
    response.status(201).json(savedProject)
})

module.exports = projectRouter



