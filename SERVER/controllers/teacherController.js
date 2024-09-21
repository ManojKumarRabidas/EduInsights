const {ObjectId} = require('mongodb')
const teacherModel = require("../models/teacher_feedback");
const strengthModel = require ("../models/strength");
const subjectModel = require ("../models/subject");

const areaOfImprovementModel = require('../models/areaofimprovement');

module.exports = {
    teacherFeedback: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.semester_of_rating || !body.date_of_rating || !body.teacher_name || !body.student_name || !body.student_reg_year || !body.department || !body.subject_code || !body.class_participation || !body.homework_or_assignments || !body.quality_of_work || !body.timeliness || !body.problem_solving_skills || !body.behaviour_and_attitude || !body.responsibility || !body.participation_and_engagement || !body.group_work || !body.overall_student_quality || !body.strength_names ||  !body.area_of_improvement_names){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.date_of_rating = new Date(body.date_of_rating);
            body.teacher_id = new ObjectId(body.teacher_name);
            body.subject_id = new ObjectId(body.subject_code);
            body.department_id = new ObjectId(body.department);
            body.student_id = new ObjectId(body.student_name);
            body.semester_of_rating = Number(body.semester_of_rating);
            body.class_participation = Number(body.class_participation);
            body.homework_or_assignments = Number(body.homework_or_assignments);
            body.quality_of_work  = Number(body.quality_of_work );
            body.timeliness = Number(body.timeliness);
            body.problem_solving_skills = Number(body.problem_solving_skills);
            body.behaviour_and_attitude = Number(body.behaviour_and_attitude);
            body.responsibility = Number(body.responsibility);
            body.participation_and_engagement = Number(!body.participation_and_engagement);
            body.group_work = Number(body.group_work);
            body.overall_student_quality = Number (body.overall_student_quality);
            



            // body.createdBy = new ObjectId(req.session.user._id);
            // body.updatedBy = new ObjectId(req.session.user._id);
            
            delete body.teacher_name
            delete body.subject_code
            delete body.department
            delete body.student_name
            const doc = await teacherModel.create(body)

            res.status(201).json({ status: true, msg: "Feedback Recorded successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "not match" });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    
    // getStudentStrenghts: async(req, res)=>{
    //     try {
    //         const docs = await strengthModel.find({active: 1, strength_for:"STUDENT"}).sort({name: 1});
    //         res.status(200).json({ docs: docs });
    //       } catch (error) {
    //         res.status(500).json({ msg: "Failed to retrieve strengths name" });
    //       }
    // },

    getStudentStrenghts: async(req, res)=>{
        try {
            const docs = await strengthModel.find({active: 1, strength_for:"STUDENT"}).sort({name: 1});
            res.status(200).json({ docs: docs });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve strengths name" });
          }
    },

    getAreaForImprovement:async(req, res)=>{
        try {
            const docs = await areaOfImprovementModel.find({active: 1, area_for:"STUDENT"}).sort({name: 1});
            res.status(200).json({ docs: docs });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve strengths name" });
          }
    },
    getSubjectNames:async(req,res)=>{
        try {
            const docs = await subjectModel.find({active: 1, name:"STUDENT"}).sort({name: 1});
            res.status(200).json({ docs: docs });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve subject name" });
          }
    }
    
}