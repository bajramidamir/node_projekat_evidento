const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

const getAdminDashboard = async (req, res) => {
    try {
        const userCount = await userModel.getUserCount();
        const projectCount = await projectModel.getProjectCount();
        const allUsers = await userModel.getAllUsers();
        const allProjects = await projectModel.getAllProjects();
        res.render('adminDashboard', { user: req.user, userCount, projectCount, allUsers, allProjects });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};
const getAdminUserPanel = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('adminUserPanel', { user: req.user, users });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
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
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
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
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};
const getAdminEditUser = async (req, res) => {
    try {
        const { username } = req.query;
        res.render('adminUserEdit', { user: req.user, username });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};
const getAdminReport = async (req, res) => {
    // initialize data to pass to EJS
    let reportData;
    try {
        const reportNumber = parseInt(req.body.reportNumber, 10); // converting the incoming char to an integer
        switch(reportNumber) {
            case 1:
                reportData = await projectModel.getEmployeeHours();
                res.render('adminSelectedReportOne', { user: req.user, reportData });
            case 2:
                reportData = await projectModel.getProjectManagersAndProjects();
                res.render('adminSelectedReportTwo', { user: req.user, reportData });
        }
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};

module.exports = {
    getAdminDashboard,
    getAdminUserPanel,
    getAdminProjectsPanel,
    getAdminViewProject,
    getAdminEditUser,
    getAdminReport
};