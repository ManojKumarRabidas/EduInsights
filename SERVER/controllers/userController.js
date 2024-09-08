const {ObjectId} = require('mongodb')
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');

module.exports = {
  userCreate: async (req, res) => {
    try {
      const body = req.body;
      if ( !body.user_type || !body.registration_number || !body.name || !body.phone || !body.email || !body.address || !body.pin || !body.login_id || !body.password) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      if ((body.user_type == "TEACHER") && (!body.teacher_code || !body.employee_id)) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      
      if ((body.user_type == "STUDENT") && (!body.department || !body.registration_year)) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      if (body.department) {
        body.department = new ObjectId(body.department);
      } else{
        body.department=null;
      };
      const is_verified = 0;
      const active = 1;
      const password = body.password;
      const login_id = body.login_id;
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

      res.status(201).json({ status: true, msg: "Registered successfully. Please wait, We are redirecting you to log in page."});
    } catch (err) {
      if (err.code == 11000) {
        res.status(500).json({ status: false, msg: "Login Id is not available. Please try something else." });
        return;
      }
      res.status(500).json({ status: false, msg: err.message });
    }
  },

  userCheckLoginIdAvailability: async(req, res)=>{
    try {
      const params = req.params;
        if (!params || !params.login_id){
            res.status(400).json({ msg: "Missing Parameters!" });
            return;
        }
      const doc = await authModel.find({login_id: params.login_id});
      if (doc.length<=0){
        res.status(200).json({msg: "Available", available: true });
        return;
      }
      res.status(200).json({msg: "Not Available", available: false});
    } catch (error) {
      res.status(500).json({ msg: "Failed to retrieve departments" });
    }
  },

  userLogin: async (req, res) => {
    const { login_id, password } = req.body;
    try {
      const authUser = await authModel.findOne({ login_id });
      if (!authUser) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      if (authUser.is_verified == 0){
        return res.status(400).json({ msg: 'Your account is still not verified. Please contact with admin for verification.' });
      }
      if (authUser.is_verified == -1){
        return res.status(400).json({ msg: 'Your account creation request is rejected. Please contact with admin for verification.' });
      }
      if (authUser.active == 0){
        return res.status(400).json({ msg: 'Your account is deactivated. Please contact with admin for activation.' });
      }
      const isMatch = await bcrypt.compare(password, authUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      authUser.last_log_in = new Date();
      await authUser.save();

      // req.session.user = {
      //   _id: authUser.user_id,
      //   name: authUser.name,
      //   user_type: authUser.user_type
      // };
      // res.json({ user: req.session.user, msg: 'You are now logged in!' });

      // req.session.save(() => {
      //   req.session.logged_in = true;
      //   req.session.user = {
      //     _id: authUser.user_id,
      //     name: authUser.name,
      //     user_type: authUser.user_type
      //   };
      //   console.log("Session after login:", req.session);
      //   res.json({ user: req.session.user, msg: 'You are now logged in!' });
      // });

      req.session.regenerate(function (err) {
        if (err) next(err)
        req.session.user = {
              _id: authUser.user_id,
              name: authUser.name,
              user_type: authUser.user_type
            };
        req.session.save(function (err) {
          if (err) return next(err)
            res.json({ user: req.session.user, msg: 'You are now logged in!' });
        })
      })
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  userLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ msg: 'Logout failed', error: err.message });
      }
      res.clearCookie('connect.sid');
      res.json({ msg: 'Logout successful' });
    });
  }, 

  profileDetails: async(req, res) =>{
    try {
      var userId;
      if(req.session.user && req.session.user._id){
        userId = new ObjectId(req.session.user._id);
      } else {
        userId = new ObjectId("66da8a1459ec4c0f5b3d0363");
      }
        const docs = await userModel.aggregate([
          {$match: {_id: userId}},
          {$lookup: {from: "authentications",
                  localField: "_id",
                  foreignField: "user_id",
                  as: "auth"}},
          {$unwind: "$auth"},
          {$lookup: {from: "departments",
                  localField: "department",
                  foreignField: "_id",
                  as: "department"}},
          {$addFields: {department: { $arrayElemAt: ["$department", 0] }}},
          {$project: { _id: 1,
                  user_type: 1,
                  name: 1,
                  teacher_code: 1,
                  employee_id: 1,
                  registration_year: 1,
                  registration_number: 1,
                  phone: 1,
                  email: 1,
                  pin: 1,
                  address: 1,
                  department: {$ifNull: ["$department.name", ""]},
                  active: "$auth.active",
                  is_verified: "$auth.is_verified",
                  createdAt: 1,
                  last_log_in: "$auth.last_log_in",
                }},
        ]);
        const formatDate = (date) => {
          if (!date) return "";
          const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" };
          return new Intl.DateTimeFormat("en-IN", options).format(new Date(date)).replace(",", " -");
        };
        const doc = docs[0]
        doc.createdAt= formatDate(doc.createdAt),
        doc.last_log_in= formatDate(doc.last_log_in),
        doc.registration_year= formatDate(doc.registration_year),
        doc.active= doc.active === 1 ? "Active" : "Inactive",
        doc.is_verified= doc.is_verified === 1 ? "Verified" : (doc.is_verified === -1 ? "Rejected" : "Not Verified"),
        res.status(200).json({ doc: doc });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const body = req.body;
      console.log(body);
      if ( !body.old_password || !body.new_password) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      var userId;
      if(req.session.user && req.session.user._id){
        userId = new ObjectId(req.session.user._id);
      } else {
        userId = new ObjectId("66da8a1459ec4c0f5b3d0363");
      }

      const user = await authModel.findOne({user_id: userId});
      if (!user) {
        return res.status(404).json({status: false, msg: 'User not found' });
      }
      const isMatch = await bcrypt.compare(body.old_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, msg: 'Old password is incorrect' });
      }
      const hashedPassword = await bcrypt.hash(body.new_password, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ status: true, msg: 'Password changed successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, msg: "An error occurred while changing the password" });
    }
  },
};
