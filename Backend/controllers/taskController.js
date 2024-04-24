const Task = require('../models/Tasks');
const ChangeRequest = require('../models/ChangeRequest');
const asyncHandler = require('express-async-handler');
const Project = require('../models/Project')
const Activity = require('../models/Activity')

// @desc Create a new task
// @route POST /tasks
// @access Private
const createTask = asyncHandler(async (req, res) => {
    const {
        name, description, status, priority, assignedTo, taskType,
        projectId, dueDate, relatedTo,  assignedDesign, assignedDocument, assignedProduct, review
    } = req.body;

    if (!name || !description || !status || !priority || !assignedTo || !taskType || !projectId || !relatedTo) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    // Create a new task
    const task = new Task({
        projectId,
        name,
        description,
        status,
        priority,
        assignedTo,
        taskType,
        dueDate,
        relatedTo,
    });

    if(relatedTo && relatedTo==="Design" && assignedDesign) task.assignedDesign = assignedDesign;
    if(relatedTo && relatedTo==="Document" && assignedDocument) task.assignedDocument = assignedDocument;
    if(relatedTo && relatedTo==="Product" && assignedProduct) task.assignedProduct = assignedProduct;
    if(review) task.review = review;

    task.creationDate = Date.now();

    const savedTask = await task.save();

    // Update the Project to include the new task
    await Project.findByIdAndUpdate(
        projectId,
        { $push: { projectTasks: savedTask._id } },
        { new: true, safe: true, upsert: true }
    );

    res.status(201).json(savedTask);
});

// @desc Get all tasks
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate('assignedTo', 'firstName surname').populate('projectId', 'name');
    if(!tasks?.length){
        return res.status(400).json({ message: 'No tasks found'})
    }
    res.status(200).json(tasks);
});

// @desc Get task by ID
// @route GET /tasks/:id
// @access Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'firstName surname').populate('projectId', 'name');
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
});

// @desc Get tasks assigned to a specific user
// @route GET /tasks/user/:userId
// @access Private
const getUserTasks = asyncHandler(async (req, res) => {
    const userId = req.params.userId; // Or obtain the userId from req.user if using authentication middleware

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Find tasks where the userId is in the assignedTo array
    const tasks = await Task.find({ assignedTo: { $in: [userId] } });

    if (tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json(tasks);
});


// @desc Update a task
// @route PATCH /tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const {
        name, description, status, priority, assignedTo, taskType,
        projectId, dueDate, relatedTo, assignedDesign, assignedDocument, assignedProduct, review
    } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields if provided
    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.taskType = taskType || task.taskType;
    task.projectID = projectId || task.projectID;
    task.dueDate = dueDate || task.dueDate;
    task.relatedTo = relatedTo || task.relatedTo;
    task.assignedDesign = assignedDesign || task.assignedDesign;
    task.assignedDocument = assignedDocument || task.assignedDocument;
    task.assignedProduct = assignedProduct || task.assignedProduct;
    task.review = review || task.review;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
});


// @desc Delete a task
// @route DELETE /tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.projectId;
    // Use findByIdAndDelete instead of remove
    await Task.findByIdAndDelete(req.params.id);

    // Remove the task from the Project document
    await Project.findByIdAndUpdate(
        projectId,
        { $pull: { projectTasks: req.params.id } },
        { new: true }
    );

    const newActivity = new Activity({
        actionType: 'Deleted',
        description: `Task ${req.params.id} has been deleted by user ${req.user._id}`,
        createdBy: req.user._id,
        relatedTo: req.params.id,
        onModel: 'Task',
    });
    await newActivity.save();

    res.status(200).json({ message: 'Task deleted successfully' });
});

// @desc Add a subtask to a task
// @route POST /tasks/:id/subtasks
// @access Private
const addSubtask = asyncHandler(async (req, res) => {
    const { title, assignedTo, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const subtask = {
        title,
        assignedTo,
        dueDate,
        status: 'Not Started' // Default status
    };

    task.subtasks.push(subtask);
    await task.save();

    const newActivity = new Activity({
        actionType: 'Created',
        description: `Subtask ${subtask.title}, has been created for task ${req.params.id}.Created by user ${userId}`,
        createdBy: req.user._id,
        relatedTo: req.params.id,
        onModel: 'Task',
    });
    await newActivity.save();
    res.status(201).json({ message: 'Subtask added successfully', task });
});


// @desc Update a subtask
// @route PATCH /tasks/:taskId/subtasks/:subtaskId
// @access Private
const updateSubtask = asyncHandler(async (req, res) => {
    const { taskId, subtaskId } = req.params;
    const { title, assignedTo, status, dueDate } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const subtaskIndex = task.subtasks.findIndex(subtask => subtask._id.equals(subtaskId));
    if (subtaskIndex === -1) {
        res.status(404);
        throw new Error('Subtask not found');
    }

    // Update subtask fields if provided, otherwise keep the current value
    if (title !== undefined) task.subtasks[subtaskIndex].title = title;
    if (assignedTo !== undefined) task.subtasks[subtaskIndex].assignedTo = assignedTo;
    if (status !== undefined) task.subtasks[subtaskIndex].status = status;
    if (dueDate !== undefined) task.subtasks[subtaskIndex].dueDate = dueDate;

    await task.save();
    res.status(200).json({ message: 'Subtask updated successfully', task });
});


// @desc Mark a checklist item as completed
// @route PATCH /tasks/:taskId/checklist/:itemId
// @access Privateer(
const toggleChecklistItem = asyncHandler(async (req, res) => {
    const { taskId, itemId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const item = task.checklist.id(itemId);
    if (!item) {
        return res.status(404).json({ message: 'Checklist item not found' });
    }

    // Toggle the completion status of the checklist item
    item.completed = !item.completed;
    await task.save();

    res.status(200).json({ message: 'Checklist item status updated', task });
});


// @desc Add a comment to a task
// @route POST /tasks/:id/comments
// @access Private
const addCommentToTask = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const taskId = req.params.id;

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const comment = {
        text,
        postedBy: req.user._id
    };

    task.comments.push(comment);
    await task.save();

    res.status(201).json({ message: 'Comment added successfully', task });
});


// @desc Edit a task comment
// @route PATCH /tasks/:taskId/comments/:commentId
// @access Private
const editTaskComment = asyncHandler(async (req, res) => {
    const { taskId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Updated comment text is required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const comment = task.comments.id(commentId);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    comment.text = text;
    await task.save();

    res.status(200).json({ message: 'Comment updated successfully', task });
});

// @desc Filter tasks by IDs and Status
// @route POST /tasks/filter
// @access Private
const filterTasks = asyncHandler(async (req, res) => {
    const { taskIds, status } = req.body;
    try {
        const tasks = await Task.find({
            '_id': { $in: taskIds },
            'status': status
        }).populate('assignedTo', 'firstName surname');  // Populate if needed
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @desc Get tasks by projectId
// @route GET /tasks/project/:projectId
// @access private
const getTasksByProjectId = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId }).lean();
    if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this project' });
    }
    res.json(tasks);
});

// @desc Manages review related tasks including marking the setup task as complete, creating review tasks for each reviewer, and setting up an observation task
// @route POST /tasks/manage-review-tasks
// @access Private
const manageReviewTasks = asyncHandler(async (req, res) => {
    const { reviewId, projectId, reviewers, taskDetails, isChangeRequest } = req.body;

    const requestUserId = req.user._id; 
    try {
        if (!isChangeRequest) {
            // Mark the setup task as completed if it's not a change request
            await Task.findByIdAndUpdate(taskDetails.id, { status: 'Completed' });
        }

        // Create tasks for each reviewer
        reviewers.forEach(async reviewer => {
            const newTask = new Task({
                projectId,
                name: 'Review Task for ' + taskDetails.relatedTo,
                description: 'Please review the ' + taskDetails.relatedTo.toLowerCase(),
                status: 'Not Started',
                priority: taskDetails.priority,
                assignedTo: [reviewer.userId],
                taskType: 'Review',
                relatedTo: taskDetails.relatedTo,
                dueDate: taskDetails.dueDate,
                review: reviewId
            });
            await newTask.save();
        });

        // Determine the observer based on whether it's a change request
        const observerId = isChangeRequest ? requestUserId : taskDetails.assignedTo;

        // Create an observer task
        const observeTask = new Task({
            projectId,
            name: 'Observe item review',
            description: 'Observe the review process.',
            status: 'In Progress',
            priority: taskDetails.priority,
            assignedTo: observerId,
            taskType: 'Observe',
            relatedTo: taskDetails.relatedTo,
            dueDate: taskDetails.dueDate,
            review: reviewId
        });
        await observeTask.save();

        res.status(200).json({ message: 'Tasks managed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error managing review tasks', error: error.toString() });
    }
});

// @desc Updates staus of create task as well as creating a set up review task
// @route POST /tasks/complete-and-setup-review
// @access Private
const completeTaskAndSetupReview = asyncHandler(async (req, res) => {
    const { projectId, task, createdItemId } = req.body;

    try {
        // Update the existing task to 'Completed'
        const updatedTask = await Task.findByIdAndUpdate(task.id, {
            status: 'Completed',
            // Dynamically assign the document, design, or product ID based on the type of item
            [`assigned${task.relatedTo}`]: createdItemId
        }, { new: true });

        // Create a new task for setting up the review
        const reviewTaskData = {
            projectId: projectId,
            name: `Set up review for newly created ${task.relatedTo.toLowerCase()}`,
            description: `Choose from a list of users who will review the ${task.relatedTo.toLowerCase()}`,
            status: 'In Progress',
            priority: task.priority,
            assignedTo: task.assignedTo,
            taskType: 'Set up Review',
            relatedTo: task.relatedTo,
            dueDate: task.dueDate || undefined,
            [`assigned${task.relatedTo}`]: createdItemId,
        };

        const newReviewTask = new Task(reviewTaskData);
        await newReviewTask.save();

        res.status(201).json({
            message: 'Task completed and review setup task created successfully',
            updatedTask,
            newReviewTask
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to complete task and setup review',
            error: error.message
        });
    }
});

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    getUserTasks,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    toggleChecklistItem,
    addCommentToTask,
    editTaskComment,
    filterTasks,
    getTasksByProjectId,
    manageReviewTasks,
    completeTaskAndSetupReview
};
