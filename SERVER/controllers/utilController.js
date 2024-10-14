const userModel = require("../models/user");
const authModel = require("../models/authentication");
const studentFeedbackModel = require("../models/student_feedback");
const teacherFeedbackModel = require("../models/teacher_feedback");
const sessionModel = require("../models/session");
const {ObjectId} = require('mongodb')
const bcrypt = require('bcryptjs');
const _ = require('lodash')
const nodemailer = require("nodemailer");
module.exports = {
    forgotPasswordSendOtp: async(req, res)=>{
        try{
            const userId = new ObjectId(req.user.id);
            const newOtp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const otpDetails={otp: newOtp, generateAt: new Date(), expireAt: new Date()}
            const setOtp = await authModel.findOneAndUpdate({user_id: userId}, {$set: {otpDetails: otpDetails}}, {upsert: true, returnNewDocument: true});
            if (!setOtp._id){
                res.status(400).json({ msg: "Fail to generate and set otp! Please try again later." });
                return;
            }
            // ----------------------------------------------------
            // -----------------Process 1--------------------------
            // var transport = nodemailer.createTransport({
            //     // host: "sandbox.smtp.mailtrap.io",
            //     // port: 2525,
            //     // auth: {
            //     // user: "7489d4bd3a0ecd",
            //     // pass: "f784d841493174"
            //     // }
            //     host: 'smtp.ethereal.email',
            //     port: 587,
            //     auth: {
            //         user: 'natalie.batz52@ethereal.email',
            //         pass: 'b6nAWpSP2vJdZaY6KC'
            //     }
            // });

            // const user = await userModel.findById(new ObjectId(req.user.id));
            // if(!user || !user.email){
            //     res.status(400).json({ msg: "Email Id not found!" });
            // }
            // const info = await transport.sendMail({
            //     from: '"EduInsight Support" <support@eduinsight.in>', // sender address
            //     to: `${user.email}`, // list of receivers
            //     subject: "Hello ✔", // Subject line
            //     text: "Hello world?", // plain text body
            //     html: "<b>Hello world?</b>", // html body
            //   });
            
            //   console.log("Message sent: %s", info.messageId);
            //   if(!info.messageId){
            //     res.status(400).json({ msg: "Fail to send mail!" });
            //   }

            // -------------------------------------------------
            // --------------------Process 2--------------------
            // const Nodemailer = require("nodemailer");
            // const { MailtrapTransport } = require("mailtrap");

            // const TOKEN = "d501ea049eb51d754cb8fd9c260fb43d";

            // const transport = Nodemailer.createTransport(
            // MailtrapTransport({
            //     token: TOKEN,
            //     testInboxId: 3185983,
            // })
            // );

            // const sender = {
            // address: "hello@example.com",
            // name: "Mailtrap Test",
            // };
            // const recipients = [
            // "manojkumarrabidas00@gmail.com",
            // ];

            // transport
            // .sendMail({
            //     from: sender,
            //     to: recipients,
            //     subject: "OTP for Forgot Password || EduInsight Support Team",
            //     text: `Hello ${req.user.name}. 
            //             Your OTP for verify is: ${newOtp}.
            //             The above OTP will be valid for next 5 mint.
            //             Don't share your OTP with anyone.`,
            //     category: "Integration Test",
            //     sandbox: true
            // })
            // .then(console.log, console.error);
            
            res.status(200).json({status: true, msg: `Mail send to your registered email id. Your OTP is ${newOtp}`});
        }catch(err){
            console.log("err", err)
            res.status(500).json({status: false, msg: "Failed to send mail due to some technical problem. Please try again later." });
        }
    },
    forgotPasswordCheckOtp: async(req, res)=>{
        try{
            if(!req.body || !req.body.otp){
                res.status(400).json({ msg: "Please enter OTP first." });
                return;
            }
            req.body.otp = parseInt(req.body.otp)
            if(_.isNaN(req.body.otp)){
                res.status(400).json({ msg: "Invalid type input for OTP." });
                return;
            }
            const userId = new ObjectId(req.user.id);
            const doc= await authModel.findOne({user_id: userId},{otpDetails: 1});
            if(!doc || !doc.otpDetails){
                res.status(400).json({ status: false, msg: "Unable to check otp duw to some technocal problem! Please resend OTP and try again." });
                return;
            }
            if(doc.otpDetails.otp != req.body.otp){
                res.status(400).json({ status: false, msg: "Invalid OTP! Please try again." });
                return;
            }
            res.status(200).json({status: true, msg: "Validation sucessfull. Please set a new password."});
        }catch(err){
            res.status(500).json({status: false, msg: "Failed to send mail due to some technical problem. Please try again later." });
        }
    },
    forgotPasswordChangePassword: async(req, res)=>{
        try{
            if(!req.body || !req.body.password){
                res.status(400).json({ msg: "Please enter password." });
                return;
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const userId = new ObjectId(req.user.id);
            const doc = await authModel.findOneAndUpdate({user_id: userId}, {$set: {password: req.body.password}}, {upsert: true, returnNewDocument: true});
            if(!doc || !doc._id){
                res.status(500).json({status: false, msg: "Failed to update password due to some technical problem. Please try again later." });
            }
            res.status(200).json({status: true, msg: "Password changed successfully."});
        }catch(err){
            res.status(500).json({status: false, msg: "Failed to update password due to some technical problem. Please try again later." });
        }
    },
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

            const docs = await studentFeedbackModel.aggregate([
                {$match: {month_of_rating: {$in: [prevMonthYear, prevPrevMonthYear]}}}, 
                {$project: {teacher_id:1,month_of_rating:1, date_of_rating:1, overall_teaching_quality:1}},
                {$lookup: {from: "users",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher"}},
                {$unwind: "$teacher"}, 
                {$project: {teacher:"$teacher.name", teacher_code: "$teacher.teacher_code" ,month_of_rating:1, date_of_rating:1, overall_teaching_quality:1}},
            ])
            const growthDoc = [];
            for (let i=0; i<docs.length; i++){
                const ref = docs[i];
                const refTeacher = ref.teacher_code.concat(" - ", ref.teacher)
                const checkExists = growthDoc.length>0? _.findIndex(growthDoc, ['name', refTeacher]):-1;
                let details;
                if (checkExists == -1){
                    if (ref.month_of_rating == prevMonthYear){
                        details = {name: refTeacher, prevMonth: [ref.overall_teaching_quality], prevPrevMonth: [], prevMonthAvg: 0, prevPrevMonthAvg: 0, avgGrowth: 0}
                    } else {
                        details = {name: refTeacher, prevMonth: [], prevPrevMonth: [ref.overall_teaching_quality], prevMonthAvg: 0, prevPrevMonthAvg: 0, avgGrowth: 0}
                    }
                    growthDoc.push(details)
                } else{
                    if(ref.month_of_rating == prevMonthYear){
                        growthDoc[checkExists].prevMonth.push(ref.overall_teaching_quality)
                    }else{
                        growthDoc[checkExists].prevPrevMonth.push(ref.overall_teaching_quality)
                    }
                }
            }
            for (let i=0; i<growthDoc.length;i++){
                const ref = growthDoc[i];
                let prevMonthSum=0;
                let prevPrevMonthSum=0;
                for(let j=0; j<ref.prevMonth.length; j++){
                    prevMonthSum=prevMonthSum+ref.prevMonth[j];
                }
                ref.prevMonthAvg = ref.prevMonth.length>0?(prevMonthSum/ref.prevMonth.length).toFixed(2):0;
                for(let j=0; j<ref.prevPrevMonth.length; j++){
                    prevPrevMonthSum=prevPrevMonthSum+ref.prevPrevMonth[j];
                }
                ref.prevPrevMonthAvg = ref.prevPrevMonth.length>0?(prevPrevMonthSum/ref.prevPrevMonth.length).toFixed(2):0;
                ref.avgGrowth = (((ref.prevMonthAvg-ref.prevPrevMonthAvg)*100)/ref.prevPrevMonthAvg).toFixed(2);
            }
            const sortedData = growthDoc.sort(function(a,b){return b.avgGrowth - a.avgGrowth})
            const doc={prevMonthYear: prevMonthYear,prevPrevMonthYear: prevPrevMonthYear, docs: sortedData}
            res.status(200).json({status: true, doc: doc});
        } catch(err){
            res.status(500).json({status: false, msg: "Failed to retrieve top growths due to some technical problem. Please try again later." });
        }
    },
    getConditionalUserList: async(req, res)=>{
        try {
            const body = req.body;
            
            if (!body || !body.userType) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let matchFilter = {}
            if(body.userType == "TEACHER"){
                matchFilter.user_type = body.userType
            }else{
                matchFilter.user_type = body.userType
                matchFilter.department = new ObjectId(body.department)
                matchFilter.registration_year = body.registration_year
            }
            const docs = await userModel.find(matchFilter, {name:1 , registration_number:1})
            res.status(200).json({status: true, docs: docs });
          } catch (error) {
            res.status(500).json({status: false, msg: "Failed to retrieve student names due to some technical problem. Please try again later." });
          }
    },
    getCustomMonthFeedbackDetails: async(req, res)=>{
        try{
            const body = req.body;
            if (!body || !body._id || !body.userType || !body.monthRange || !body.monthRange[0] || !body.monthRange[1]) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let docs;
            let startDate;
            let endDate;
            let userId;
            let userType;
            const monthArray = [];
            const semArray = [];
            let curSem;
            let finalDoc= {
                label: "",
                labels: [],
                values: [],
            }
            if (req.user.user_type == ("TEACHER" || "STUDENT")){
                userId = new ObjectId(req.user.id);
                userType = req.user.user_type;
            } else{
                userType = body.userType;
                userId = new ObjectId(body._id);
            }
            if(userType == "TEACHER"){
                startDate = new Date(body.monthRange[0]);
                endDate = new Date(body.monthRange[1])
                if (endDate > new Date()){
                    return res.status(400).json({ msg: "End month must be maximum current month" });
                }
                const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
                if (monthDiff > 13) {
                return res.status(400).json({ msg: "The month range cannot exceed 12 months" });
                }
                while (startDate <= endDate) {
                    const monthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                    monthArray.push(monthYear);
                    startDate.setMonth(startDate.getMonth() + 1);
                }
                docs = await studentFeedbackModel.find({teacher_id: userId, month_of_rating: {$in: monthArray}}, {teacher_id:1,month_of_rating:1, date_of_rating:1, overall_teaching_quality:1})
                if(!docs || !(docs.length>0)){
                    return res.status(400).json({status: false, msg: "No data available!" });
                }
                const refDocs= [];
                for(let i=0; i<monthArray.length; i++){
                    const ref = monthArray[i];
                    refDocs.push({month_of_rating: ref, count:[], avg: 0})
                    for(let j=0; j<docs.length; j++){
                        const innerRef = docs[j];
                        if(ref==innerRef.month_of_rating){
                            refDocs[i].count.push(innerRef.overall_teaching_quality)
                        }
                    }
                }
                for (let i=0; i<refDocs.length;i++){
                    const ref = refDocs[i];
                    let sum=0;
                    for(let j=0; j<ref.count.length; j++){
                        sum=sum+ref.count[j];
                    }
                    ref.avg = ref.count.length>0?(sum/ref.count.length).toFixed(2):null;
                    finalDoc.labels.push(ref.month_of_rating)
                    finalDoc.values.push(ref.avg)
                }
                finalDoc.label = "Overall Teaching Quality"
            }else{
                const user = await userModel.findById(userId);
                if(!user){
                    return res.status(200).json({ status: false, msg: "Fail to get user details." });
                }
                const semDoc = await sessionModel.findOne({department:user.department, registration_year: user.registration_year, active:1}, {semesters: 1});
                if(!semDoc){
                    return res.status(200).json({ status: false, msg: "No semester record found for the selected student." });
                }
                const curDate = new Date();
                for(let i=0; i<semDoc.semesters.length; i++){
                    const ref = semDoc.semesters[i];
                    semArray.push(ref.sem)
                    if(ref.start<= curDate && ref.end>=curDate){
                        curSem=ref.sem
                    }
                }
                docs = await teacherFeedbackModel.find({student_id: userId, semester_of_rating: { $gte: 1, $lte: (curSem) }}, {teacher_id:1,semester_of_rating:1, date_of_rating:1, overall_student_quality:1})
                if(!docs || !(docs.length>0)){
                    return res.status(400).json({status: false, msg: "No data available!" });
                }
                const refDocs= [];
                for(let i=0; i<semArray.length; i++){
                    const ref = semArray[i];
                    refDocs.push({semester_of_rating: `Semester ${ref}`, count:[], avg: 0})
                    for(let j=0; j<docs.length; j++){
                        const innerRef = docs[j];
                        if(ref==innerRef.semester_of_rating){
                            refDocs[i].count.push(innerRef.overall_student_quality)
                        }
                    }
                }
                for (let i=0; i<refDocs.length;i++){
                    const ref = refDocs[i];
                    let sum=0;
                    for(let j=0; j<ref.count.length; j++){
                        sum=sum+ref.count[j];
                    }
                    ref.avg = ref.count.length>0?(sum/ref.count.length).toFixed(2):null;
                    finalDoc.labels.push(ref.semester_of_rating)
                    finalDoc.values.push(ref.avg)
    
                }
                finalDoc.label = "Overall Student Quality"
            }
            res.status(200).json({status: true, doc: finalDoc });
        }catch(err){
            console.log(err)
            res.status(500).json({status: false, msg: "Failed to retrieve feedback details due to some technical problem. Please try again later." });
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
                docs = await teacherFeedbackModel.find({student_id: userId}, {createdBy:0,updatedBy:0})
            }else if (userType === 'TEACHER'){
                docs = await studentFeedbackModel.find({teacher_id: userId, date_of_rating: { $gte: prev4MonthDate, $lte: currDate }}, {createdBy:0,updatedBy:0})
            }
            
            if(!docs || !(docs.length>0)){
                return res.status(400).json({status: false, msg: "No data available!" });
            }
            let graphData;
            if (userType== "TEACHER"){
    
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
                graphData = {
                    totalFeedbackLastMonthSem: 0,
                    totalFeedbackLastThreeMonthSem: 0,
                    lineGraphData: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        values: [65, 59, 80, 81, 56, 55, 40, 50, 46, 80, 90, 73],
                    },
                    lastMonthOrSemBarData: {
                        label: `${prevMonthYear}`,
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
                        graphData.totalFeedbackLastMonthSem = prevMonthOrSemBarDataBool;
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
                        graphData.strengths = graphData.strengths.sort(function(a,b){return b.count - a.count})
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
                        graphData.areas_of_improvement = graphData.areas_of_improvement.sort(function(a,b){return b.count - a.count})
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
                graphData.totalFeedbackLastThreeMonthSem = prevMonthOrSemBarDataBool+prevPrevMonthOrSemBarDataBool+prevPrevPrevMonthOrSemBarDataBool
            } else if (userType == "STUDENT"){
                const semDoc = await sessionModel.findOne({department:docs[0].department_id, registration_year: docs[0].student_reg_year, active:1}, {semesters: 1});
                if(!semDoc){
                    return res.status(200).json({ status: false, msg: "No semester record found for the selected student." });
                }
                let curSem;
                const curDate = new Date();
                for(let i=0; i<semDoc.semesters.length; i++){
                    const ref = semDoc.semesters[i];
                    if(ref.start<= curDate && ref.end>=curDate){
                        curSem=ref.sem
                    }
                }
                graphData = {
                    totalFeedbackLastMonthSem: 0,
                    totalFeedbackLastThreeMonthSem: 0,
                    lineGraphData: {
                        lebel: "",
                        // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        // values: [65, 59, 80, 81, 56, 55, 40, 50, 46, 80, 90, 73],
                        labels: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'],
                        values: [0,0,0,0,0,0,0,0],
                    },
                    lastMonthOrSemBarData: {
                        label: `Semester ${curSem-1}`,
                        keyLabels: ['class_participation', 'homework_or_assignments', 'quality_of_work', 'timeliness', 'problem_solving_skills', 'behaviour_and_attitude', 'responsibility', 'participation_and_engagement', 'group_work', 'overall_student_quality'],
                        labels: ['Class Participation', 'Homework or Assignments', 'Quality of Work', 'Timeliness', 'Problem Solving Skills', 'Behaviour and Attitude', 'Responsibility', 'Participation and Engagement', 'Group Work', 'Overall Student Quality'],
                        values: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    lastThreeMonthOrSemBarData: {
                        setNames: [],
                        keyLabels: ['class_participation', 'homework_or_assignments', 'quality_of_work', 'timeliness', 'problem_solving_skills', 'behaviour_and_attitude', 'responsibility', 'participation_and_engagement', 'group_work', 'overall_student_quality'],
                        labels: ['Class Participation', 'Homework or Assignments', 'Quality of Work', 'Timeliness', 'Problem Solving Skills', 'Behaviour and Attitude', 'Responsibility', 'Participation and Engagement', 'Group Work', 'Overall Student Quality'],
                        values1: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values2: [0,0,0,0,0,0,0,0,0,0,0,0],
                        values3: [0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    strengths: [],
                    areas_of_improvement: [],
                }
                let prevMonthOrSemBarDataBool = 0;
                let prevPrevMonthOrSemBarDataBool = 0;
                let prevPrevPrevMonthOrSemBarDataBool = 0;
                for(let i=0; i<docs.length; i++){
                    const ref = docs[i];
                    graphData.lastThreeMonthOrSemBarData.setNames.push(`Semester ${curSem-1}`)
                    if (ref.semester_of_rating == (curSem-1)){
                        prevMonthOrSemBarDataBool++;
                        const lastMonthOrSemBarDataLabel= graphData.lastMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastMonthOrSemBarDataLabel[j];
                            graphData.lastMonthOrSemBarData.values[j] = graphData.lastMonthOrSemBarData.values[j]+ref[innerRef]
                        }
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values1[j] = graphData.lastThreeMonthOrSemBarData.values1[j]+ref[innerRef]
                        }
                        graphData.totalFeedbackLastMonthSem = prevMonthOrSemBarDataBool;
                    }
                    graphData.lastThreeMonthOrSemBarData.setNames.push(`Semester ${curSem-2}`)
                    if (ref.semester_of_rating == (curSem-2)){
                        prevPrevMonthOrSemBarDataBool++;
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values2[j] = graphData.lastThreeMonthOrSemBarData.values2[j]+ref[innerRef]
                        }
                    }
                    graphData.lastThreeMonthOrSemBarData.setNames.push(`Semester ${curSem-3}`)
                    if (ref.semester_of_rating == (curSem-3)){
                        prevPrevPrevMonthOrSemBarDataBool++;
                        const lastThreeMonthOrSemBarDataLabel= graphData.lastThreeMonthOrSemBarData.keyLabels;
                        for (let j=0; j<lastThreeMonthOrSemBarDataLabel.length; j++){
                            const innerRef = lastThreeMonthOrSemBarDataLabel[j];
                            graphData.lastThreeMonthOrSemBarData.values3[j] = graphData.lastThreeMonthOrSemBarData.values3[j]+ref[innerRef]
                        }
                    }
                    if ((ref.semester_of_rating == (curSem-1)) || (ref.semester_of_rating == (curSem-2)) || (ref.semester_of_rating == (curSem-3))){
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
                        graphData.strengths = graphData.strengths.sort(function(a,b){return b.count - a.count})
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
                        graphData.areas_of_improvement = graphData.areas_of_improvement.sort(function(a,b){return b.count - a.count})
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
                graphData.totalFeedbackLastThreeMonthSem = prevMonthOrSemBarDataBool+prevPrevMonthOrSemBarDataBool+prevPrevPrevMonthOrSemBarDataBool
            }
            res.status(200).json({status: true, doc: graphData, docs: docs });
        }
        catch(err){
            console.log(err)
            res.status(500).json({status: false, msg: "Failed to retrieve user feedback details due to some technical problem. Please try again later." });
        }
    }


}    