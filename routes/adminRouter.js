const express = require('express');
const router = express.Router();
const cookie = require('cookie');

const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const projectController = require("../controllers/projectController");
const projectModel = require('../models/projectModel');


// routes
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const userCount = await userModel.getUserCount();
        const projectCount = await projectModel.getProjectCount();
        res.render('adminDashboard', { user: req.user, userCount, projectCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('adminUserPanel', { user: req.user, users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});


router.get('/projects', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const employees = await userModel.getAllEmployees();
        const projectManagers = await userModel.getAllProjectManagers();
        const projects = await projectModel.getProjects();
        res.render('adminProjectsPanel', { user: req.user, employees, projectManagers, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});


router.post('/create_project', ensureAuthenticated, ensureAdmin, async (req, res) => {
    projectController.createProject(req, res);
});


router.get('/view_project', ensureAuthenticated, ensureAdmin, async (req, res) => {
    const { projectName } = req.query;
    const employees = await projectModel.getEmployeesForProject(projectName);
    const project = await projectModel.getInfoForProject(projectName);
    const tasks = await projectModel.getProjectTasks(projectName);
    const projectManager = await projectModel.getProjectManagerForProject(projectName);
    res.render('adminProjectOverview', { user: req.user, employees, project, tasks, projectManager });
});

router.post('/create_task', ensureAuthenticated, ensureAdmin, async (req, res) => {
    projectController.createTask(req, res);
});

router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

router.post('/create_user', ensureAuthenticated, ensureAdmin, (req, res) => {
    userController.createUser(req, res);
});


router.post('/delete_user', ensureAuthenticated, ensureAdmin, async (req, res) => {
    userController.deleteUser(req, res);
});

router.get('/edit_user', ensureAuthenticated, ensureAdmin, (req, res) => {
    const { username } = req.query;
    res.render('adminUserEdit', { user: req.user, username });
});

router.post('/update_user', ensureAuthenticated, ensureAdmin, (req, res) => {
    userController.updateUser(req, res);
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
function ensureAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    };
    res.status(403).send('Permission denied');
};

module.exports = router;