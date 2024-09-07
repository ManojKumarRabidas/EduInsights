const {ObjectId} = require('mongodb')
const deptModel = require("../models/department");
const userModel = require("../models/user");
const strengthModel = require("../models/strength");
const subjectModel = require("../models/subject");
const areaOfImprovementModel = require("../models/areaofimprovement");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');

module.exports = {
    userList: async(req, res)=>{
        try {
            const docs = await userModel.aggregate([
                {
                    $match: {
                        user_type: { $nin: ["SUPPORT", "ADMIN"] }
                    }
                },
                {
                    $lookup: {
                        from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"
                    }
                },
                { $unwind: "$auth" },
                {
                    $lookup: {
                        from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "department"
                    }
                },
                {
                    $addFields: {
                        department: { $arrayElemAt: ["$department", 0] }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user_type: 1,
                        name: 1,
                        email: 1,
                        phone: 1,
                        address: 1,
                        department: {$ifNull: ["$department.name", ""]},
                        registration_year: 1,
                        registration_number: 1,
                        is_verified: "$auth.is_verified",
                        active: "$auth.active"
                    }
                }
            ]);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    userUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
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
                        department: {$ifNull: ["$department.name", ""]},
                        registration_year: 1,
                        registration_number: 1,
                        is_verified: "$auth.is_verified"}},
                {$match: {is_verified: {$nin: [1, -1] }}},
            ]);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    userUpdateVerificationStatus: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            // body.updatedBy = req.session.user._id;
            // body.updatedBy = new ObjectId(body.updatedBy);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            params.id = new ObjectId(params.id);
            body.is_verified = Number(body.is_verified);
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "User status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    supportUserList: async(req, res)=>{
        try {
            // const docs = await userModel.find({user_type: {$in: ["SUPPORT", "ADMIN"]}});
            const docs = await userModel.aggregate([
                {$match: {user_type: {$in: ["SUPPORT", "ADMIN"]}}},
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
            // body.createdBy = req.session.user._id;
            // body.createdBy = new ObjectId(body.createdBy);
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
            // body.updatedBy = req.session.user._id;
            // body.updatedBy = new ObjectId(body.updatedBy);
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
            // body.updatedBy = req.session.user._id;
            // body.updatedBy = new ObjectId(body.updatedBy);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // const doc = await authModel.findByIdAndUpdate(params.id, body, {new: true});
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
            console.log("req.session admin", req.session.user);
            const body = req.body;
            if (!body.dept_id || !body.name || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // body.createdBy = req.session.user._id;
            // body.createdBy = new ObjectId(body.createdBy);
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
            if (!body.name || !body.strength_for || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // const doc = await strengthModel.create({ name: body.name, strength_for: body.strength_for, active: body.active,});
            const doc = await strengthModel.create(body);
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
            // res.json({ departments });
            res.status(200).json({ departments: departments });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve departments" });
          }
    },
    subjectCreate: async(req, res)=>{
        try {
            const body = req.body;
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
            if (!body.area_for || !body.name || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // const doc = await areaOfImprovementModel.create({ name: body.name, area_for: body.area_for, active: body.active,});
            const doc = await areaOfImprovementModel.create(body);
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

    getSubjects: async(req, res)=>{
        try {
            const subjects = await subjectModel.find({active:1});
            // res.json({ departments });
            res.status(200).json({ subjects: subjects });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve subjects" });
          }
    },
    getStudentNames:async(req, res)=>{
        try {
            const student_names = await userModel.find({ user_type:"STUDENT"});
            // res.json({ departments });
            res.status(200).json({ student_names: student_names });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve student names" });
          }
    },
}