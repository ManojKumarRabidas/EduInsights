const teacherModel = require("../models/teacher_feedback");
const bcrypt = require ('bcryptjs');
const { subjectDetails } = require("./adminController");

module.exports = {
    teacherFeedback: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.semester_of_rating || !body.date_of_rating || !body.teacher_name || !body.student_name || !body.student_reg_no || !body.department || !body.subject_code || !body.class_participation || !body.homework_or_assignments || !body.quality_of_work || !body.timeliness || !body.problem_solving_skills || !body.behaviour_and_attitude || !body.responsibility || !body.participation_and_engagement || !body.group_work || !body.overall_student_quality || !body.strength_names || !body.area_of_improvement_names || !body.additional_comments){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            console.log(body);
            // const doc = await teacherModel.create({ semester_of_rating: body.semester_of_rating, date_of_rating: body.date_of_rating, teacher_name: body.teacher_name, student_name: body.student_name,  student_reg_no: body.student_reg_no,department: body.department, subject_code: body.subject_code,class_participation: body.class_participation, homework_or_assignments: body.homework_or_assignments, quality_of_work: body.quality_of_work, timeliness: body.timeliness, problem_solving_skills: body.problem_solving_skills, behaviour_and_attitude: body.behaviour_and_attitude, responsibility: body.responsibility, participation_and_engagement: body.participation_and_engagement, group_work: body.group_work, overall_student_quality: body.overall_student_quality, strength_names: body.strength_names,area_of_improvement_names: body.area_of_improvement_names,additional_comments: body.additional_comments});
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

    
}