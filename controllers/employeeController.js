const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');

const getEmployeeDashboard = async (req, res) => {
    try {
        const employee = JSON.parse(req.cookies.user);
        const projects = await projectModel.getProjectsForEmployee(employee.id);
        res.render("employeeDashboard", { user: req.user, projects });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};

const getEmployeeViewProject = async (req, res) => {
    try {
        const { projectName, projectId, employeeId } = req.query;
        const employees = await projectModel.getEmployeesForProject(projectName);
        const project = await projectModel.getInfoForProject(projectName);
        const tasks = await projectModel.getTasksForEmployeeOnProject(employeeId, projectId);
        res.render("employeeProjectOverview", { user: req.user, employees, project, tasks });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};

const getEmployeeUpdateTask = async (req, res) => {
    try {
        const { taskId, projectName } = req.query;
        const taskInfo = await projectModel.getTaskInfoById(taskId);
        const projectInfo = await projectModel.getInfoForProject(projectName);
        res.render("employeeUpdateTask", { user: req.user, taskInfo, projectInfo });
    } catch (error) {
        console.error(error);
        const errorMessage = "Something really went wrong if this catch block fired"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};


module.exports = {
    getEmployeeDashboard,
    getEmployeeViewProject,
    getEmployeeUpdateTask
}