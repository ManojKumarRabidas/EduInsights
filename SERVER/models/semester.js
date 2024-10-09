const mongoose = require ('mongoose');

const semesterSchema = new mongoose.Schema({
    department: {type: 'string', required: true},
    registration_year: {type: 'string', required: true},
    active: {type: 'number'},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
},{ timestamps: true });

semesterSchema.index({ department: 1, registration_year: 1}, {unique: true});
const SemesterModel = mongoose.model('semester',semesterSchema)
module.exports = SemesterModel

