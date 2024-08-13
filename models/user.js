const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Username: { type: String, required: [true,'Enter Username'], unique: true },
    Password: { type: String, required: [true,'Enter Password.'] },
    UserType: { type: String, required: [true,'Select user type.'] },
    firstName: { type: String },
    lastName: { type: String },
    licenseNumber: { type: String, sparse: true}, 
    age: { type: Number },
    dob: { type: Date },
    car_details: {
        make: { type: String },
        model: { type: String },
        year: { type: Number },
        plateNumber: { type: String }
    },
    appointmentId:{ type: String },
    testType: { type: String, enum: ['G2', 'G'] },
    comment: { type: String},
    pass: { type: String},
    
});

UserSchema.plugin(uniqueValidator);
const User = mongoose.model("UserInfo", UserSchema);
module.exports = User;
