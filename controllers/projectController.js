const projectModel = require('../models/projectModel');

const createProject = async (req, res) => {
    const { projectName, projectDescription, assignedUsers, assignedProjectManager, startDate, endDate } = req.body;
    try {
        await projectModel.createNewProject(projectName, projectDescription, assignedUsers, assignedProjectManager, startDate, endDate);
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
};

const createTask = async (req, res) => {
    const { projectName, taskName, taskDescription, assignedUser, dueDate } = req.body;
    try {
        await projectModel.createTask(projectName, taskName, taskDescription, assignedUser, dueDate);
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createProject,
    createTask
};