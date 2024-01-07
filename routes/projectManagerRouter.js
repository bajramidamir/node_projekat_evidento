const express = require('express');
const router = express.Router();

const projectModel = require('../models/projectModel');
const projectController = require('../controllers/projectController');
const userModel = require('../models/userModel');

router.get('/', ensureAuthenticated, ensureProjectManager, async (req, res) => {
    try {
        const userCookie = JSON.parse(req.cookies.user);
        const projectManagerIdQuery = await userModel.getUserIdByUsername(userCookie.username);
        const projectManagerId = projectManagerIdQuery.user_id;
        const projects = await projectModel.getProjectsForProjectManagerId(projectManagerId);
        res.render("projectManagerDashboard", { user: req.user, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/projects', ensureAuthenticated, ensureProjectManager, async (req, res) => {
    try {
        const employees = await userModel.getAllEmployees();
        res.render('projectManagerProjectsPanel', { user: req.user, employees });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/view_project', ensureAuthenticated, ensureProjectManager, async (req, res) => {
    const { projectName } = req.query;
    const employees = await projectModel.getEmployeesForProject(projectName);
    const project = await projectModel.getInfoForProject(projectName);
    const tasks = await projectModel.getProjectTasks(projectName);
    res.render("projectManagerProjectOverview", { user: req.user, employees, project, tasks });
})

router.post('/create_project', ensureAuthenticated, ensureProjectManager, (req, res) => {
    projectController.createProject(req, res);
});

router.post('/create_task', ensureAuthenticated, ensureProjectManager, (req, res) => {
    projectController.createTask(req, res);
})

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

function ensureProjectManager(req, res, next) {
    if (req.user.role === 'project manager') {
        return next();
    };

    res.status(403).send("Permission denied");
};


module.exports = router;