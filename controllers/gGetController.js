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
            return res.render('g', {
                user,
                message: null,
                appointments,
                selectedDate: date
            });
        } else {
            return res.render('g', {
                user: null,
                appointments,
                selectedDate: date,
                message: 'Please fill out the form'
            });
        }
    } catch (err) {
        res.render('g', {
            message: 'Oops, Please try again.',
            user: null,
            appointments: [],
            selectedDate: null
        });
    }
};
