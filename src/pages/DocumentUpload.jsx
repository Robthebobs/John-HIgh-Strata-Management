import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Reset states
    setUploadProgress({});
    setUploadError('');
    setUploadSuccess('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      
      // Reset states
      setUploadProgress({});
      setUploadError('');
      setUploadSuccess('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const uploadFile = async (file, index) => {
    try {
      // Get user ID from localStorage or use 'anonymous'
      const userId = localStorage.getItem('userId') || 'anonymous';
      
      // Create a unique file path in the bucket
      const filePath = `${userId}/${Date.now()}-${file.name}`;
      
      // Create a reference to the file in Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded * 100) / progress.total);
            setUploadProgress(prev => ({
              ...prev,
              [index]: percent
            }));
          }
        });

      if (error) {
        throw error;
      }

      // Save metadata to a table if needed
      const { error: metadataError } = await supabase
        .from('document_files')
        .insert([
          {
            user_id: userId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_path: filePath,
            uploaded_at: new Date().toISOString(),
          }
        ]);

      if (metadataError) {
        console.warn('Metadata could not be saved:', metadataError);
      }

      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setUploadError('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    try {
      const uploadPromises = files.map((file, index) => uploadFile(file, index));
      await Promise.all(uploadPromises);
      
      setUploadSuccess('All files uploaded successfully!');
      setFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setUploadError(error.message || 'Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="notice-board">
      <div className="notice-header">
        <h1>Document Upload</h1>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>

      <div className="upload-section">
        <h2>Upload Documents</h2>
        {uploadSuccess && (
          <div className="success-message">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}
        
        <form onSubmit={handleUpload} className="upload-form">
          <div 
            className="drop-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="drop-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11L12 8 15 11" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Drag & drop files here, or <span className="browse-text">browse</span></p>
            <input 
              type="file" 
              id="file-upload" 
              multiple 
              onChange={handleFileChange}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="file-input"
            />
          </div>
          
          {files.length > 0 && (
            <div className="file-list">
              <h3>Selected Files</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index} className="file-item">
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    {uploadProgress[index] !== undefined && (
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${uploadProgress[index]}%` }}
                        ></div>
                        <span className="progress-text">{uploadProgress[index]}%</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={uploading || files.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload; 