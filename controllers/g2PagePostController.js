const bcrypt = require('bcrypt');
const userInfo = require("../models/user");
const Appointment = require("../models/Appointment");

const submitG2 = async (req, res) => {
    const userId = req.session.userId;
    const { firstName, lastName, licenseNumber, dob, age, make, model, year, plateNumber } = req.body;

    if (!firstName || !lastName || !licenseNumber || !dob || !age || !make || !model || !year || !plateNumber) {
        req.session.alertMessage = "All fields are required";
        return res.redirect('/g2');
    }

    try {
        const user = await userInfo.findById(userId);
        if (!user) {
            req.session.alertMessage = "User not found";
            return res.redirect('/g2');
        }

        const users = await userInfo.find();
        for (let existingUser of users) {
            if (existingUser._id.toString() !== userId.toString() && existingUser.licenseNumber) {
                const match = await bcrypt.compare(licenseNumber, existingUser.licenseNumber);
                if (match) {
                    req.session.alertMessage = "License number already in use by another user";
                    return res.redirect('/g2');
                }
            }
        }

        const hashedLicenseNumber = await bcrypt.hash(licenseNumber, 10);

        user.firstName = firstName;
        user.lastName = lastName;
        user.licenseNumber = hashedLicenseNumber;
        user.dob = dob;
        user.age = age;
        user.car_details.make = make;
        user.car_details.model = model;
        user.car_details.year = year;
        user.car_details.plateNumber = plateNumber;

        await user.save();
        req.session.alertMessage = 'User Details Submitted successfully';
        res.redirect('/g2');
    } catch (err) {
        console.error("Error updating user details:", err);
        req.session.alertMessage = 'Error updating user details';
        res.redirect('/g2');
    }
};

const bookAppointment = async (req, res) => {
    const { appointmentId } = req.body;
    const userId = req.session.userId;

    if (!appointmentId) {
        req.session.alertMessage = "Appointment ID is required";
        return res.redirect('/g2');
    }

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            req.session.alertMessage = "Appointment not found";
            return res.redirect('/g2');
        }

        if (appointment.isTimeSlotAvailable) {
            appointment.isTimeSlotAvailable = false;
            await appointment.save();

            let user = await userInfo.findById(userId);
            if (!user) {
                req.session.alertMessage = "User not found";
                return res.redirect('/g2');
            }

            user.appointmentId = appointmentId;
            user.testType = 'G2';
            await user.save();

            req.session.alertMessage = 'Appointment Booked successfully';
            res.redirect('/g2');
        } else {
            req.session.alertMessage = 'Time slot not available';
            res.redirect('/g2');
        }
    } catch (error) {
        console.error("Error booking appointment:", error);
        req.session.alertMessage = 'Server Error';
        res.redirect('/g2');
    }
};


module.exports = {
    submitG2,
    bookAppointment
};
