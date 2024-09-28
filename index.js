// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schema
const studentSchema = new mongoose.Schema({
  rno: Number,
  name: String,
  marks: Number,
  image: String,
});

const Student = mongoose.model('Student', studentSchema);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
app.post('/students', upload.single('image'), async (req, res) => {
  const { rno, name, marks } = req.body;
  const image = req.file.path;
  const student = new Student({ rno, name, marks, image });
  await student.save();
  res.json(student);
});

app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
