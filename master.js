
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputPath = path.resolve(__dirname, 'input.mp3');
const outputPath = path.resolve(__dirname, 'output.mp3');

ffmpeg(inputPath)
  .audioFilters('loudnorm', 'highpass=f=60', 'lowpass=f=14000')
  .on('end', () => {
    console.log('✅ Mastering complete! Output saved to output.mp3');
  })
  .on('error', (err) => {
    console.error('❌ Error during mastering:', err.message);
  })
  .save(outputPath);


