const User = require('../models/User');
const logger = require('../utils/logger');

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(400).send(error);
    }
    }

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(400).send(error);
    }
}

const fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        logger.error('Error fetching user by id:', error);
        res.status(400).send(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (error) {
        logger.error('Error updating user:', error);
        res.status(400).send(error);
    }
}

const updateUserInvestigations = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.investigations.push(req.body.investigation); // Assuming you're sending an investigation object
        user.markModified('investigations');
        await user.save();
        res.send(user);
    } catch (error) {
        logger.error('Error updating user investigations:', error);
        res.status(400).send(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(400).send(error);
    }
};



module.exports = { createUser, fetchUsers, fetchUserById, updateUser, updateUserInvestigations, deleteUser };