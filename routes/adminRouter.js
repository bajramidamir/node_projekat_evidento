const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const projectController = require("../controllers/projectController");
const adminController = require('../controllers/adminController');

router.get('/', ensureAuthenticated, ensureAdmin, adminController.getAdminDashboard);
router.get('/users', ensureAuthenticated, ensureAdmin, adminController.getAdminUserPanel);
router.get('/projects', ensureAuthenticated, ensureAdmin, adminController.getAdminProjectsPanel)
router.get('/view_project', ensureAuthenticated, ensureAdmin, adminController.getAdminViewProject);
router.post('/create_project', ensureAuthenticated, ensureAdmin, projectController.createProject);
router.post('/create_task', ensureAuthenticated, ensureAdmin, projectController.createTask);
router.post('/create_user', ensureAuthenticated, ensureAdmin, userController.createUser);
router.post('/delete_user', ensureAuthenticated, ensureAdmin, userController.deleteUser);
router.get('/edit_user', ensureAuthenticated, ensureAdmin, adminController.getAdminEditUser);
router.post('/update_user', ensureAuthenticated, ensureAdmin, userController.updateUser);
router.post('/get_report', ensureAuthenticated, ensureAdmin, adminController.getAdminReport);

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
function ensureAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    };
    res.status(403);
    const errorMessage = "Permission denied";
    res.render('fourOhThree', { errorMessage });
};

module.exports = router;