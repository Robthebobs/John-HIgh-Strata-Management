<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get Supabase credentials from environment variables
$supabaseUrl = getenv('SUPABASE_URL');
$supabaseKey = getenv('SUPABASE_ANON_KEY');
$bucketName = 'documents'; // Name of your Supabase storage bucket

if (!$supabaseUrl || !$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Supabase credentials not configured']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    $errorMessage = isset($_FILES['document']) ? getUploadErrorMessage($_FILES['document']['error']) : 'No file uploaded';
    http_response_code(400);
    echo json_encode(['error' => $errorMessage]);
    exit();
}

$file = $_FILES['document'];
$userId = isset($_POST['userId']) ? $_POST['userId'] : 'anonymous';
$fileName = basename($file['name']);
$fileType = $file['type'];
$fileTmpPath = $file['tmp_name'];
$fileSize = $file['size'];

// Generate a unique file path in the bucket
$filePath = $userId . '/' . uniqid() . '-' . $fileName;

// Read file contents
$fileContents = file_get_contents($fileTmpPath);
if ($fileContents === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read uploaded file']);
    exit();
}

// Upload to Supabase Storage
$ch = curl_init();
$uploadUrl = $supabaseUrl . '/storage/v1/object/' . $bucketName . '/' . $filePath;

curl_setopt($ch, CURLOPT_URL, $uploadUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $fileContents);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $supabaseKey,
    'Content-Type: ' . $fileType,
]);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($statusCode >= 200 && $statusCode < 300) {
    // Successfully uploaded
    $responseData = json_decode($response, true);
    
    // Store file metadata in Supabase database if needed
    // This would require another API call to insert into a table
    
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully',
        'file' => [
            'name' => $fileName,
            'size' => $fileSize,
            'type' => $fileType,
            'path' => $filePath
        ]
    ]);
} else {
    http_response_code($statusCode);
    echo json_encode([
        'error' => 'Failed to upload file to Supabase',
        'details' => $response
    ]);
}

function getUploadErrorMessage($errorCode) {
    switch ($errorCode) {
        case UPLOAD_ERR_INI_SIZE:
            return 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
        case UPLOAD_ERR_FORM_SIZE:
            return 'The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form';
        case UPLOAD_ERR_PARTIAL:
            return 'The uploaded file was only partially uploaded';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded';
        case UPLOAD_ERR_NO_TMP_DIR:
            return 'Missing a temporary folder';
        case UPLOAD_ERR_CANT_WRITE:
            return 'Failed to write file to disk';
        case UPLOAD_ERR_EXTENSION:
            return 'A PHP extension stopped the file upload';
        default:
            return 'Unknown upload error';
    }
} 