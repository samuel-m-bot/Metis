const Project = require('../models/Project')
const User = require('../models/User')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const axios = require('axios');

// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().populate({
        path: 'projectManagerID',
        select: 'firstName surname'  
    }).populate({
        path: 'teamMembers.userId',
        select: 'firstName surname'  
    }).lean();

    if (!projects?.length) {
        return res.status(400).json({ message: 'No projects found' });
    }
    res.json(projects);
});

// @desc Get specific project
// @route GET /projects/:id
// @access Private
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate({
        path: 'projectManagerID',
        select: 'firstName surname'
    }).populate({
        path: 'teamMembers.userId',
        select: 'firstName surname'
    }).lean();

    if (!project) {
        return res.status(400).json({ message: 'No project found with that ID' });
    }
    res.json(project);
});

// @desc Get projects assigned to the current user
// @route GET /projects/assigned/:userId
// @access Private
const getAssignedProjects = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const assignedProjects = await Project.find({
        'teamMembers.userId': userId
    }).populate({
        path: 'projectManagerID',
        select: 'firstName surname'
    }).populate({
        path: 'teamMembers.userId',
        select: 'firstName surname'
    });

    if (!assignedProjects.length) {
        return res.status(404).json({ message: 'No assigned projects found' });
    }

    res.json(assignedProjects);
});


// @desc Create new project
// @route POST /projects
// @access private
const createNewProject = asyncHandler(async (req, res) => {
    const { name, startDate, endDate, description, projectManagerID } = req.body;

    // Confirm required data is present
    if (!name || !startDate || !description || !projectManagerID) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Check for duplicate projects
    const duplicate = await Project.findOne({ name }).lean().exec();
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate project name' });
    }

    // Prepare the teamMembers array, including the project manager as an admin
    const initialTeamMembers = [
        {
            userId: projectManagerID, 
            role: 'Admin',
            permissions: ['Read', 'Write', 'Delete']
        },
    ];

    // Create project object with all fields
    const projectObject = {
        name,
        startDate,
        endDate,
        description,
        projectManagerID,
        status: 'Not Started',
        teamMembers: initialTeamMembers
    };

    // Create and store new project
    const project = await Project.create(projectObject);
    if (project) {

        const activity = new Activity({
            actionType: 'Created',
            description: `New project '${project.name}' was created with ID ${project._id}`,
            createdBy: req.user._id,
            relatedTo: project._id,
            onModel: 'Project',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await activity.save();

        res.status(201).json({ message: `New project ${name} created` });
    } else {
        res.status(400).json({ message: 'Invalid project data received' });
    }
});


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

    await project.save();

    const activity = new Activity({
        actionType: 'Updated',
        description: `Project '${project.name}' was updated with ID ${project._id}`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Project',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

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

    const activity = new Activity({
        actionType: 'Deleted',
        description: `Project '${project.name}' with ID ${project._id} was deleted`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Project',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();
    
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

    // Fetch the project and populate user details within teamMembers
    const project = await Project.findById(id)
                                 .populate('teamMembers.userId', 'firstName surname email') // Populate the userId ref
                                 .exec();

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Transform teamMembers to include user details and their roles/permissions
    const teamDetails = project.teamMembers.map(member => ({
        userId: member.userId._id,
        firstName: member.userId.firstName,
        surname: member.userId.surname,
        email: member.userId.email,
        role: member.role,
        permissions: member.permissions
    }));

    res.status(200).json({
        projectName: project.name,
        teamMembers: teamDetails
    });
});


// @desc Add a team member to a project
// @route PATCH /projects/:id/addTeamMember
// @access private
const addTeamMember = asyncHandler(async (req, res) => {
    const { userId, role, permissions } = req.body;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure user is not already a member
    if (project.teamMembers.find(member => member.userId.equals(userId))) {
        return res.status(400).json({ message: 'User already a member of the project' });
    }

    // Add new member
    project.teamMembers.push({ userId, role, permissions });
    await project.save();

    const activity = new Activity({
        actionType: 'Added',
        description: `User ${userId} was added as a '${role}' to project ${project.name} with permissions ${permissions.join(", ")}`,
        createdBy: req.user._id, // Assuming req.user._id is the ID of the user making the request
        relatedTo: project._id,
        onModel: 'Project',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.status(200).json({ message: `User added to project ${project.name}` });
});



// @desc Remove a team member from a project
// @route PATCH /projects/:projectId/removeTeamMember
// @access private
const removeTeamMember = asyncHandler(async (req, res) => {
    const { teamMemberId } = req.body; // ID of the team member to remove
    const projectId = req.params.id;

    const project = await Project.findById(projectId).populate({
        path: 'projectTasks',
        populate: { path: 'linkedChangeRequests' }
    });

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Check if any change requests are active and assigned to the team member
    const isAssignedToActiveCR = project.projectTasks.some(task =>
        task.linkedChangeRequests.some(cr => 
            cr.assignedTo.toString() === teamMemberId && cr.status !== 'Completed'
        )
    );

    if (isAssignedToActiveCR) {
        return res.status(400).json({ message: 'Cannot remove: Team member is assigned to active change requests.' });
    }

    // Verify the team member exists in the project
    const userExistsInProject = project.teamMembers.some(member => member.userId.toString() === teamMemberId);

    if (!userExistsInProject) {
        return res.status(404).json({ message: 'Team member not found in this project' });
    }

    // Remove the team member
    project.teamMembers = project.teamMembers.filter(member => member.userId.toString() !== teamMemberId);
    await project.save();

    const activity = new Activity({
        actionType: 'Removed',
        description: `User ${teamMemberId} was removed from project ${project.name}`,
        createdBy: req.user._id, // Assuming req.user._id is the ID of the user making the request
        relatedTo: project._id,
        onModel: 'Project',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();
    
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

    const activity = new Activity({
        actionType: 'Archived',
        description: `Project '${project.name}' with ID ${project._id} was archived`,
        createdBy: req.user._id,
        relatedTo: project._id,
        onModel: 'Project',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await activity.save();

    res.json({ message: `Project ${archivedProject.name} archived successfully` });
});


// @desc Fetch reviewers for a project who have "Read" permission
// @route GET /projects/:id/reviewers
// @access Private
const getReviewers = asyncHandler(async (req, res) => {
    const projectId = req.params.id; 
    const userId = req.user._id; 

    // Fetch the project by ID and populate the user details for team members
    const project = await Project.findById(projectId)
        .populate('teamMembers.userId', 'firstName surname email'); 

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Filter team members who have "Read" permission and are not the requester
    const reviewers = project.teamMembers.filter(member =>
        member.permissions.includes('Read') && member.userId._id.toString() !== userId.toString()
    );

    // Map through the filtered reviewers to return only their user details
    res.json(reviewers.map(({ userId }) => userId));
});
// @desc Get project manager's ID by ID
// @route GET /projects/:id/manager
// @access Private
const getProjectManagerById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        const project = await Project.findById(id).select('projectManagerID').lean();
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ projectManagerID: project.projectManagerID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});

// @desc Get user permissions for a specific project
// @route GET /projects/:projectId/my-permissions
// @access Private
const getUserPermissions = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const projectId = req.params.projectId; 

    // Attempt to find the specific project where the user is a team member
    const project = await Project.findOne({
        _id: projectId,
        'teamMembers.userId': userId
    }).populate({
        path: 'teamMembers.userId',
        select: 'firstName surname'
    }).lean();

    if (!project) {
        return res.status(404).json({ message: 'Project not found or user is not a team member of this project' });
    }

    // Extract the specific team member's permissions
    const teamMember = project.teamMembers.find(member => member.userId._id.toString() === userId.toString());
    const permissions = {
        projectId: project._id,
        projectName: project.name,
        permissions: teamMember ? teamMember.permissions : []
    };

    if (!permissions.permissions.length) {
        return res.status(404).json({ message: 'No permissions found for the user in this project' });
    }

    res.json(permissions);
});

// @desc Get Salesforce contact and associated account information for a project
// @route GET /projects/:id/customer
// @access Private
const getSalesforceCustomer = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.salesforceCustomerId) {
        return res.status(404).json({ message: 'No Salesforce contact linked to this project' });
    }

    const accessToken = req.session.accessToken; 
    if (!accessToken) {
        return res.status(401).json({ message: 'Salesforce access token is not available. Please log in again.' });
    }

    try {
        const url = `https://eu45.salesforce.com/services/data/v60.0/sobjects/Contact/${project.salesforceCustomerId}?fields=FirstName,LastName,Email,AccountId,Account.Name,Account.Phone,Account.Description,Account.BillingStreet,Account.BillingCity,Account.BillingState,Account.BillingPostalCode,Account.BillingCountry,Account.ShippingStreet,Account.ShippingCity,Account.ShippingState,Account.ShippingPostalCode,Account.ShippingCountry`;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.get(url, { headers });
        res.json(response.data);  
    } catch (error) {
        console.error('Failed to fetch contact and account from Salesforce:', error);
        res.status(500).json({ message: 'Failed to fetch contact and account data from Salesforce' });
    }
});

// @desc Update Salesforce customer ID for a project
// @route PATCH /projects/:id/customer
// @access Private
const updateProjectCustomer = asyncHandler(async (req, res) => {
    const { customerId } = req.body;  
    const projectId = req.params.id;

    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the current customer ID is the same as the new one
    if (project.salesforceCustomerId === customerId) {
        return res.status(409).json({ message: 'This customer is already linked to the project' });
    }

    try {
        project.salesforceCustomerId = customerId; 
        const updatedProject = await project.save(); 
        res.status(200).json({
            message: 'Salesforce customer ID updated successfully',
            project: updatedProject
        });
    } catch (error) {
        console.error('Error updating the project:', error);
        res.status(500).json({ message: 'Failed to update the project' });
    }
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
    archiveProject,
    getReviewers,
    getProjectManagerById,
    getUserPermissions,
    getSalesforceCustomer,
    updateProjectCustomer
}