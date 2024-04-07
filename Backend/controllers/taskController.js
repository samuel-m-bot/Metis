const Task = require('../models/Task');
const ChangeRequest = require('../models/ChangeRequest');
const asyncHandler = require('express-async-handler');


// @desc Create a new task and associate it with a change request if applicable
// @route POST /tasks
// @access Private
const createTask = asyncHandler(async (req, res) => {
    const { name, description, status, priority, assignedTo, taskType, projectId, dueDate, relatedTo, onModel } = req.body;

    if (!name || !description || !status || !priority || !assignedTo || !taskType || !projectId) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    // Create a new task
    const task = new Task({
        name,
        description,
        status,
        priority,
        assignedTo,
        taskType,
        projectID: projectId,
        dueDate,
        relatedTo,
        onModel
    });

    const savedTask = await task.save();

    // If the task is for a ChangeRequest, update the associated ChangeRequest
    if (onModel === 'ChangeRequest' && relatedTo) {
        const changeRequest = await ChangeRequest.findById(relatedTo);
        if (!changeRequest) {
            res.status(404);
            throw new Error('ChangeRequest not found');
        }
        changeRequest.associatedTasks.push(savedTask._id);
        await changeRequest.save();
    }

    res.status(201).json(savedTask);
});


// @desc Get all tasks
// @route GET /tasks
// @access Private
const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate('assignedTo', 'firstName surname').populate('projectID', 'name');
    if (tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks found' });
    }
    res.status(200).json(tasks);
});

// @desc Get task by ID
// @route GET /tasks/:id
// @access Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'firstName surname').populate('projectID', 'name');
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
});

// @desc Update a task
// @route PATCH /tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const { name, description, status, priority, assignedTo, taskType, projectId, dueDate, relatedTo, onModel } = req.body;
    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.taskType = taskType || task.taskType;
    task.projectID = projectId || task.projectID;
    task.dueDate = dueDate || task.dueDate;
    task.relatedTo = relatedTo || task.relatedTo;
    task.onModel = onModel || task.onModel;

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
    await task.remove();
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
// @access Private
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


module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    toggleChecklistItem,
    addCommentToTask,
    editTaskComment
};
