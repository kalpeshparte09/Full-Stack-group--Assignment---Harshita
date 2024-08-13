const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const userInfo = require("./models/user"); 

const dashboardController = require('./controllers/dashboardController');
const gGetController = require('./controllers/gGetController');
const gPostController = require('./controllers/gPostController');
const g2PageGetController = require('./controllers/g2PageGetController.js');
const g2PagePostController = require('./controllers/g2PagePostController.js');
const loginController = require('./controllers/loginController');
const loginPostController = require('./controllers/loginPostController');
const signupController = require('./controllers/signUpController');
const signupPostController = require('./controllers/signUpPostController');
const pageNotFoundController = require('./controllers/pageNotFoundController');
const logoutController = require('./controllers/logoutController');
const appointmentController = require('./controllers/appointmentController');
const examinerController = require('./controllers/examinerController.js');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const requireLogin = require('./middleware/requireLogin');
const adminGetDriverController = require('./controllers/adminGetDriverController');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use Session middleware
app.use(sessionMiddleware);

// Session middleware
app.use(sessionMiddleware);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
const connectionString ='mongodb+srv://harshitavaghasiya27:qnPaeWMo1mnAZTB8@cluster0.oggsjjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Custom middleware to check login state and user type
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId;

    if (req.session.userId) {
        userInfo.findById(req.session.userId)
            .then(user => {
                res.locals.userType = user ? user.UserType : null;
                next();
            })
            .catch(err => {
                console.error('Error retrieving user:', err);
                res.locals.userType = null;
                next();
            });
    } else {
        res.locals.userType = null;
        next();
    }
});

app.get('/dashboard', dashboardController.dashboard);
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});
app.get('/g', requireLogin, gGetController);
app.post('/g', requireLogin, gPostController.submitG);
app.get('/g2', requireLogin, g2PageGetController);
app.post('/g2', requireLogin, g2PagePostController.submitG2);
app.get('/login', loginController.login);
app.post('/login', loginPostController);
app.get('/signup', signupController.signup);
app.post('/signup', signupPostController);
app.get('/logout', logoutController);
app.get('/appointment', requireLogin, appointmentController.getAppointment);
app.post('/appointment', requireLogin, appointmentController.createAppointment);
app.get('/G2_page', requireLogin, g2PageGetController);
app.post('/G2_page/book', requireLogin, g2PagePostController.bookAppointment);
app.post('/G_page/book', requireLogin, gPostController.bookAppointmentG);
app.get('/examiner', requireLogin, examinerController.getExaminersPage);
app.post('/examiner/:id', requireLogin, examinerController.updateTestResult);
app.get('/candidates', adminGetDriverController.getCandidates);
app.get('*', pageNotFoundController);

// Start server
app.listen(3000, () => {
    console.log(`Server is running on port 3000 for Drive Test Kiosk.`);
});
