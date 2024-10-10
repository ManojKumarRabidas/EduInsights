const {ObjectId} = require('mongodb')
const moment = require('moment');
const teacherFeedbackModel = require("../models/teacher_feedback");
const studentFeedbackModel = require("../models/student_feedback");
const subjectModel = require("../models/subject");
const userModel = require("../models/user");
const strengthModel = require("../models/strength");
const areaOfImprovementModel = require("../models/areaofimprovement");

module.exports = {

    getSubjectsCode: async(req, res)=>{
          try {
            const tempUser = req.user;
            const uderId = new ObjectId(tempUser.id)
            const user= await userModel.findOne({_id: uderId}, {department:1})
            if (!user) {
              res.status(404).json({ msg: "User not found" });
              return;
            }
              const subj_code = await subjectModel.find({department:user.department, active: 1}).sort({name: 1});
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
            const improvements_area = await areaOfImprovementModel.find({active: 1, area_for:"TEACHER"}).sort({name: 1});
            res.status(200).json({ improvementarea: improvements_area });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve strengths name" });
          }
    },

    studentFeedback: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.month_of_rating || !body.date_of_rating || !body.teacher_code || !body.subject_code || !body.clarity_of_explanation || !body.subject_knowledge || !body.encouragement_of_question || !body.maintains_discipline || !body.fairness_in_treatment || !body.approachability || !body.behaviour_and_attitude || !body.encouragement_and_support || !body.overall_teaching_quality || !body.provide_study_material || !body.explain_with_supportive_analogy || !body.use_of_media || !body.strengths || !body.areas_of_improvement){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.clarity_of_explanation = Number(body.clarity_of_explanation)
            body.subject_knowledge = Number(body.subject_knowledge)
            body.encouragement_of_question = Number(body.encouragement_of_question)
            body.maintains_discipline = Number(body.maintains_discipline)
            body.fairness_in_treatment = Number(body.fairness_in_treatment)
            body.approachability = Number(body.approachability)
            body.behaviour_and_attitude = Number(body.behaviour_and_attitude)
            body.encouragement_and_support = Number(body.encouragement_and_support)
            body.overall_teaching_quality = Number(body.overall_teaching_quality)
            body.provide_study_material = Number(body.provide_study_material)
            body.explain_with_supportive_analogy = Number(body.explain_with_supportive_analogy)
            body.use_of_media = Number(body.use_of_media)
            body.date_of_rating = new Date(body.date_of_rating);
            body.teacher_id = new ObjectId(body.teacher_code);
            body.subject_id = new ObjectId(body.subject_code);
            body.student_id = new ObjectId(req.user.id);
            delete body.teacher_code
            delete body.subject_code
            delete body.student_name
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const doc = await studentFeedbackModel.create(body)

            res.status(201).json({ status: true, msg: "Feedback Recorded successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Feedback already given to this teacher for current month." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    teachersFeedbackList: async(req, res) =>{
      try {
        let matchCondition = {};
        if (req.user.user_type == "STUDENT"){
          const student_id = new ObjectId(req.user.id);
          matchCondition.student_id = student_id;
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
        const docs = await teacherFeedbackModel.aggregate([
            {$match: matchCondition},
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
                    strengths: 1,
                    areas_of_improvement: 1,
                    additional_comments: 1}}
        ]);
       
        if(docs.length>0){
          for(let i=0; i<docs.length; i++){
            const ref = docs[i];
            ref.date_of_rating = moment(ref.date_of_rating).format('DD/MM/YYYY');
            ref.semester_of_rating = Number(ref.semester_of_rating);
            switch (ref.semester_of_rating) {
              case 1:
                ref.semester_of_rating = "1st";
                break;
              case 2:
                ref.semester_of_rating = "1st";
                break;
              case 3:
                ref.semester_of_rating = "3rd";
                break;
              case 4:
                ref.semester_of_rating = "4th";
                break;
              case 5:
                ref.semester_of_rating = "5th";
                break;
              case 6:
                ref.semester_of_rating = "6th";
                break;
              case 7:
                ref.semester_of_rating = "7th";
                break;
              case 8:
                ref.semester_of_rating = "8th";
                break;
              default:
                ref.semester_of_rating = "N/A";
           }
          } 
        }
        res.status(200).json({ status: true, docs: docs, msg: "Data retrieved" });
      } catch (err) {
          res.status(400).json({ msg: err.message });
      }
    }
}