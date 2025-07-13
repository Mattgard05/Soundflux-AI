const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// File upload config
const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'));

// Handle upload + mastering
app.post('/upload', upload.single('track'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/mastered-${Date.now()}.wav`;


  ffmpeg(inputPath)
    .audioFilters('loudnorm', 'highpass=f=60', 'lowpass=f=14000')
    .on('end', () => {
      fs.unlinkSync(inputPath);
      res.download(outputPath, 'mastered.mp3', () => {
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('❌ FFmpeg error:', err.message);
      res.status(500).send('Mastering failed.');
    })
    .save(outputPath);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT}`);
});

