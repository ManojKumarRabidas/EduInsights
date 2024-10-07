const mongoose = require ('mongoose');

const teacher_feedbackSchema = new mongoose.Schema({
    semester_of_rating: {type: 'number', required: true},
    date_of_rating: {type: 'date', required: true},
    teacher_id:{type: 'ObjectId', required: true},
    student_id: {type: 'ObjectId', required: true},
    student_reg_year: {type: 'number', required: true},
    department_id: {type:'ObjectId', required: true},
    subject_id: {type: 'ObjectId', required: true},
    class_participation: {type: 'number', required: true}, 
    homework_or_assignments: {type: 'number', required: true}, 
    quality_of_work: {type: 'number', required: true},
    timeliness: {type: 'number', required: true},
    problem_solving_skills: {type: 'number', required: true},
    behaviour_and_attitude: {type: 'number', required: true},
    responsibility :{type: 'number', required: true},
    participation_and_engagement: {type: 'number', required: true},
    group_work: {type: 'number', required: true},
    overall_student_quality: {type: 'number', required: true},
    strengths: {type: [String], required: true},
    areas_of_improvement: {type: [String], required: true},
    additional_comments: {type: 'string'},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}

},{timestamps: true});

teacher_feedbackSchema.index({ semester_of_rating:1, teacher_id: 1, student_id: 1 }, { unique: true });
const Teacher_feedback = mongoose.model('teacher_feedback',teacher_feedbackSchema)
module.exports = Teacher_feedback