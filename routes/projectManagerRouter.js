const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const projectManagerController = require('../controllers/projectManagerController');
const chatController = require('../controllers/chatController');

router.get('/', ensureAuthenticated, ensureProjectManager, projectManagerController.getProjectManagerDashboard);
router.get('/projects', ensureAuthenticated, ensureProjectManager, projectManagerController.getProjectManagerProjectsPanel);
router.get('/view_project', ensureAuthenticated, ensureProjectManager, projectManagerController.getProjectManagerViewProject);
router.post('/create_project', ensureAuthenticated, ensureProjectManager, projectController.createProject);
router.post('/create_task', ensureAuthenticated, ensureProjectManager, projectController.createTask);
router.get('/chat', ensureAuthenticated, ensureProjectManager, chatController.getChatView);



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