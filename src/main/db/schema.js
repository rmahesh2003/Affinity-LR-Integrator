const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(app.getPath('userData'), 'affinity-flow.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT UNIQUE,
    file_name TEXT,
    thumbnail_path TEXT,
    rating INTEGER DEFAULT 0,
    flagged BOOLEAN DEFAULT FALSE,
    rejected BOOLEAN DEFAULT FALSE,
    camera TEXT,
    lens TEXT,
    iso INTEGER,
    aperture TEXT,
    shutter_speed TEXT,
    width INTEGER,
    height INTEGER,
    date_taken TEXT,
    gps_lat REAL,
    gps_lng REAL,
    imported_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_photos_rating ON photos(rating);
  CREATE INDEX IF NOT EXISTS idx_photos_date_taken ON photos(date_taken);
  CREATE INDEX IF NOT EXISTS idx_photos_camera ON photos(camera);
`);

// Helper functions for database operations
const dbHelpers = {
  insertPhoto: db.prepare(`
    INSERT OR REPLACE INTO photos (
      file_path, file_name, thumbnail_path, camera, lens, iso,
      aperture, shutter_speed, width, height, date_taken,
      gps_lat, gps_lng, imported_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  updateRating: db.prepare(`
    UPDATE photos SET rating = ? WHERE id = ?
  `),

  updateFlag: db.prepare(`
    UPDATE photos SET flagged = ?, rejected = ? WHERE id = ?
  `),

  getPhotos: db.prepare(`
    SELECT * FROM photos
    WHERE (? IS NULL OR rating = ?)
    AND (? IS NULL OR camera = ?)
    AND (? IS NULL OR date_taken >= ?)
    AND (? IS NULL OR date_taken <= ?)
    ORDER BY 
      CASE WHEN ? = 'date' THEN date_taken END DESC,
      CASE WHEN ? = 'rating' THEN rating END DESC,
      CASE WHEN ? = 'filename' THEN file_name END ASC
    LIMIT ? OFFSET ?
  `),

  getPhotoById: db.prepare(`
    SELECT * FROM photos WHERE id = ?
  `)
};

module.exports = {
  db,
  dbHelpers
}; 