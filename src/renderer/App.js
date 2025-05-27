import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [filters, setFilters] = useState({
    rating: null,
    camera: null,
    dateRange: { start: null, end: null }
  });
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Listen for import progress updates
    const handleImportProgress = (event, progress) => {
      setImportProgress(progress);
      if (progress.photo) {
        setPhotos(prev => [...prev, progress.photo]);
      }
    };

    ipcRenderer.on('import-progress', handleImportProgress);

    return () => {
      ipcRenderer.removeListener('import-progress', handleImportProgress);
    };
  }, []);

  const handleImportFolder = async () => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder');
      if (folderPath) {
        setLoading(true);
        setImportProgress(null);
        const importedPhotos = await ipcRenderer.invoke('import-folder', folderPath);
        setPhotos(prev => [...prev, ...importedPhotos]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error importing folder:', error);
      setLoading(false);
    }
  };

  const handleImportFiles = async () => {
    try {
      const filePaths = await ipcRenderer.invoke('select-files');
      if (filePaths && filePaths.length > 0) {
        setLoading(true);
        setImportProgress(null);
        const importedPhotos = await ipcRenderer.invoke('import-files', filePaths);
        setPhotos(prev => [...prev, ...importedPhotos]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error importing files:', error);
      setLoading(false);
    }
  };

  const handleOpenInAffinity = async (filePath) => {
    try {
      await ipcRenderer.invoke('open-in-affinity', filePath);
    } catch (error) {
      console.error('Error opening in Affinity:', error);
    }
  };

  const handleRating = async (photoId, rating) => {
    try {
      await ipcRenderer.invoke('update-rating', photoId, rating);
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId ? { ...photo, rating } : photo
        )
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleFlag = async (photoId, flagged, rejected) => {
    try {
      await ipcRenderer.invoke('update-flag', photoId, flagged, rejected);
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId ? { ...photo, flagged, rejected } : photo
        )
      );
    } catch (error) {
      console.error('Error updating flag:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Affinity Flow
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={handleImportFolder}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                Import Folder
              </button>
              <button
                onClick={handleImportFiles}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                Import Files
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading && (
            <div className="text-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              {importProgress && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Importing {importProgress.current} of {importProgress.total} photos...
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden photo-card"
              >
                <div className="relative">
                  <img
                    src={photo.thumbnail_path}
                    alt={photo.file_name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleOpenInAffinity(photo.file_path)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {photo.file_name}
                  </p>
                  <div className="flex items-center mt-2 space-x-1 star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(photo.id, star)}
                        className={`text-${
                          star <= photo.rating ? 'yellow-400' : 'gray-300'
                        } hover:text-yellow-500`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleFlag(photo.id, !photo.flagged, false)}
                      className={`p-1 rounded ${
                        photo.flagged
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleFlag(photo.id, false, !photo.rejected)}
                      className={`p-1 rounded ${
                        photo.rejected
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 