const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    dept_id: {type: 'string', required: true},
    active: {type: 'number'},
}, { timestamps: true });

departmentSchema.index({ dept_id: 1 }, { unique: true });
const Department = mongoose.model('department', departmentSchema)
module.exports = Department