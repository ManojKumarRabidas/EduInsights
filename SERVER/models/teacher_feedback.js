const mongoose = require ('mongoose');

const teacher_feedbackSchema = new mongoose.Schema({
    semester_of_rating: {type: 'string', required: true},
    date_of_rating: {type: 'string', required: true},
    teacher_name:{type: 'string', required: true},
    student_name: {type: 'string', required: true},
    student_reg_no: {type: 'string', required: true},
    department: {type:'string', required: true},
    subject_code: {type: 'string', required: true},
    class_participation: {type: 'string', required: true}, 
    homework_or_assignments: {type: 'string', required: true}, 
    quality_of_work: {type: 'string', required: true},
    timeliness: {type: 'string', required: true},
    problem_solving_skills: {type: 'string', required: true},
    behaviour_and_attitude: {type: 'string', required: true},
    responsibility :{type: 'string', required: true},
    participation_and_engagement: {type: 'string', required: true},
    group_work: {type: 'string', required: true},
    overall_student_quality: {type: 'string', required: true},
    strength_names: {type: 'string', required: true},
    area_of_improvement_names: {type: 'string', required: true},
    additional_comments: {type: 'string'},

},{timestamps: true});


const Teacher_feedback = mongoose.model('teacher_feedback',teacher_feedbackSchema)
module.exports = Teacher_feedback