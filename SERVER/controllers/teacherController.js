const {ObjectId} = require('mongodb')
const moment = require('moment');
const teacherFeedbackModel = require("../models/teacher_feedback");
const studentFeedbackModel = require("../models/student_feedback");
const userModel = require("../models/user");
const strengthModel = require ("../models/strength");
const subjectModel = require ("../models/subject");

const areaOfImprovementModel = require('../models/areaofimprovement');

module.exports = {
    teacherFeedback: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.semester_of_rating || !body.date_of_rating || !body.student_name || !body.student_reg_year || !body.department || !body.subject_code || !body.class_participation || !body.homework_or_assignments || !body.quality_of_work || !body.timeliness || !body.problem_solving_skills || !body.behaviour_and_attitude || !body.responsibility || !body.participation_and_engagement || !body.group_work || !body.overall_student_quality || !body.strengths ||  !body.areas_of_improvement){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.date_of_rating = new Date(body.date_of_rating);
            body.teacher_id = new ObjectId(req.user.id);
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
            body.participation_and_engagement = Number(body.participation_and_engagement);
            body.group_work = Number(body.group_work);
            body.overall_student_quality = Number (body.overall_student_quality);
            



            // body.createdBy = new ObjectId(req.session.user._id);
            // body.updatedBy = new ObjectId(req.session.user._id);
            
            delete body.teacher_name
            delete body.subject_code
            delete body.department
            delete body.student_name
            const doc = await teacherFeedbackModel.create(body)

            res.status(201).json({ status: true, msg: "Feedback Recorded successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "not match" });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    studentsFeedbackList: async(req, res)=>{
      try {
        let matchCondition = {};
        if (req.user.user_type == "TEACHER"){
          const teacher_id = new ObjectId(req.user.id);
          matchCondition.teacher_id = teacher_id;
        } else{
          //
        }
        if (!req.body || !req.body.startDate || !req.body.endDate){
          res.status(500).json({ msg: "Date of ratting is mandetory" });
        }
        const startDate = new Date(req.body.startDate)
        const endDate = new Date(req.body.endDate)
        if (endDate < startDate) {
          return res.status(400).json({ msg: "End date cannot be before start date" });
        }
        const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        if (monthDiff > 6) {
          return res.status(400).json({ msg: "The date range cannot exceed 6 months" });
        }
        matchCondition.date_of_rating = { $gte: startDate, $lte: endDate };
        const docs = await studentFeedbackModel.aggregate([
            {$match: matchCondition},
            {$lookup: {from: "users",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher"}},
            {$unwind: "$teacher"}, 
             
            {$lookup: {from: "users",
								let: {student_id: "$student_id"},
								pipeline: [{$match: {$expr: {$eq: ["$_id", "$$student_id"]}}},
									{$lookup: {from: "departments",
											let: {departmentId: "$department"},
											pipeline: [{$match: {$expr: {$eq: ["$_id", "$$departmentId"]}}},
												{$project: {dept_id: 1, name: 1, _id: 0}}],
											as: "department"}},
                  {$unwind: {path: "$department", preserveNullAndEmptyArrays: true}}],
								as: "student"}},
            {$unwind: {path: "$student", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: "subjects",
                    localField: "subject_id",
                    foreignField: "_id",
                    as: "subject"}},
            {$unwind: "$subject"}, 
            
            {$project: { 
                    month_of_rating: 1,
                    date_of_rating: 1,
                    teacher: "$teacher.name",
                    subject: "$subject.subject_code",
                    student: "$student.name",
                    student_reg_year: "$student.registration_year",
                    department: "$student.department.dept_id",
                    clarity_of_explanation: 1, 
                    subject_knowledge: 1,
                    encouragement_of_question: 1,
                    maintains_discipline: 1,
                    fairness_in_treatment: 1,
                    approachability: 1,
                    behaviour_and_attitude: 1,
                    encouragement_and_support: 1,
                    overall_teaching_quality: 1,
                    provide_study_material: 1,
                    explain_with_supportive_analogy: 1,
                    use_of_media: 1,
                    strengths: 1,
                    areas_of_improvement: 1,
                    additional_comments: 1}}
        ]);
        if(docs.length>0){
          for(let i=0; i<docs.length; i++){
            const ref = docs[i];
            ref.date_of_rating = moment(ref.date_of_rating).format('DD/MM/YYYY');
          } 
        }
        res.status(200).json({ status: true, docs: docs, msg: "Data retrieved" });
      } catch (err) {
        console.log(err);
          res.status(400).json({ msg: err.message });
      }
    
    },
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