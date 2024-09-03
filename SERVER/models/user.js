const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_type: {type: 'string', required: true},
    teacher_code: {type: 'string'},
    employee_id: {type: 'string'},
    department: {type: 'string'},
    registration_year: {type: 'number'},
    registration_number: {type: 'string', required: true},
    name: {type: 'string', required: true},
    phone: {type: 'number', required: true},
    email: {type: 'string', required: true},
    address: {type: 'string', required: true},
    pin: {type: 'number', required: true},
    login_id: {type: 'string', required: true},
    password: {type: 'string', required: true},
}, { timestamps: true });

userSchema.index({ login_id: 1 }, { unique: true });
const User = mongoose.model('user', userSchema)
module.exports = User