const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');
const projectController = require('../controllers/projectController');
const chatController = require('../controllers/chatController');

router.get('/', ensureAuthenticated, ensureEmployee, employeeController.getEmployeeDashboard);
router.get('/view_project', ensureAuthenticated, ensureEmployee, employeeController.getEmployeeViewProject);
router.get('/update_task', ensureAuthenticated, ensureEmployee, employeeController.getEmployeeUpdateTask);
router.post('/update_task', ensureAuthenticated, ensureEmployee, projectController.updateTask);
router.get('/chat', ensureAuthenticated, ensureEmployee, chatController.getChatView);
router.post('/input', ensureAuthenticated, ensureEmployee, projectController.quickInput);





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