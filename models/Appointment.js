// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: String,
    time: String,
    isTimeSlotAvailable: Boolean
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
