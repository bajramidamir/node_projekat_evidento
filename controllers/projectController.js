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
    };
};

const updateTask = async (req, res) => {
    const {projectId, taskId, status, hoursWorked } = req.body;
    try {
        await projectModel.updateTask(status, hoursWorked, projectId, taskId);
        res.redirect('/employee_dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

const quickInput = async (req, res) => {
    try {
        const { inputData } = req.body;
        const data = inputData.split("#").map(item => item.trim());
    
        const projectName = data[1];
        const taskName = data[2];
        const hours = data[3];


        const projectInfo = await projectModel.getInfoForProject(projectName);
        const projectId = projectInfo.project_id;

        await projectModel.quickInput(projectId, taskName, hours);
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    createProject,
    createTask,
    updateTask,
    quickInput
};