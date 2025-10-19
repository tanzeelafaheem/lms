import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';


const app = express();

//connect to db
await connectDB();

//middleware
app.use(cors());

//routes
app.get('/', (req, res) => {
  res.send('LMS Server is running');
});

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});