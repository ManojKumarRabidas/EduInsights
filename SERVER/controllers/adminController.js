const {ObjectId} = require('mongodb')
const moment = require('moment');
const deptModel = require("../models/department");
const userModel = require("../models/user");
const strengthModel = require("../models/strength");
const subjectModel = require("../models/subject");
const areaOfImprovementModel = require("../models/areaofimprovement");
const sessionModel = require("../models/session");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    userList: async(req, res)=>{
        try {
            const docs = await userModel.aggregate([
                {$match: {user_type: { $nin: ["SUPPORT", "ADMIN"] }}},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {$lookup: {from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "department"}},
                {$addFields: {department: { $arrayElemAt: ["$department", 0]}}},
                {$project: { _id: 1,
                        user_type: 1,
                        name: 1,
                        email: 1,
                        phone: 1,
                        address: 1,
                        department: {$ifNull: ["$department.dept_id", ""]},
                        registration_year: 1,
                        registration_number: 1,
                        is_verified: "$auth.is_verified",
                        active: "$auth.active"}}
            ]);
            if(docs.length>0){
                for(let i=0; i<docs.length; i++){
                    const val = docs[i].is_verified == 1 ?  "Verified": ( docs[i].is_verified == 0 ?  "Not Verified": "Rejected");
                    const val2 = docs[i].registration_number == null ? "N/A": (docs[i].registration_number == ""? "N/A": docs[i].registration_number);
                    const val3 = docs[i].registration_year == null ? "N/A": (docs[i].registration_year == ""? "N/A": docs[i].registration_year);
                    docs[i].is_verified = val;
                    docs[i].registration_number = val2;
                    docs[i].registration_year = val3;
                }
            }
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    userUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // const doc = await userModel.findByIdAndUpdate(params.id, body, {new: true});
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    userPendingVerificationList: async(req, res)=>{
        try {
            // const docs = await userModel.find({user_type: {$nin: ["ADMIN", "SUPPORT"]}, is_verified: {$nin: [1, -1] }});
            const docs = await userModel.aggregate([
                {$match: {user_type: {$nin: ["SUPPORT", "ADMIN"]}}},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {
                    $lookup: {
                        from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "department"
                    }
                },
                {$addFields: {department: { $arrayElemAt: ["$department", 0] }}},
                {$project: { _id: 1,
                        user_type: 1,
                        name: 1,
                        email: 1,
                        phone: 1,
                        address: 1,
                        department: {$ifNull: ["$department.dept_id", ""]},
                        registration_year: 1,
                        registration_number: 1,
                        is_verified: "$auth.is_verified"}},
                {$match: {is_verified: {$nin: [1, -1] }}},
            ]);
            if(docs.length>0){
                for(let i=0; i<docs.length; i++){
                    const val2 = docs[i].registration_number == null ? "N/A": (docs[i].registration_number == ""? "N/A": docs[i].registration_number);
                    const val3 = docs[i].registration_year == null ? "N/A": (docs[i].registration_year == ""? "N/A": docs[i].registration_year);
                    docs[i].registration_number = val2;
                    docs[i].registration_year = val3;
                }
            }
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    userUpdateVerificationStatus: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.verifiedBy = new ObjectId(req.user.id);
            body.verifiedAt = new Date();
            
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            params.id = new ObjectId(params.id);
            body.is_verified = Number(body.is_verified);
            body.active = body.is_verified == 1 ? 1 : 0;
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "User status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    supportUserList: async(req, res)=>{
        try {
            const docs = await userModel.aggregate([
                {$match: {user_type: {$in: ["SUPPORT"]}}},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {$project: { _id: 1,
                        user_type: 1,
                        employee_id: 1,
                        name: 1,
                        phone: 1,
                        email: 1,
                        login_id: "$auth.login_id",
                        active: "$auth.active"}}
            ]);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportUserCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.user_type || !body.employee_id || !body.name || !body.phone || !body.email || !body.address || !body.pin || !body.login_id || !body.password){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const is_verified = 1;
            const active = body.active;
            const password = body.password;
            const login_id = body.login_id;
            delete body.active;
            delete body.password;
            delete body.login_id;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userDoc = await userModel.create(body);
            await authModel.create({
              user_id: userDoc._id,
              user_type: userDoc.user_type,
              name: userDoc.name,
              login_id: login_id,
              password: hashedPassword,
              is_verified: is_verified,
              active: active,
              last_log_in: null,
            });
            res.status(201).json({ status: true, msg: "Registered successfully.", doc:userDoc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Email Id must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    supportUserDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportUserUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    supportUserDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await userModel.findByIdAndDelete({ _id: params.id });
            await authModel.deleteOne({ user_id: params.id });
            res.status(200).json({ message: "Support User deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportUserUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "Support User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    deptList: async(req, res)=>{
        try {
    
            const docs = await deptModel.find();
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    deptCreate: async(req, res)=>{
        try {  
            const userId = req.user;
            const body = req.body;
            if (!userId) {
                res.status(400).json({ msg: "Session Expired!" });
                return;
            }
            if (!body.dept_id || !body.name || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const doc = await deptModel.create(body);
            res.status(201).json({ status: true, msg: "Department created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Department Id must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    deptDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await deptModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    deptUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await deptModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    deptDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await deptModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Department deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    deptUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await deptModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Department updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    strengthList: async(req, res)=>{
        try {
            const docs = await strengthModel.find();
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    strengthCreate: async(req, res)=>{
        try {
            const body = req.body;
            let bodyArray = []
            let bool =  Array.isArray(body);
            if(!bool){
                bodyArray.push(body)
            } else{
                bodyArray = body;
            }
            for (let i=0; i<bodyArray.length; i++){
                const ref = bodyArray[i]
                if (!ref.name || !ref.strength_for || !ref.active){
                    res.status(400).json({ msg: "Missing Parameters!" });
                    return;
                }
                ref.createdBy = new ObjectId(req.user.id);
                ref.updatedBy = new ObjectId(req.user.id);
            }
            const doc = await strengthModel.insertMany(bodyArray);
            res.status(201).json({ status: true, msg: "Strength created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Combination of 'Strength For' and 'Name' must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    strengthDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await strengthModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    strengthUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await strengthModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Strength updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    strengthDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await strengthModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Strength deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    strengthUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await strengthModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
   
    subjectList: async(req, res)=>{
        try {
            const docs = await subjectModel.aggregate([
                {$lookup: {from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "department"}},
                {$unwind: "$department"},
                {$project: { _id: 1,
                        subject_code: 1,
                        name: 1,
                        department: "$department.name",
                        active: 1}}
            ]);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getDepartments: async(req, res)=>{
        try {
            const departments = await deptModel.find({active: 1}).sort({name: 1});
            res.status(200).json({ departments: departments });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve departments" });
          }
    },
    subjectCreate: async(req, res)=>{
        try {
            const body = req.body;
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            if (!body.subject_code || !body.name || !body.department || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.department = new ObjectId(body.department);
            const doc = await subjectModel.create(body);
            res.status(201).json({ status: true, msg: "Subject created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Subject Code must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    subjectDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await subjectModel.aggregate([
                {$match: {_id: new ObjectId(params.id)}},
                {$lookup: {from: "departments",
                        let: {departmentId: "$department"},
                        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$departmentId"]}}},
                        {$project: {_id: 1, name: 1}}],
                        as: "department"}},
                {$unwind: "$department"},
                {$project: { _id: 1,
                        subject_code: 1,
                        name: 1,
                        department:1,
                        active: 1}}
            ]);
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    subjectUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await subjectModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Subject updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    subjectDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await subjectModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Subject deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    subjectUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await subjectModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    areaOfImprovementList: async(req, res)=>{
        try {
            const docs = await areaOfImprovementModel.find();
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    areaOfImprovementCreate: async(req, res)=>{
        try {
            const body = req.body;
            let bodyArray = []
            let bool =  Array.isArray(body);
            if(!bool){
                bodyArray.push(body)
            } else{
                bodyArray = body;
            }
            for (let i=0; i<bodyArray.length; i++){
                const ref = bodyArray[i]
                if (!ref.name || !ref.area_for || !ref.active){
                    res.status(400).json({ msg: "Missing Parameters!" });
                    return;
                }
                ref.createdBy = new ObjectId(req.user.id);
                ref.updatedBy = new ObjectId(req.user.id);
            }
            
            const doc = await areaOfImprovementModel.insertMany(bodyArray);
            res.status(201).json({ status: true, msg: "Area of improvement created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Combination of 'Area For' and 'Name' must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    areaOfImprovementDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await areaOfImprovementModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    areaOfImprovementUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await areaOfImprovementModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Combination of 'Area For' and 'Name' must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    areaOfImprovementDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await areaOfImprovementModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Area of improvement deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    areaOfImprovementUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await areaOfImprovementModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getSemisterOfRating: async(req, res)=>{
        try{
            const body = req.body;
            if (!body || !body.registration_year || !body.department) {
                res.status(400).json({ msg: "Missing Parameters 1!" });
                return;
            }
            body.department = new ObjectId(body.department);
            const doc = await sessionModel.findOne({department:body.department, registration_year: body.registration_year, active:1}, {semesters: 1});
            if(!doc){
                return res.status(200).json({ status: false, msg: "No semester record found for the selected registration year and department." });
            }
            const curDate = new Date();
            for(let i=0; i<doc.semesters.length; i++){
                const ref = doc.semesters[i];
                if(ref.start<= curDate && ref.end>=curDate){
                    return res.status(200).json({status: true, doc : {semester: ref.sem} });
                }
            }
            res.status(200).json({ status: false, msg: "Session is complete for the selected combination of registration year and department." });
        }catch(err){
            res.status(500).json({ status: false, msg: "Failed to get semester of rating" });
        }
    },
    getSubjects: async(req, res)=>{
        try {
            const body = req.body;
            if (!body || !body.department) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.department = new ObjectId(body.department);
            const docs = await subjectModel.find({department:body.department, active:1});
            res.status(200).json({ docs : docs });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve subjects" });
          }
    },
    getStudentNames:async(req, res)=>{
        try {
            const body = req.body;
            if (!body || !body.registration_year || !body.department) {
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }

            body.registration_year = Number(body.registration_year);
            body.department = new ObjectId(body.department);
            const docs = await userModel.aggregate([
                {$match: {user_type:"STUDENT", registration_year:body.registration_year, department:body.department}},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {$project: { _id: 1,
                        name: 1,
                        registration_number: 1,
                        is_verified: "$auth.is_verified",
                        active: "$auth.active"}},
                {$match: {active: 1, is_verified: 1}}
            ]);
            res.status(200).json({status: true, docs: docs });
          } catch (error) {
            res.status(500).json({status: false, msg: "Failed to retrieve student names" });
          }
    },

    sessionCreate: async(req, res)=>{
        try {
            const userId = req.user;
            const body = req.body;
            if (!userId) {
                res.status(400).json({ msg: "Session Expired!" });
                return;
            }
            const finalBody = {
                registration_year: body.registration_year,
                department: body.department,
                duration: body.duration,
                sessionStartDate: body.semesters[0].start ? new Date(body.semesters[0].start) : null,
                semesters:body.semesters,
                active: body.active,
                createdBy: new ObjectId(req.user.id),
                updatedBy: new ObjectId(req.user.id),
            }
            for (let i=0;i<finalBody.semesters.length;i++){
                const ref = finalBody.semesters[i];
                ref.start= ref.start ?new Date(ref.start): null, 
                ref.end= ref.end ?new Date(ref.end): null
            }
            // body.createdBy = new ObjectId(req.user.id);
            // body.updatedBy = new ObjectId(req.user.id);
            const doc = await sessionModel.create(finalBody);
            res.status(201).json({ status: true, msg: "Academic Session created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: " must be unique." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },

    sessionList: async(req, res)=>{
        try {
            // const docs = await sessionModel.find({}, {registration_year: 1, department:1, semesters: 1,sessionStartDate: 1, active: 1});
            const docs = await sessionModel.aggregate([
                {$lookup: {from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "department"}},
                {$unwind: "$department"},
                {$project: { _id: 1,
                        registration_year: 1,
                        semesters: 1,
                        department: "$department.name",
                        sessionStartDate: 1,
                        duration: 1,
                        active: 1}}
            ]);
            if(docs.length>0){
                for(let i=0; i<docs.length; i++){
                  const ref = docs[i];
                  ref.sessionStartDate = moment(ref.sessionStartDate).format('DD/MM/YYYY');
                } 
              }
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sessionDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sessionModel.findById({ _id: params.id });
            const newSemesters = [];
            for(let i=0; i<doc.semesters.length; i++){
                if(doc.semesters[i].start != null){
                    newSemesters.push(doc.semesters[i]);
                }
            }
            doc.semesters = newSemesters;
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sessionUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sessionModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ msg: "Academic Session details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    sessionDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await sessionModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "session deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sessionUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sessionModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
}