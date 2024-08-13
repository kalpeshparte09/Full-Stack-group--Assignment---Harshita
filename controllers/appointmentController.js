const Appointment = require('../models/Appointment');

exports.getAppointment = async (req, res) => {
    const selectedDate = req.query.date; 

    try {
        // Retrieve appointments for the selected date
        const existingAppointments = await Appointment.find({ date: selectedDate });
        const existingTimes = existingAppointments.map(app => app.time); 

        res.render('appointment', { existingTimes, selectedDate, message: req.query.message });
    } catch (error) {
        console.error(error);
        req.session.alertMessage = 'Error fetching appointments';
        res.redirect('/appointment');
    }
};

exports.createAppointment = async (req, res) => {
    const { date, time } = req.body;

    // Ensure `time` is always an array
    const timesArray = Array.isArray(time) ? time : [time];

    try {
        // Create appointments for each time slot
        const appointments = timesArray.map(t => ({ date, time: t, isTimeSlotAvailable: true }));
        await Appointment.insertMany(appointments);

        // Redirect back to the appointment page with a success message
        res.redirect(`/appointment?date=${date}&message=Appointment Created`);
    } catch (error) {
        console.error(error);
        req.session.alertMessage = 'Error creating appointments';
        res.redirect(`/appointment?date=${date}`);
    }
};
