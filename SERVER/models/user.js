const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_type: {type: 'string', required: true},
    teacher_code: {type: 'string'},
    employee_id: {type: 'string'},
    specialization: {type: 'string'},
    department: {type: 'ObjectId'},
    registration_year: {type: 'number'},
    registration_number: {type: 'string'},
    name: {type: 'string', required: true},
    phone: {type: 'number', required: true},
    email: {type: 'string', required: true},
    address: {type: 'string', required: true},
    pin: {type: 'number', required: true},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model('user', userSchema)
module.exports = User