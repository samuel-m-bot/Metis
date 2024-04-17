const Project = require('../models/Project')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all projects
// @route GET /projects
// @access private
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().lean()
    res.json(projects)
})

// @desc Get specific projects
// @route GET /projects
// @access private
const getProjectById = asyncHandler(async (req, res) => {
    const projects = await Project.findById(req.params.id).lean()
    if(!projects){
        return res.status(400).json({ message: 'No project found with that ID'})
    }
    res.json(projects)
})

// @desc Get projects assigned to the current user
// @route GET /projects/assigned/:userId
// @access Private
const getAssignedProjects = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Find projects where the userId is in the teamMembers array
    const assignedProjects = await Project.find({ teamMembers: { $in: [userId] } });

    if (!assignedProjects.length) {
        return res.status(404).json({ message: 'No assigned projects found' });
    }

    res.json(assignedProjects);
});

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

// @desc Search for projects based on query parameters
// @route GET /projects/search
// @access private
const searchProjects = asyncHandler(async (req, res) => {
    // Extract query parameters
    const { name, status, projectManagerID, startDate, endDate } = req.query;

    // Build query object
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (status) query.status = status;
    if (projectManagerID) query.projectManagerID = projectManagerID;
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };

    // Execute query
    const projects = await Project.find(query);

    // Check if projects found
    if (!projects.length) {
        return res.status(404).json({ message: 'No projects found matching the criteria.' });
    }

    res.json(projects);
});

// @desc Get project with team member details
// @route GET /projects/:id/team
// @access Private
const getProjectTeamDetails = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID of the project

    // Fetch the project
    const project = await Project.findById(id)
                                 .populate('teamMembers', 'firstName surname email') // Assuming you only need these fields
                                 .exec();

    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }

    // Since team members are populated, the user details are directly accessible
    res.status(200).json({
        projectName: project.name,
        teamMembers: project.teamMembers.map(member => ({
            id: member._id,
            firstName: member.firstName,
            surname: member.surname,
            email: member.email
        }))
    });
});

// @desc Add a team member to a project
// @route PATCH /projects/:id/addTeamMember
// @access private
const addTeamMember = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const projectId = req.params.id
    // Find the project and check if it exists
    console.log(projectId)
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Verify the user exists as well
    console.log(userId)
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Add the user to the project's teamMembers array if not already included
    if (!project.teamMembers.includes(userId)) {
        project.teamMembers.push(userId);
        await project.save();
        return res.status(200).json({ message: `User ${userId} added to project ${projectId}` });
    } else {
        return res.status(400).json({ message: 'User already a member of the project' });
    }
});


// @desc Remove a team member from a project
// @route PATCH /projects/:projectId/removeTeamMember
// @access private
const removeTeamMember = asyncHandler(async (req, res) => {
    const { teamMemberId } = req.body; // ID of the team member to remove
    const project = await Project.findById(req.params.id).populate({
        path: 'projectTasks',
        populate: { path: 'linkedChangeRequests' }
    });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Check if any change requests are active and assigned to the user
    const isAssignedToActiveCR = project.projectTasks.some(task =>
        task.linkedChangeRequests.some(cr => 
            cr.assignedTo.toString() === teamMemberId && cr.status !== 'Completed'
        )
    );

    if (isAssignedToActiveCR) {
        return res.status(400).json({ message: 'Cannot remove: User is assigned to active change requests.' });
    }

    // Verify the user exists
    const user = await User.findById(teamMemberId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Remove the team member
    project.teamMembers = project.teamMembers.filter(member => member.toString() !== teamMemberId);
    await project.save();
    res.json({ message: 'Team member removed successfully' });
});



// @desc List change requests for a project
// @route GET /projects/:id/changeRequests
// @access private
const listProjectChangeRequests = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    const changeRequests = await ChangeRequest.find({ projectID: projectId });

    if (changeRequests.length > 0) {
        res.json(changeRequests);
    } else {
        res.status(404).json({ message: 'No change requests found for this project' });
    }
});


//ListProjectDocuments

// @desc Update Project Status
// @route PATCH /projects/:id/status
// @access private
const updateProjectStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project.status = status || project.status;
    const updatedProject = await project.save();

    res.json({
        message: `Project status updated to ${updatedProject.status}`,
        project: updatedProject
    });
});

// @desc Archive a project
// @route PATCH /projects/:id/archive
// @access private
const archiveProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Assuming 'status' field exists and 'Archived' is a valid status
    project.status = 'Archived';

    const archivedProject = await project.save();

    res.json({ message: `Project ${archivedProject.name} archived successfully` });
});


//GenerateProjectReport (complex endpoint tba)

//ProjectTimelineUpdates (complex endpoint tba)

module.exports = {
    getAllProjects,
    getProjectById,
    getAssignedProjects,
    createNewProject,
    updateProject,
    deleteProject,
    searchProjects,
    getProjectTeamDetails,
    addTeamMember,
    removeTeamMember,
    listProjectChangeRequests,
    updateProjectStatus,
    archiveProject
}