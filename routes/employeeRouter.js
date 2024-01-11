const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

router.get('/', ensureAuthenticated, ensureEmployee, async (req, res) => {
    const employee = JSON.parse(req.cookies.user);
    const projects = await projectModel.getProjectsForEmployee(employee.id);
    res.render("employeeDashboard", { user: req.user, projects });
});

router.get('/view_project', ensureAuthenticated, ensureEmployee, async (req, res) => {
    const { projectName, projectId, employeeId } = req.query;
    const employees = await projectModel.getEmployeesForProject(projectName);
    const project = await projectModel.getInfoForProject(projectName);
    const tasks = await projectModel.getTasksForEmployeeOnProject(employeeId, projectId);
    res.render("employeeProjectOverview", { user: req.user, employees, project, tasks });
});











router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});




// helper functions
function ensureAuthenticated(req, res, next) {
    const userCookie = req.cookies.user;
    if (userCookie) {
        req.user = JSON.parse(userCookie);
        return next();
    }
    res.status(401).send("Unauthorized");
};

function ensureEmployee(req, res, next) {
    if (req.user.role === 'employee') {
        return next();
    };

    res.status(403).send("Permission denied");
};


module.exports = router;