const {ObjectId} = require('mongodb')

const teacherModel = require("../models/teacher_feedback");
const bcrypt = require ('bcryptjs');
const userModel = require("../models/user");
const strengthModel = require ("../models/strength")

const { subjectDetails } = require("./adminController");
const areaOfImprovementModel = require('../models/areaofimprovement');

module.exports = {
    teacherFeedback: async(req, res)=>{
        try {
            const body = req.body;
            console.log(req.body)
            if (!body.semester_of_rating || !body.date_of_rating || !body.teacher_name || !body.student_name || !body.student_reg_year || !body.department || !body.subject_code || !body.class_participation || !body.homework_or_assignments || !body.quality_of_work || !body.timeliness || !body.problem_solving_skills || !body.behaviour_and_attitude || !body.responsibility || !body.participation_and_engagement || !body.group_work || !body.overall_student_quality || !body.strength_names ||  !body.area_of_improvement_names){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.date_of_rating = new Date(body.date_of_rating);
            // body.teacher_id = new ObjectId(body.teacher_name);
            body.subject_id = new ObjectId(body.subject_code);
            body.department_id = new ObjectId(body.department);
            body.student_id = new ObjectId(body.student_name);
            body.teacher_id = body.teacher_name;
            
            
            // delete body.teacher_name
            delete body.subject_code
            delete body.department
            delete body.student_name
            console.log(body);
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

    
}