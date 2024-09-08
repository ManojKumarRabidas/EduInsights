const {ObjectId} = require('mongodb')
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
            const teachers = await userModel.aggregate([
                  {$match: {user_type:"TEACHER"}},
                  {$lookup: {from: "authentications",
                          localField: "_id",
                          foreignField: "user_id",
                          as: "auth"}},
                  {$unwind: "$auth"},
                  {$project: { _id: 1,
                          name: 1,
                          teacher_code: 1,
                          active: "$auth.active"
                        }},
                  {$match: {active:1}},
                ]);
            console.log(teachers);
            res.status(200).json({ teachers: teachers });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve teacher code" });
          }
    },

    getStrengthName: async(req, res)=>{
        try {
            const docs = await strengthModel.find({active: 1, strength_for:"TEACHER"}).sort({name: 1});
            res.status(200).json({ docs: docs });
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
            if (!body.month_of_rating || !body.date_of_rating || !body.teacher_code || !body.subject_code || !body.student_name || !body.clarity_of_explanation || !body.subject_knowledge || !body.encouragement_of_question || !body.maintains_discipline || !body.fairness_in_treatment || !body.approachability || !body.behaviour_and_attitude || !body.encouragement_and_support || !body.overall_teaching_quality || !body.provide_study_material || !body.explain_with_supportive_analogy || !body.use_of_media || !body.strengths || !body.areas_for_improvement){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.date_of_rating = new Date(body.date_of_rating);
            body.teacher_id = new ObjectId(body.teacher_code);
            body.subject_id = new ObjectId(body.subject_code);
            // body.student_id = new ObjectId(body.student_name);
            delete body.teacher_code
            delete body.subject_code
            // delete body.student_name
            // body.createdBy = new ObjectId(req.session.user._id);
            // body.updatedBy = new ObjectId(req.session.user._id);
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