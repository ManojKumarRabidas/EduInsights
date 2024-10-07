const userModel = require("../models/user");
const studentFeedbackModel = require("../models/student_feedback");
const teacherFeedbackModel = require("../models/teacher_feedback");
const {ObjectId} = require('mongodb')
const _ = require('lodash')
module.exports = {
    getTopGrowths: async(req, res)=>{
        try{
            const date = new Date();
            date.setMonth(date.getMonth()-1);
            const prevMonth = date.toLocaleString('default', { month: 'long' });
            const prevYear = date.getFullYear();
            const prevMonthYear = prevMonth.concat(" ", prevYear);
            date.setMonth(date.getMonth()-1);
            const prevPrevMonth = date.toLocaleString('default', { month: 'long' });
            const prevPrevYear = date.getFullYear();
            const prevPrevMonthYear = prevPrevMonth.concat(" ", prevPrevYear);

            // const docs = await studentFeedbackModel.find({month_of_rating: {$in: [prevMonthYear, prevPrevMonthYear]}}, {teacher_id:1,month_of_rating:1, date_of_rating:1, overall_teaching_quality:1})
            const docs = await studentFeedbackModel.aggregate([
                {$match: {month_of_rating: {$in: [prevMonthYear, prevPrevMonthYear]}}}, 
                {$project: {teacher_id:1,month_of_rating:1, date_of_rating:1, overall_teaching_quality:1}},
                {$lookup: {from: "users",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher"}},
                {$unwind: "$teacher"}, 
                {$project: {teacher:"$teacher.name",month_of_rating:1, date_of_rating:1, overall_teaching_quality:1}},
            ])
            // console.log("docs", docs)
            const demoDocs = [
                {
                  _id: new ObjectId("6703aa05140a07c31f1f1644"),
                  month_of_rating: 'August 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 3
                },
                {
                  _id: new ObjectId("6703aac9140a07c31f1f165a"),
                  month_of_rating: 'August 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 5
                },
                {
                  _id: new ObjectId("6703ab8c140a07c31f1f1670"),
                  month_of_rating: 'August 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 3
                },
                {
                  _id: new ObjectId("6703a972140a07c31f1f1636"),
                  month_of_rating: 'September 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 4
                },
                {
                  _id: new ObjectId("6703aaf8140a07c31f1f165c"),
                  month_of_rating: 'September 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 4
                },
                {
                  _id: new ObjectId("6703abb5140a07c31f1f1672"),
                  month_of_rating: 'September 2024',
                  date_of_rating: "2024-10-07T00:00:00.000Z",
                  teacher: 'Subrata Saha',
                  overall_teaching_quality: 4
                }
              ]
            const growthDocDemo = [
                {name: "Subrata Saha", prevMonthAvg: 2.3, prevPrevMonthAvg: 4.3, avgGrowth: 80},
                {name: "Subhendu Saha", prevMonthAvg: 4.2, prevPrevMonthAvg: 4.3, avgGrowth: 10},
                {name: "Abhijit Ghosh", prevMonthAvg: 2.3, prevPrevMonthAvg: 4.3, avgGrowth: 63},
                {name: "Dr. Pintu Pal", prevMonthAvg: 2.3, prevPrevMonthAvg: 4.3, avgGrowth: 43},
                {name: "Tapan Kumar Chatterjee", prevMonthAvg: 2.3, prevPrevMonthAvg: 4.3, avgGrowth: 37},
            ]
            const growthDoc = [];
            for (let i=0; i<docs.length; i++){
                const ref = docs[i];
                const checkExists = _.findIndex(growthDoc, ['name', ref.name]);
                if (checkExists == -1){
                    // const details = {name: ref.name, count: [ref.overall_teaching_quality]}
                    // growthDoc.push(details)
                } else{
                    // growthDoc[checkExists].count.push(ref.overall_teaching_quality)
                }
            }
            res.status(200).json({status: true, doc: docs });
        } catch(err){
            console.log(err)
            res.status(500).json({status: false, msg: "Failed to retrieve top growths" });
        }
    },
    getConditionalUserList: async(req, res)=>{
        try {
            const body = req.body;
            if (!body || !body.userType) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }

            const docs = await userModel.find({user_type: body.userType}, {name:1 , registration_number:1})
            res.status(200).json({status: true, docs: docs });
          } catch (error) {
            res.status(500).json({status: false, msg: "Failed to retrieve student names" });
          }
    },
    getUserFeedbackDetails:async(req, res) => {
        try{
            const body = req.body;
            if (!body || !body._id) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let userId;
            let userType;
            if (req.user.user_type == ("TEACHER" || "STUDENT")){
                userId = new ObjectId(req.user.id);
                userType = req.user.user_type;
            } else{
                userType = body.userType;
            }

            let docs;
            userId = new ObjectId(body._id);
            const currDate = new Date();
            const prev4MonthDate = new Date();
            prev4MonthDate.setMonth(prev4MonthDate.getMonth()-4);
            const prev24MonthDate = new Date()
            prev24MonthDate.setMonth(prev24MonthDate.getMonth()-24);
            if(userType === 'STUDENT'){
                docs = await teacherFeedbackModel.find({student_id: userId, date_of_rating: { $gte: prev24MonthDate, $lte: currDate }}, {createdBy:0,updatedBy:0})
            }else if (userType === 'TEACHER'){
                docs = await studentFeedbackModel.find({teacher_id: userId, date_of_rating: { $gte: prev4MonthDate, $lte: currDate }}, {createdBy:0,updatedBy:0})
            }
            let graphData;
            if (userType== "TEACHER"){
                graphData = {
                    lineGraphData: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                        values: [65, 59, 80, 81, 56, 55],
                    },
                    lastMonthOrSemBarData: {
                        labels: ['Clarity of Explanation', 'Subject Knowledge', 'Encouragement of Question', 'Maintains Discipline', 'Fairness in Treatment', 'Approachability', 'Behaviour and Attitude', 'Encouragement and Support', 'Use of Media', 'Provide Study Material', 'Explain with Supportive Analogy', 'Overall Teaching Quality'],
                        keyLabels: ['clarity_of_explanation', 'subject_knowledge', 'encouragement_of_question', 'maintains_discipline', 'fairness_in_treatment', 'approachability', 'behaviour_and_attitude', 'encouragement_and_support', 'use_of_media', 'provide_study_material', 'explain_with_supportive_analogy', 'overall_teaching_quality'],
                        values: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    lastThreeMonthOrSemBarData: {
                        setNames: [],
                        labels: ['Clarity of Explanation', 'Subject Knowledge', 'Encouragement of Question', 'Maintains Discipline', 'Fairness in Treatment', 'Approachability', 'Behaviour and Attitude', 'Encouragement and Support', 'Use of Media', 'Provide Study Material', 'Explain with Supportive Analogy', 'Overall Teaching Quality'],
                        keyLabels: ['clarity_of_explanation', 'subject_knowledge', 'encouragement_of_question', 'maintains_discipline', 'fairness_in_treatment', 'approachability', 'behaviour_and_attitude', 'encouragement_and_support', 'use_of_media', 'provide_study_material', 'explain_with_supportive_analogy', 'overall_teaching_quality'],
                        values1: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values2: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values3: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    strengths: [],
                    areas_of_improvement: []
                }
    
                const date = new Date();
                date.setMonth(date.getMonth()-1);
                const prevMonth = date.toLocaleString('default', { month: 'long' });
                const prevYear = date.getFullYear();
                const prevMonthYear = prevMonth.concat(" ", prevYear);
    
                date.setMonth(date.getMonth()-1);
                const prevPrevMonth = date.toLocaleString('default', { month: 'long' });
                const prevPrevYear = date.getFullYear();
                const prevPrevMonthYear = prevPrevMonth.concat(" ", prevPrevYear);
    
                date.setMonth(date.getMonth()-1);
                const prevPrevPrevMonth = date.toLocaleString('default', { month: 'long' });
                const prevPrevPrevYear = date.getFullYear();
                const prevPrevPrevMonthYear = prevPrevPrevMonth.concat(" ", prevPrevPrevYear);
                let prevMonthOrSemBarDataBool = 0;
                let prevPrevMonthOrSemBarDataBool = 0;
                let prevPrevPrevMonthOrSemBarDataBool = 0;
                for(let i=0; i<docs.length; i++){
                    const ref = docs[i];
                    if (ref.month_of_rating == prevMonthYear){
                        prevMonthOrSemBarDataBool++;
                        const lastMonthOrSemBarDataLabel= graphData.lastMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastMonthOrSemBarDataLabel[j];
                            graphData.lastMonthOrSemBarData.values[j] = graphData.lastMonthOrSemBarData.values[j]+ref[innerRef]
                        }
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        graphData.lastThreeMonthOrSemBarData.setNames.push(prevMonthYear)
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values1[j] = graphData.lastThreeMonthOrSemBarData.values1[j]+ref[innerRef]
                        }
                    }
                    if (ref.month_of_rating == prevPrevMonthYear){
                        prevPrevMonthOrSemBarDataBool++;
                        graphData.lastThreeMonthOrSemBarData.setNames.push(prevPrevMonthYear)
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values2[j] = graphData.lastThreeMonthOrSemBarData.values2[j]+ref[innerRef]
                        }
                    }
                    if (ref.month_of_rating == prevPrevPrevMonthYear){
                        graphData.lastThreeMonthOrSemBarData.setNames.push(prevPrevPrevMonthYear)
                        prevPrevPrevMonthOrSemBarDataBool++;
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values3[j] = graphData.lastThreeMonthOrSemBarData.values3[j]+ref[innerRef]
                        }
                    }
                    if ((ref.month_of_rating == prevMonthYear) || (ref.month_of_rating == prevPrevMonthYear) || (ref.month_of_rating == prevPrevPrevMonthYear)){
                        if (ref.strengths.length>0){
                            for(let j=0; j<ref.strengths.length; j++){
                                const innerRef = ref.strengths[j];
                                const checkExists = _.findIndex(graphData.strengths, ['key', innerRef]);
                                if (checkExists == -1){
                                    const strength = {key: ref.strengths[j], count: 1}
                                    graphData.strengths.push(strength)
                                } else{
                                    graphData.strengths[checkExists].count = graphData.strengths[checkExists].count+1
                                }
                            }
                        }
                        if (ref.areas_of_improvement.length>0){
                            for(let j=0; j<ref.areas_of_improvement.length; j++){
                                const innerRef = ref.areas_of_improvement[j];
                                const checkExists = _.findIndex(graphData.areas_of_improvement, ['key', innerRef]);
                                if (checkExists == -1){
                                    const area_of_improvement = {key: ref.areas_of_improvement[j], count: 1}
                                    graphData.areas_of_improvement.push(area_of_improvement)
                                } else{
                                    graphData.areas_of_improvement[checkExists].count = graphData.areas_of_improvement[checkExists].count+1
                                }
                            }
                        }
                    }
                }
                for (let j=0; j<graphData.lastMonthOrSemBarData.keyLabels.length; j++){
                    graphData.lastMonthOrSemBarData.values[j] = graphData.lastMonthOrSemBarData.values[j]/prevMonthOrSemBarDataBool
                    graphData.lastThreeMonthOrSemBarData.values1[j] = graphData.lastThreeMonthOrSemBarData.values1[j]/prevMonthOrSemBarDataBool
                }
                for (let j=0; j<graphData.lastThreeMonthOrSemBarData.keyLabels.length; j++){
                    graphData.lastThreeMonthOrSemBarData.values2[j] = graphData.lastThreeMonthOrSemBarData.values2[j] > 0 ? graphData.lastThreeMonthOrSemBarData.values2[j]/prevPrevMonthOrSemBarDataBool: 0;
                }
                for (let j=0; j<graphData.lastThreeMonthOrSemBarData.keyLabels.length; j++){
                    graphData.lastThreeMonthOrSemBarData.values3[j] = graphData.lastThreeMonthOrSemBarData.values3[j] > 0 ? graphData.lastThreeMonthOrSemBarData.values3[j]/prevPrevPrevMonthOrSemBarDataBool: 0;
                }
            } else if (userType == "STUDENT"){
                graphData = {
                    lineGraphData: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                        values: [65, 59, 80, 81, 56, 55],
                    },
                    lastMonthOrSemBarData: {
                        labels: ['class_participation', 'homework_or_assignments', 'quality_of_work', 'timeliness', 'problem_solving_skills', 'behaviour_and_attitude', 'responsibility', 'participation_and_engagement', 'group_work', 'overall_student_quality'],
                        values: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    lastThreeMonthOrSemBarData: {
                        setNames: [],
                        labels: ['class_participation', 'homework_or_assignments', 'quality_of_work', 'timeliness', 'problem_solving_skills', 'behaviour_and_attitude', 'responsibility', 'participation_and_engagement', 'group_work', 'overall_student_quality'],
                        values1: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values2: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values3: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    strengths: [],
                    areas_of_improvement: []
                }
            }
            res.status(200).json({status: true, doc: graphData, docs: docs });
        }
        catch(err){
            res.status(500).json({status: false, msg: "Failed to retrieve user feedback details" });
        }
    }


}    