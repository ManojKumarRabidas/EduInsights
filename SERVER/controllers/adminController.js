const deptModel = require("../models/department");
const strengthModel = require("../models/strength");
const subjectModel = require("../models/subject");

module.exports = {
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
            const body = req.body;
            if (!body.dept_id || !body.name || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await deptModel.create({ name: body.name, dept_id: body.dept_id, active: body.active,});
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
            res.status(200).json({ message: "User updated successfully", doc: doc });
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
            const doc = await strengthModel.create({ name: body.name, strength_for: body.strength_for, active: body.active,});
            res.status(201).json({ status: true, msg: "Strength created successfully.", doc: doc });
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Strength must be unique." });
            }
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
            const docs = await subjectModel.find();
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    subjectCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.subject_code || !body.name || !body.department || !body.active){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await subjectModel.create({ subject_code: body.subject_code, name: body.name, department: body.department, active: body.active,});
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
            const doc = await subjectModel.findById({ _id: params.id });
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
}