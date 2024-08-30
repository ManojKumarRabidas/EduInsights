const deptModel = require("../models/department");
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
            console.log(doc);  
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
    }
}