const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    registration_year: {type: 'number', required: true},
    department: {type: 'ObjectId', required: true},
    duration: {type: 'number', required: true},
    sessionStartDate: {type: 'date'},
    // start_date_1st_sem: {type: 'date', required: true},
    // end_date_1st_sem: {type: 'date', required: true},
    // start_date_2nd_sem: {type: 'date'},
    // end_date_2nd_sem: {type: 'date'},
    // start_date_3rd_sem: {type: 'date'},
    // end_date_3rd_sem: {type: 'date'},
    // start_date_4th_sem: {type: 'date'},
    // end_date_4th_sem: {type: 'date'},
    // start_date_5th_sem: {type: 'date'},
    // end_date_5th_sem: {type: 'date'},
    // start_date_6th_sem: {type: 'date'},
    // end_date_6th_sem: {type: 'date'},
    // start_date_7th_sem: {type: 'date'},
    // end_date_7th_sem: {type: 'date'},
    // start_date_8th_sem: {type: 'date'},
    // end_date_8th_sem: {type: 'date'},
    semesters: {type: [Object]},
    active: {type: 'number'},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
}, { timestamps: true });

sessionSchema.index({ registration_year: 1, department:1  }, { unique: true });
const Session = mongoose.model('academic_session', sessionSchema)
module.exports = Session