const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

const getAdminDashboard = async (req, res) => {
    try {
        const userCount = await userModel.getUserCount();
        const projectCount = await projectModel.getProjectCount();
        res.render('adminDashboard', { user: req.user, userCount, projectCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getAdminUserPanel = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('adminUserPanel', { user: req.user, users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getAdminProjectsPanel = async (req, res) => {
    try {
        const employees = await userModel.getAllEmployees();
        const projectManagers = await userModel.getAllProjectManagers();
        const projects = await projectModel.getProjects();
        res.render('adminProjectsPanel', { user: req.user, employees, projectManagers, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getAdminViewProject = async (req, res) => {
    try {
        const { projectName } = req.query;
        const employees = await projectModel.getEmployeesForProject(projectName);
        const project = await projectModel.getInfoForProject(projectName);
        const tasks = await projectModel.getProjectTasks(projectName);
        const projectManager = await projectModel.getProjectManagerForProject(projectName);
        res.render('adminProjectOverview', { user: req.user, employees, project, tasks, projectManager });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getAdminEditUser = async (req, res) => {
    try {
        const { username } = req.query;
        res.render('adminUserEdit', { user: req.user, username });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    getAdminDashboard,
    getAdminUserPanel,
    getAdminProjectsPanel,
    getAdminViewProject,
    getAdminEditUser,
};