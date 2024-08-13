const User = require('../models/user');
const Appointment = require('../models/Appointment');

module.exports = async (req, res) => {
    try {
        const userId = req.session.userId;
        let user = await User.findById(userId);

        const { date } = req.query;
        let appointments = [];
        if (date) {
            appointments = await Appointment.find({ date, isTimeSlotAvailable: true });
        }

        if (user) {
            return res.render('g2', {
                user,
                readOnly: true,
                message: null,
                appointments,
                selectedDate: date
            });
        } else {
            return res.render('g2', {
                user: null,
                readOnly: false,
                message: 'Please fill out the form ',
                appointments,
                selectedDate: date
            });
        }
    } catch (err) {
        res.render('g2', {
            message: 'Oops, Please try again.',
            user: null,
            readOnly: false,
            appointments: [],
            selectedDate: null
        });
    }
};
