const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const exifr = require('exifr');
const { dbHelpers } = require('./db/schema');

const SUPPORTED_EXTENSIONS = [
  '.arw', '.cr2', '.raf', '.dng', '.nef', '.orf', '.rw2',
  '.jpg', '.jpeg', '.png'
];

async function scanDirectory(dirPath) {
  const files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await scanDirectory(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function generateThumbnail(filePath, thumbnailDir) {
  const fileName = path.basename(filePath);
  const thumbnailPath = path.join(thumbnailDir, `${fileName}.jpg`);

  try {
    // Use libraw.js to generate thumbnail
    // TODO: Implement actual thumbnail generation with libraw.js
    // For now, just copy the file if it's a JPEG
    if (path.extname(filePath).toLowerCase() === '.jpg') {
      await fs.copyFile(filePath, thumbnailPath);
    }
    return thumbnailPath;
  } catch (error) {
    console.error(`Error generating thumbnail for ${filePath}:`, error);
    return null;
  }
}

async function extractMetadata(filePath) {
  try {
    const metadata = await exifr.parse(filePath, {
      pick: [
        'Make', 'Model', 'LensModel', 'ISO', 'FNumber',
        'ExposureTime', 'ImageWidth', 'ImageHeight',
        'DateTimeOriginal', 'GPSLatitude', 'GPSLongitude'
      ]
    });

    return {
      camera: metadata.Make && metadata.Model ? `${metadata.Make} ${metadata.Model}` : null,
      lens: metadata.LensModel || null,
      iso: metadata.ISO || null,
      aperture: metadata.FNumber ? `f/${metadata.FNumber}` : null,
      shutter_speed: metadata.ExposureTime ? `${metadata.ExposureTime}s` : null,
      width: metadata.ImageWidth || null,
      height: metadata.ImageHeight || null,
      date_taken: metadata.DateTimeOriginal ? metadata.DateTimeOriginal.toISOString() : null,
      gps_lat: metadata.GPSLatitude || null,
      gps_lng: metadata.GPSLongitude || null
    };
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return {};
  }
}

async function processPhoto(filePath, thumbnailDir) {
  try {
    const thumbnailPath = await generateThumbnail(filePath, thumbnailDir);
    const metadata = await extractMetadata(filePath);
    const fileName = path.basename(filePath);

    const photoData = {
      file_path: filePath,
      file_name: fileName,
      thumbnail_path: thumbnailPath,
      ...metadata,
      imported_at: new Date().toISOString()
    };

    // Insert into database
    dbHelpers.insertPhoto.run(
      photoData.file_path,
      photoData.file_name,
      photoData.thumbnail_path,
      photoData.camera,
      photoData.lens,
      photoData.iso,
      photoData.aperture,
      photoData.shutter_speed,
      photoData.width,
      photoData.height,
      photoData.date_taken,
      photoData.gps_lat,
      photoData.gps_lng,
      photoData.imported_at
    );

    return photoData;
  } catch (error) {
    console.error(`Error processing photo ${filePath}:`, error);
    return null;
  }
}

module.exports = {
  scanDirectory,
  processPhoto,
  generateThumbnail,
  extractMetadata
}; 