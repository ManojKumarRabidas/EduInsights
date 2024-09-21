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
    },
    teachersFeedbackList: async(req, res) =>{
      try {
        if (!req.body || !req.body.student_id){
          res.status(400).json({ msg: "Missing Parameters!" });
          return;
        }
        const student_id = new ObjectId(req.body.student_id);
        const docs = await teacherModel.aggregate([
            {$match: {student_id: student_id}},
            {$lookup: {from: "users",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher"}},
            {$unwind: "$teacher"}, 
            
            {$lookup: {from: "departments",
                    localField: "department_id",
                    foreignField: "_id",
                    as: "department"}},
            {$unwind: "$department"}, 
            
            {$lookup: {from: "users",
                    localField: "student_id",
                    foreignField: "_id",
                    as: "student"}},
            {$unwind: "$student"}, 
            
            {$lookup: {from: "subjects",
                    localField: "subject_id",
                    foreignField: "_id",
                    as: "subject"}},
            {$unwind: "$subject"}, 
            
            {$project: { 
                    semester_of_rating: 1,
                    date_of_rating: 1,
                    teacher: "$teacher.name",
                    student: "$student.name",
                    student_reg_year: 1, 
                    department: "$department.dept_id",
                    subject: "$subject.subject_code",
                    class_participation: 1,
                    homework_or_assignments: 1,
                    quality_of_work: 1,
                    timeliness: 1,
                    problem_solving_skills: 1,
                    behaviour_and_attitude: 1,
                    responsibility: 1,
                    participation_and_engagement: 1,
                    group_work: 1,
                    overall_student_quality: 1,
                    strength_names: 1,
                    area_of_improvement_names: 1,
                    additional_comments: 1}}
        ]);
        // if(docs.length>0){
        //     for(let i=0; i<docs.length; i++){
        //         const val = docs[i].is_verified == 1 ?  "Verified": ( docs[i].is_verified == 0 ?  "Not Verified": "Rejected");
        //         const val2 = docs[i].registration_number == null ? "N/A": (docs[i].registration_number == ""? "N/A": docs[i].registration_number);
        //         const val3 = docs[i].registration_year == null ? "N/A": (docs[i].registration_year == ""? "N/A": docs[i].registration_year);
        //         docs[i].is_verified = val;
        //         docs[i].registration_number = val2;
        //         docs[i].registration_year = val3;
        //     }
        // }
        console.log(docs);
        res.status(200).json({ docs: docs });
    } catch (err) {
      console.log(err);
        res.status(400).json({ msg: err.message });
    }
    }
    
}