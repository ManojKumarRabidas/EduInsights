const mongoose = require ('mongoose');

const student_feedbackSchema = new mongoose.Schema({
    month_of_rating: {type: 'string', required: true},
    date_of_rating: {type: 'date', required: true},
    teacher_id:{type: 'ObjectId', required: true},
    subject_id:{type: 'ObjectId', required: true},
    student_id: {type: 'ObjectId', required: true},
    clarity_of_explanation: {type: 'number', required: true},
    subject_knowledge: {type:'number', required: true},
    encouragement_of_question: {type: 'number', required: true},
    maintains_discipline: {type: 'number', required: true}, 
    fairness_in_treatment: {type: 'number', required: true}, 
    approachability: {type: 'number', required: true},
    behaviour_and_attitude: {type: 'number', required: true},
    encouragement_and_support: {type: 'number', required: true},
    overall_teaching_quality: {type: 'number', required: true},
    provide_study_material :{type: 'number', required: true},
    explain_with_supportive_analogy: {type: 'number', required: true},
    use_of_media: {type: 'number', required: true},
    strengths: {type: [String], required: true},
    improvements_area: {type: [String], required: true},
    additional_comments: {type: 'string'},
    anonymous: {type: 'boolean'},

},{timestamps: true});

student_feedbackSchema.index({ month_of_rating:1, teacher_id: 1, student_id: 1 }, { unique: true });
const Student_feedback = mongoose.model('student_feedback',student_feedbackSchema)
module.exports = Student_feedback