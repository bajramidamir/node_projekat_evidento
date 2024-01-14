const SERVER_PORT = 3000;
const express = require('express');
const session = require('express-session');
const app = express();
const httpServer = require('http').createServer(app); // Use httpServer for socket.io
const io = require('socket.io')(httpServer); // Initialize socket.io with httpServer
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

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

// view engine
app.set('view engine', 'ejs');

// routes
app.use('/', loginRouter);
app.use('/admin_dashboard', adminRouter);
app.use('/employee_dashboard', employeeRouter);
app.use('/project_manager_dashboard', projectManagerRouter);

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events when a user sends a message
    socket.on('chatMessage', (message) => {
        // Broadcast the message to all connected clients
        io.emit('chatMessage', message);
    });

    // Handle other events as needed

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use httpServer to listen instead of app directly
httpServer.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
