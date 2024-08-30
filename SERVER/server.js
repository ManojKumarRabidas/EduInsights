const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')
const route = require('./routes/index');
const connectDB = require('./config/mongoDB');

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/server', route);
