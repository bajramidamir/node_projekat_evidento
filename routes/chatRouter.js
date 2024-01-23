const express = require('express');
const router = express.Router();

router.get('/exit_chat', ensureAuthenticated, async (req, res) => {
    const { role } = req.user;
    switch (role) {
        case 'admin':
            res.redirect('/admin_dashboard');
            break;
        case 'employee':
            res.redirect('/employee_dashboard');
            break;
        case 'project manager':
            res.redirect('/project_manager_dashboard');
            break;
        default:
            res.status(403);
            const errorMessage = "Permission denied";
            res.render('fourOhThree', { errorMessage });
    }
});

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

module.exports = router;