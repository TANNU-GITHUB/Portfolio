import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';


dotenv.config();
const app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI?.trim();
if (!mongoUri) {
  console.error('Missing MONGO_URI in backend/.env — add your Atlas connection string.');
} else {
  mongoose
    .connect(mongoUri, {
      // Prefer IPv4; helps some Windows / campus networks where SRV + IPv6 misbehaves
      family: 4,
      serverSelectionTimeoutMS: 15_000,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message || err);
      if (err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
        console.error(
          '\n[DNS / SRV] Atlas could not resolve _mongodb._tcp… SRV records from this network.\n' +
            'Try: use another Wi‑Fi or VPN off · set DNS to 8.8.8.8 · or in MongoDB Atlas → Connect → Drivers, copy the\n' +
            'standard mongodb://host1:27017,host2:27017/… URI (not mongodb+srv) and set MONGO_URI to that.\n'
        );
      }
    });
}

// --- Database Schemas ---
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

const ResumeSchema = new mongoose.Schema({
  format: { type: String, required: true, enum: ['pdf', 'docx'] },
  fileData: { type: Buffer, required: true }, // Stores the actual file bytes
  contentType: { type: String, required: true }
});
const Resume = mongoose.model('Resume', ResumeSchema);

// --- RESTful API Routes ---
app.get('/', (req, res) => {
  res.send('Portfolio Backend is Alive and Running!');
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
  try {
    const { format } = req.body; // 'pdf' or 'docx'
    const contentType = format === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    await Resume.findOneAndUpdate(
      { format },
      { format, fileData: req.file.buffer, contentType },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: `${format} resume uploaded successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/resume/:format', async (req, res) => {
  try {
    const { format } = req.params;

    if (!['pdf', 'docx'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    const resume = await Resume.findOne({ format });

    if (!resume) {
      return res.status(404).json({ error: `Resume (${format}) not found in database` });
    }

    const viewMode = req.query.mode === 'view';

    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': viewMode
        ? `inline; filename="My_Resume.${format}"`
        : `attachment; filename="My_Resume.${format}"`,
      'Content-Length': resume.fileData.length,
    });

    res.end(Buffer.from(resume.fileData), 'binary');

  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));