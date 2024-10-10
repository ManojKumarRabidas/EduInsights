const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const route = require('./routes/index');
const connectDB = require('./config/mongoDB');

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' });
    req.user = user; // Save user in request
    next();
  });
};

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'eduSecretKey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use('/server', route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));