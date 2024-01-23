const bcrypt = require('bcrypt');
const cookie = require('cookie');
const userModel = require('../models/userModel');


const getHashedPassword = async (password) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.getUserByUsername(username);
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const userCookie = cookie.serialize('user', JSON.stringify({
                        id: user.user_id,
                        username: user.username,
                        role: user.role,
                        firstName: user.first_name,
                        lastName: user.last_name,
                    }));

                    res.setHeader('Set-Cookie', userCookie);

                    if (user.role === 'admin') {
                        res.redirect('/admin_dashboard');
                    } else if (user.role === 'employee') {
                        res.redirect('/employee_dashboard');
                    } else if (user.role === 'project manager') {
                        res.redirect('/project_manager_dashboard');
                    }
                };
            }); 
        } else {
            const errorMessage = "Incorrect username/password. Please try again."
            res.render('loginSignup', { errorMessage });
        };
    } catch (err) {
        console.error(err);
    };
};

const createUser = async (req, res) => {
    const { username, password, email, firstName, lastName, role } = req.body;
    try {
        const hashedPassword = await getHashedPassword(password);
        await userModel.insertUser(username, hashedPassword, role, firstName, lastName, email);
        res.redirect('/admin_dashboard/users');
    } catch (error) {
        console.error(error);
        const errorMessage = "Error creating user"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    }
};

const deleteUser = async (req, res) => {
    const { username } = req.body;
    try {
        await userModel.deleteUserByUsername(username);
        res.redirect('/admin_dashboard/users');
    } catch (error) {
        console.error(error);
        const errorMessage = "Error deleting user!"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};

const updateUser = async (req, res) => {
    const { username, newUsername, newRole } = req.body;
    try {
        await userModel.updateUser(username, newUsername, newRole);
        res.redirect('/admin_dashboard/users');
    } catch (error) {
        console.error(error);
        const errorMessage = "Error updating user!"
        res.status(500);
        res.render('fiveHundred', { user: req.user, errorMessage });
    };
};


module.exports = {
    loginUser,
    createUser,
    deleteUser,
    updateUser
};