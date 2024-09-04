const userModel = require("../models/user");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');

module.exports = {
  // Create a new user
  userCreate: async (req, res) => {
    try {
      const body = req.body;

      // Check for missing parameters
      if (
        !body.user_type ||
        !body.registration_number ||
        !body.name ||
        !body.phone ||
        !body.email ||
        !body.address ||
        !body.pin ||
        !body.login_id ||
        !body.password
      ) {
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

      console.log("body", body);
      body.active = 1;
      body.verified = 0;
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      // Create user in "users" collection
      const userDoc = await userModel.create(body);

      // Create entry in "authentication" collection
      const authDoc = await authModel.create({
        user_id: userDoc._id,
        user_type: userDoc.user_type,
        name: userDoc.name,
        login_id: userDoc.login_id,
        password: hashedPassword,
        last_log_in: null, // Initialize to null; will update on login
      });

      res.status(201).json({ status: true, msg: "Registered successfully.", user: userDoc, auth: authDoc });
    } catch (err) {
      if (err.code == 11000) {
        res.status(500).json({ status: false, msg: "Login Id is not available. Please try something else." });
        return;
      }
      res.status(500).json({ status: false, msg: err.message });
    }
  },

  userCheckLoginIdAvailability: async(req, res)=>{
    console.log("abc");
    
    try {
      const params = req.params;
        if (!params || !params.login_id){
            res.status(400).json({ msg: "Missing Parameters!" });
            return;
        }
      const doc = await authModel.find({login_id: params.login_id});
      console.log(doc);
      // console.log(doc.length);
      
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
      // Check password
      const isMatch = await bcrypt.compare(password, authUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      // Update last login time
      authUser.last_log_in = new Date();
      await authUser.save();

      console.log("authuser", authUser);
      
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
