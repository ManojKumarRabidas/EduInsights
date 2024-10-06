const userModel = require("../models/user");
const studentFeedbackModel = require("../models/student_feedback");
const teacherFeedbackModel = require("../models/teacher_feedback");
const {ObjectId} = require('mongodb')
module.exports = {
    getConditionalUserList: async(req, res)=>{
        try {
            const body = req.body;
            console.log(body)
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
            console.log(body)
            if (!body ||!body.userType || !body._id) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }

            let docs;
            body._id = new ObjectId(body._id);
            if(body.userType === 'STUDENT'){
                docs = await teacherFeedbackModel.find({student_id: body._id}, {createdBy:0,updatedBy:0})
            }else{
                docs = await studentFeedbackModel.find({teacher_id: body._id}, {createdBy:0,updatedBy:0})

            }
            console.log(docs);
            let newStrengths = [];
                for (let i = 0; i < newStrengths.length; i++) {
                    for(let i=0; i<{strengths}.length; i++)
                        
                    // console.log(array[i]);
            }
            // const newStrengths = ['understandable','understandable', 'abcd', 'understandable']
            res.status(200).json({status: true, docs: docs });
        }
        catch(error){
            res.status(500).json({status: false, msg: "Failed to retrieve user feedback details" });
        }
    }


}    