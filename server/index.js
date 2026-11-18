const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs/promises');
const os = require('os');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_FILE_SIZE_MB = 10;

app.use(cors());
app.use(express.json());

// Uploads go to the OS temp directory and are deleted right after parsing,
// so résumés (personal data) are never kept on disk or inside the project.
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('ONLY_PDF'));
  },
});

app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Send a PDF in the "resume" field.' });
  }

  try {
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    res.json({ text: pdfData.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  } finally {
    await fs.unlink(req.file.path).catch(() => {});
  }
});

// Upload errors raised by multer (file too large, wrong file type).
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `File too large (max ${MAX_FILE_SIZE_MB} MB).` });
  }
  if (err.message === 'ONLY_PDF') {
    return res.status(415).json({ error: 'Only PDF files are accepted.' });
  }
  next(err);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
