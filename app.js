const SERVER_PORT = 3000;
const express = require('express');
const session = require('express-session');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

// models
const chatModel = require('./models/chatModel');

// routes
const loginRouter = require('./routes/loginRouter');
const adminRouter = require('./routes/adminRouter');
const employeeRouter = require('./routes/employeeRouter');
const projectManagerRouter = require('./routes/projectManagerRouter');

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret1512',
    resave: false,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use(ejsLayouts);
app.set('layout', false);

app.use('/', loginRouter);
app.use('/admin_dashboard', adminRouter);
app.use('/employee_dashboard', employeeRouter);
app.use('/project_manager_dashboard', projectManagerRouter);


// view engine
app.set('view engine', 'ejs');

// Socket.io
io.on('connection', (socket) => {
    socket.on('chatMessage', async (message) => {
        io.emit('chatMessage', {
            username: message.username,
            content: message.content,
        });
        try {
            await chatModel.storeMessage(message.username, message.content);
        } catch (error) {
            console.error('Error storing message in the database:', error);
        };
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


httpServer.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
