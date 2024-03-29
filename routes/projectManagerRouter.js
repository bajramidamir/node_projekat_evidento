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
router.get('/get_project_report', ensureAuthenticated, ensureProjectManager, projectManagerController.getProjectReport);
router.post('/download_pdf', ensureAuthenticated, ensureProjectManager, projectManagerController.downloadReportAsPdf);
router.post('/review_task', ensureAuthenticated, ensureProjectManager, projectManagerController.reviewTask);
router.post('/send_review_email', ensureAuthenticated, ensureProjectManager, projectManagerController.sendReviewEmail);

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
    res.status(401);
    const errorMessage = "Unauthorized";
    res.render('fourOhOne', { errorMessage });
};
function ensureProjectManager(req, res, next) {
    if (req.user.role === 'project manager') {
        return next();
    };

    res.status(403);
    const errorMessage = "Permission denied";
    res.render('fourOhThree', { errorMessage });
};


module.exports = router;