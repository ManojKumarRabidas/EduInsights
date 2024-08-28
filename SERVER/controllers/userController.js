const userModel = require("../models/user");
module.exports = {
    createUser: async(req, res)=>{
        const { name, email, age } = req.body;
        try {
            const userAdded = await userModel.create({ name: name, email: email, age: age,});
            res.status(201).json({ message: "User created successfully", data: userAdded });
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    },
    getAllUsers: async(req, res)=>{
        try {
            const allUsers = await userModel.find();
            res.status(200).json({ data: allUsers });
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    },
    getUser: async(req, res)=>{
        try {
            const { id } = req.params;
            const userData = await userModel.findById({ _id: id });
            res.status(200).json({ data: userData });
        } catch (error) {
            res.status(400).json({ err: err.message });
        }
    },
    updateUser: async(req, res)=>{
        const { id } = req.params;
        const details = req.body;
        try {
            const updatedData = await userModel.findByIdAndUpdate(id, details, {new: true});
            res.status(200).json({ message: "User updated successfully", data: updatedData });
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    deleteUser: async(req, res)=>{
        try {
            const { id } = req.params;
            const userData = await userModel.findByIdAndDelete({ _id: id });
            res.status(200).json({ message: "User deleted successfully", data: userData });
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    }
}