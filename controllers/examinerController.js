const User = require('../models/user');

exports.getExaminersPage = async (req, res) => {
    const testType = req.query.testType || '';
   

    try {
        let users = [];
        // Fetch users only if testType is not empty
        if (testType) {
            users = await User.find({ testType, pass: { $exists: false } });
        }

        // Render the template with the users and selectedTestType
        res.render('examiner', { users, selectedTestType: testType });
        
    } catch (err) {
        console.error('Error fetching users:', err);
        req.session.alertMessage = 'Error fetching users';
        res.redirect('/examiner');
    }
};

exports.updateTestResult = async (req, res) => {
    const { id } = req.params;
    const { comment, pass } = req.body;

    try {
        const result = pass === 'true' ? 'Yes' : 'No';
        
        await User.findByIdAndUpdate(id, { comment, pass: result });
        req.session.alertMessage = 'Test result updated successfully';
        res.redirect('/examiner');
    } catch (err) {
        console.error('Error updating test result:', err);
        req.session.alertMessage = 'Error updating test result';
        res.redirect('/examiner');
    }
};
