const mongoose = require ('mongoose');

const student_feedbackSchema = new mongoose.Schema({
    month_of_rating: {type: 'string', required: true},
    date_of_rating: {type: 'date', required: true},
    teacher_id:{type: 'ObjectId', required: true},
    subject_id:{type: 'ObjectId', required: true},
    student_name: {type: 'string', required: true},
    clarity_of_explanation: {type: 'string', required: true},
    subject_knowledge: {type:'string', required: true},
    encouragement_of_question: {type: 'string', required: true},
    maintains_discipline: {type: 'string', required: true}, 
    fairness_in_treatment: {type: 'string', required: true}, 
    approachability: {type: 'string', required: true},
    behaviour_and_attitude: {type: 'string', required: true},
    encouragement_and_support: {type: 'string', required: true},
    overall_teaching_quality: {type: 'string', required: true},
    provide_study_material :{type: 'string', required: true},
    explain_with_supportive_analogy: {type: 'string', required: true},
    use_of_media: {type: 'string', required: true},
    strengths: {type: [String], required: true},
    areas_for_improvement: {type: 'string', required: true},
    additional_comments: {type: 'string'},
    anonymous: {type: 'boolean'},

},{timestamps: true});

const Student_feedback = mongoose.model('student_feedback',student_feedbackSchema)
module.exports = Student_feedback