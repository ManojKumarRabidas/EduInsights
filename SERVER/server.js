const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const MongoStore = require('connect-mongo');
const route = require('./routes/index');
const connectDB = require('./config/mongoDB');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
connectDB(); // Connect to MongoDB

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'eduSecretKey', // Secret for signing the session ID cookie
    resave: false, // Prevents session being saved back to the store if it hasn’t been modified
    saveUninitialized: true, // Prevents uninitialized sessions being saved to the store
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGO_URL,
    //   collectionName: 'sessions',
    // }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session cookie expiration (1 day)
      secure: false, // Set to true if using https
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
  })
);

// Use routes after session middleware
app.use('/server', route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const Router = require("express-router");
// const session = require('express-session');
// const dotenv = require('dotenv');
// dotenv.config();
// const cors = require('cors');
// const MongoStore = require('connect-mongo');
// const connectDB = require('./config/mongoDB');

// // Initialize express app
// const app = express();

// const router = new Router();
// // Configure session
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'eduSecretKey', // Secret for signing the session ID cookie
//     resave: false, // Prevents session being saved back to the store if it hasn’t been modified
//     saveUninitialized: true, // Prevents uninitialized sessions being saved to the store
//     // store: MongoStore.create({
//     //   mongoUrl: process.env.MONGO_URL,
//     //   collectionName: 'sessions',
//     // }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // Session cookie expiration (1 day)
//       secure: false, // Set to true if using https
//       httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//     },
//   })
// );
// // Middleware
// app.use(cors());
// app.use(express.json());
// connectDB(); // Connect to MongoDB


// // API routes
// require("./routes")(router);
// app.use(router.routes());
// // app.use(router.allowedMethods());

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
