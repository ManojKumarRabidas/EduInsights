const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject_code: {type: 'string', required: true},
    name: {type: 'string', required: true},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    active: {type: 'number'},
}, { timestamps: true });

subjectSchema.index({ subject_code: 1 }, { unique: true });
const Subject = mongoose.model('subject', subjectSchema)
module.exports = Subject