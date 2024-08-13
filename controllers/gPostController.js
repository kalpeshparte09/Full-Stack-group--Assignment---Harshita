const User = require('../models/user');
const Appointment = require("../models/Appointment");

const submitG = async (req, res) => {
    try {
        const { userId } = req.session;
        const { make, model, year, plateNumber } = req.body;

        let user = await User.findById(userId);

        if (!user) {
            return res.render('g', {
                message: 'User not found.',
                user: req.body
            });
        }

        user.car_details = {
            make,
            model,
            year,
            plateNumber
        };

        await user.save();

        return res.render('g', {
            message: 'Car details updated successfully!',
            user: user
        });
    } catch (err) {
        return res.status(500).render('g', {
            message: 'Server Error',
            user: req.body
        });
    }
};

const bookAppointmentG = async (req, res) => {
    const { appointmentId } = req.body;
    const userId = req.session.userId;

    // Validate input data
    if (!appointmentId) {
        req.session.message = "Appointment ID is required";
        return res.redirect('/g');
    }

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            req.session.message = "Appointment not found";
            return res.redirect('/g');
        }

        if (appointment.isTimeSlotAvailable) {
            appointment.isTimeSlotAvailable = false;
            await appointment.save();

            let user = await User.findById(userId);

            if (!user) {
                req.session.message = "User not found";
                return res.redirect('/g');
            }

            user.appointmentId = appointmentId;
            user.testType = 'G';
            await user.save();

            req.session.message = 'Appointment Booked successfully';
            return res.redirect('/g');
        } else {
            req.session.message = 'Time slot not available';
            return res.redirect('/g');
        }
    } catch (error) {
        console.error("Error booking appointment:", error);
        req.session.message = 'Server Error';
        return res.redirect('/g');
    }
};


module.exports = {
    submitG,
    bookAppointmentG
};
