const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = async (req, res) => {
    const { userName, password, confirmPassword, userType } = req.body;

    // Basic validation for required fields
    if (!userName || !password || !confirmPassword || !userType) {
        res.locals.error = 'All fields are required.';
        return res.render('signup');
    }

    // Validation for Username
    if (!/^[a-zA-Z0-9]{5,12}$/.test(userName)) {
        res.locals.error = 'Username must be alphanumeric and between 5 and 12 characters.';
        return res.render('signup');
    }

    // Validation for Password
    if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(password)) {
        res.locals.error = 'Password must be at least 8 characters and should contain at least 1 number, and 1 special character.';
        return res.render('signup');
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        res.locals.error = 'Passwords do not match.';
        return res.render('signup');
    }

    try {
        // Check if username already exists
        const existingUserByUsername = await User.findOne({ Username: userName });
        if (existingUserByUsername) {
            res.locals.error = 'Username already exists. Try with a different username.';
            return res.render('signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            Username: userName,
            Password: hashedPassword,
            UserType: userType
        });

        // Save the user to the database
        await newUser.save();

        // Success message
        res.locals.success = 'Signup successfully completed. Please login.';
        return res.render('signup');
    } catch (err) {
        console.error("Error during signup:", err);
        res.locals.error = 'Please try again later.';
        return res.render('signup');
    }
};
