import express from 'express';
import cors from 'cors';
import 'dotenv/config';


const app = express();

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