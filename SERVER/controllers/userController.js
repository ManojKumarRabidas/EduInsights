const {ObjectId} = require('mongodb')
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');

module.exports = {
  // Create a new user
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
  // Handle user login
  userLogin: async (req, res) => {
    const { login_id, password } = req.body;
    try {
      // Find user by login_id in "authentication" collection
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
      // Check password
      const isMatch = await bcrypt.compare(password, authUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      // Update last login time
      authUser.last_log_in = new Date();
      await authUser.save();

      
      // // Store user data in session
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
    
        // store user information in session, typically a user id
        req.session.user = {
              _id: authUser.user_id,
              name: authUser.name,
              user_type: authUser.user_type
            };
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
            res.json({ user: req.session.user, msg: 'You are now logged in!' });
        })
      })
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  // Handle user logout
  userLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ msg: 'Logout failed', error: err.message });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ msg: 'Logout successful' });
    });
  }
};
