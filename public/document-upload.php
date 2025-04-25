<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Upload</title>
    <link rel="stylesheet" href="/styles/global.css">
    <style>
        .upload-container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .upload-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .upload-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .file-input-container {
            position: relative;
            border: 2px dashed #4CAF50;
            padding: 2rem;
            text-align: center;
            border-radius: 8px;
            background-color: #f9f9f9;
            cursor: pointer;
        }
        
        .file-input-container:hover {
            background-color: #f0f9f0;
        }
        
        .file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
        
        .file-details {
            margin-top: 1rem;
            display: none;
        }
        
        .file-name {
            font-weight: bold;
            word-break: break-word;
        }
        
        .file-size {
            color: #666;
            font-size: 0.9rem;
        }
        
        .progress-container {
            width: 100%;
            background-color: #f0f0f0;
            border-radius: 4px;
            margin-top: 1rem;
            overflow: hidden;
            display: none;
        }
        
        .progress-bar {
            height: 10px;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
        
        .upload-btn {
            padding: 0.8rem;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .upload-btn:hover {
            background-color: #45a049;
        }
        
        .upload-btn:disabled {
            background-color: #9e9e9e;
            cursor: not-allowed;
        }
        
        .status-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            display: none;
        }
        
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .auth-message {
            text-align: center;
            padding: 2rem;
            color: #721c24;
        }
        
        .back-link {
            color: #4CAF50;
            text-decoration: none;
        }
        
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="upload-container" id="uploadContainer" style="display: none;">
        <div class="upload-header">
            <h1>Upload Documents</h1>
            <p>Please upload your required documents</p>
        </div>
        
        <form id="uploadForm" class="upload-form">
            <input type="hidden" name="userId" id="userIdField" value="">
            
            <div class="file-input-container" id="dropArea">
                <i class="fa fa-cloud-upload"></i>
                <p>Drag & drop your files here or click to browse</p>
                <input type="file" name="document" id="fileInput" class="file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
            </div>
            
            <div class="file-details" id="fileDetails">
                <div class="file-name" id="fileName"></div>
                <div class="file-size" id="fileSize"></div>
            </div>
            
            <div class="progress-container" id="progressContainer">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            
            <button type="submit" id="uploadButton" class="upload-btn" disabled>Upload Document</button>
            
            <div class="status-message" id="statusMessage"></div>
        </form>
    </div>
    
    <div class="auth-message" id="authMessage" style="display: none;">
        <h2>Please log in to access document upload</h2>
        <p><a href="/login" class="back-link">Go to login page</a></p>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const uploadContainer = document.getElementById('uploadContainer');
            const authMessage = document.getElementById('authMessage');
            const form = document.getElementById('uploadForm');
            const userIdField = document.getElementById('userIdField');
            const fileInput = document.getElementById('fileInput');
            const dropArea = document.getElementById('dropArea');
            const fileDetails = document.getElementById('fileDetails');
            const fileName = document.getElementById('fileName');
            const fileSize = document.getElementById('fileSize');
            const progressContainer = document.getElementById('progressContainer');
            const progressBar = document.getElementById('progressBar');
            const uploadButton = document.getElementById('uploadButton');
            const statusMessage = document.getElementById('statusMessage');
            
            // Check if user is authenticated with React app
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            
            if (!isAuthenticated) {
                // Show authentication message if not logged in
                authMessage.style.display = 'block';
            } else {
                // If authenticated, show the upload form
                uploadContainer.style.display = 'block';
                
                // Try to get the user ID from localStorage if it exists
                const userId = localStorage.getItem('userId') || 'anonymous';
                userIdField.value = userId;
                
                // File selection event
                fileInput.addEventListener('change', handleFileSelect);
                
                // Drag and drop events
                dropArea.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    dropArea.style.borderColor = '#45a049';
                    dropArea.style.backgroundColor = '#e8f5e9';
                });
                
                dropArea.addEventListener('dragleave', function() {
                    dropArea.style.borderColor = '#4CAF50';
                    dropArea.style.backgroundColor = '#f9f9f9';
                });
                
                dropArea.addEventListener('drop', function(e) {
                    e.preventDefault();
                    dropArea.style.borderColor = '#4CAF50';
                    dropArea.style.backgroundColor = '#f9f9f9';
                    
                    if (e.dataTransfer.files.length) {
                        fileInput.files = e.dataTransfer.files;
                        handleFileSelect();
                    }
                });
                
                // Form submission
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    if (fileInput.files.length === 0) {
                        showStatus('Please select a file to upload', 'error');
                        return;
                    }
                    
                    uploadFile();
                });
            }
            
            function handleFileSelect() {
                if (fileInput.files.length === 0) return;
                
                const file = fileInput.files[0];
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                fileDetails.style.display = 'block';
                uploadButton.disabled = false;
                
                // Reset progress and status
                progressBar.style.width = '0%';
                progressContainer.style.display = 'none';
                statusMessage.style.display = 'none';
            }
            
            function uploadFile() {
                const file = fileInput.files[0];
                const formData = new FormData(form);
                
                // Show progress bar
                progressContainer.style.display = 'block';
                uploadButton.disabled = true;
                
                const xhr = new XMLHttpRequest();
                
                // Progress event
                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressBar.style.width = percentComplete + '%';
                    }
                });
                
                // Load completed event
                xhr.addEventListener('load', function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const response = JSON.parse(xhr.responseText);
                        showStatus('Document uploaded successfully!', 'success');
                        
                        // Reset form after successful upload
                        setTimeout(function() {
                            form.reset();
                            fileDetails.style.display = 'none';
                            progressContainer.style.display = 'none';
                            uploadButton.disabled = true;
                        }, 3000);
                    } else {
                        let errorMessage = 'Upload failed';
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMessage = response.error || 'Upload failed';
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                        showStatus(errorMessage, 'error');
                        uploadButton.disabled = false;
                    }
                });
                
                // Error event
                xhr.addEventListener('error', function() {
                    showStatus('Network error occurred', 'error');
                    uploadButton.disabled = false;
                });
                
                // Open and send request
                xhr.open('POST', '/api/upload.php', true);
                xhr.send(formData);
            }
            
            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status-message ' + type;
                statusMessage.style.display = 'block';
            }
            
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        });
    </script>
</body>
</html> 