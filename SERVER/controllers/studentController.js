const studentModel = require("../models/student_feedback");
const subjectModel = require("../models/subject");
const userModel = require("../models/user");
const strengthModel = require("../models/strength");
const areaOfImprovementModel = require("../models/areaofimprovement");
const bcrypt = require ('bcryptjs');

module.exports = {

    getSubjectsCode: async(req, res)=>{
        try {
            const subj_code = await subjectModel.find({active: 1}).sort({name: 1});
            // res.json({ departments });
            res.status(200).json({ subjects: subj_code });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve subject code" });
          }
    },

    getTeachersCode: async(req, res)=>{
        try {
            const teachers = await userModel.find({active: 1, user_type:"TEACHER"}).sort({name: 1});
            console.log(teachers);
            res.status(200).json({ teachers: teachers });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve teacher code" });
          }
    },

    getStrengthName: async(req, res)=>{
        try {
            const strength_name = await strengthModel.find({active: 1, strength_for:"TEACHER"}).sort({name: 1});
            // res.json({ departments });
            res.status(200).json({ strengthsname: strength_name });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve strengths name" });
          }
    },

    getImprovementArea: async(req, res)=>{
        try {
            const improvement_area = await areaOfImprovementModel.find({active: 1, area_for:"TEACHER"}).sort({name: 1});
            // res.json({ departments });
            res.status(200).json({ improvementarea: improvement_area });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve strengths name" });
          }
    },

    studentFeedback: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.month_of_rating || !body.date_of_rating || !body.teacher_code || !body.subject_code || !body.student_name || !body.clarity_of_explanation || !body.subject_knowledge || !body.encouragement_of_question || !body.maintains_discipline || !body.fairness_in_treatment || !body.approachability || !body.behaviour_and_attitude || !body.encouragement_and_support || !body.overall_teaching_quality || !body.provide_study_material || !body.explain_with_supportive_analogy || !body.use_of_media || !body.strength_of_teacher || !body.areas_for_improvement){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            console.log(body);
            const doc = await studentModel.create(body)

            res.status(201).json({ status: true, msg: "Feedback Recorded successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "not match" });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
}