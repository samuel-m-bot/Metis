const User = require('../models/User')
const Activity = require('../models/Activity')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-passwordHash').lean()
    if(!users?.length){
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

// @desc Get specific users
// @route GET /users
// @access private
const getUsersById = asyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select('-passwordHash').lean()
    if(!users){
        return res.status(400).json({ message: 'No user found with that ID'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
    const {email, firstName, surname, password, roles, department} = req.body

    // Confirm data is all there to create a user
    if(!email ||!firstName ||!surname || !password || !Array.isArray(roles) || !roles.length || !department){
        return res.status(400).json({ message: 'All fields are required'})
    }

    //checks for duplicate users
    const duplicate = await User.findOne({ email }).lean().exec()
    if(duplicate){
        return res.status(400).json({ message: 'Duplicate email'})
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds

    const userObject = {email, firstName, surname, "passwordHash": hashedPwd, roles, department}

    //Create and store new user
    const user = await User.create(userObject)

    if(user){
        const createUserActivity = new Activity({
            actionType: 'Created',
            description: `New user ${email} created with roles ${roles.join(', ')} and department ${department}.`,
            createdBy: req.user._id, 
            relatedTo: user._id,
            onModel: 'User',
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        });
        await createUserActivity.save();
        res.status(201).json({ message: `New user ${email} created`})
    }else{
        res.status(400).json({ message:'Invalid user data received'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // If email needs to be updated, check for duplicates
    if (req.body.email && req.body.email !== user.email) {
        const duplicate = await User.findOne({ email: req.body.email })
        if (duplicate) {
            return res.status(400).json({ message: 'Duplicate email' })
        }
    }

    // Update fields
    user.email = req.body.email || user.email
    user.firstName = req.body.firstName || user.firstName
    user.surname = req.body.surname || user.surname
    user.roles = req.body.roles || user.roles
    user.department = req.body.department || user.department

    // Update password if provided
    if (req.body.password) {
        user.passwordHash = await bcrypt.hash(req.body.password, 10)
    }

    const updatedUser = await user.save()

    const updateUserActivity = new Activity({
        actionType: 'Updated',
        description: `User ${user._id} updated. Changes include new email: ${req.body.email || user.email}, and potentially updated roles or department.`,
        createdBy: req.user._id, 
        relatedTo: user._id,
        onModel: 'User',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await updateUserActivity.save();

    res.json({ message: `${updatedUser.email} updated` })
})


// @desc Delete a user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const result = await user.deleteOne()

    const reply = `Email ${user.email} with ID ${user._id} deleted`

    const deleteUserActivity = new Activity({
        actionType: 'Deleted',
        description: `User ${user._id} with email ${user.email} deleted.`,
        createdBy: req.user._id, 
        relatedTo: user._id,
        onModel: 'User',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
    });
    await deleteUserActivity.save();

    res.json(reply)
})

module.exports = {
    getAllUsers,
    getUsersById,
    createNewUser,
    updateUser,
    deleteUser
}