const Project = require('../models/Project')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all projects
// @route GET /projects
// @access private
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().lean()
    if(!projects?.length){
        return res.status(400).json({ message: 'No projects found'})
    }
    res.json(projects)
})

// @desc Get specific projects
// @route GET /projects
// @access private
const getProjectsById = asyncHandler(async (req, res) => {
    const projects = await Project.findById(req.params.id).lean()
    if(!projects){
        return res.status(400).json({ message: 'No project found with that ID'})
    }
    res.json(projects)
})

// @desc Create new project
// @route POST /projects
// @access private
const createNewProject = asyncHandler(async (req, res) => {
    const { name, startDate, endDate, description, projectManagerID, teamMembers, associatedProducts, relatedDesigns, notes, attachments } = req.body

    // Confirm required data is present
    if (!name || !startDate || !description || !projectManagerID) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Check for duplicate projects
    const duplicate = await Project.findOne({ name }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate project name' })
    }

    // Create project object with optional fields
    const projectObject = {
        name,
        startDate,
        endDate,
        description,
        projectManagerID,
        status: 'Not Started',
        teamMembers: teamMembers || [],
        associatedProducts: associatedProducts || [],
        relatedDesigns: relatedDesigns || [],
        notes: notes || [],
        attachments: attachments || []
    };

    // Create and store new project
    const project = await Project.create(projectObject)
    if (project) {
        res.status(201).json({ message: `New project ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid project data received' })
    }
})

// @desc Update a project
// @route PATCH /projects
// @access private
const updateProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id
    const project = await Project.findById(projectId)

    if (!project) {
        return res.status(400).json({ message: 'Project not found' })
    }

    // If name needs to be updated, check for duplicates
    if (req.body.name && req.body.name !== project.name) {
        const duplicate = await User.findOne({ name: req.body.name })
        if (duplicate) {
            return res.status(400).json({ message: 'Duplicate project name' })
        }
    }

    // Update fields if they are provided
    project.name = req.body.name || project.name
    project.startDate = req.body.startDate || project.startDate
    project.endDate = req.body.endDate || project.endDate
    project.description = req.body.description || project.description
    project.projectManagerID = req.body.projectManagerID || project.projectManagerID
    project.status = req.body.status || project.status
    project.teamMembers = req.body.teamMembers || project.teamMembers
    project.associatedProducts = req.body.associatedProducts || project.associatedProducts
    project.relatedDesigns = req.body.relatedDesigns || project.relatedDesigns
    project.notes = req.body.notes || project.notes
    project.attachments = req.body.attachments || project.attachments

    await project.save();
    res.status(200).json({ message: `Project ${project.name} updated` })
})



// @desc Delete a project
// @route DELETE /projects
// @access private
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const result = await project.deleteOne()

    const reply = `Project ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllProjects,
    getProjectsById,
    createNewProject,
    updateProject,
    deleteProject
}