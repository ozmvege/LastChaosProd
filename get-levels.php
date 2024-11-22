<?php
// Path to the JSON file
$filePath = '../data/levels_updated.json';

// Serve the file securely
if (file_exists($filePath)) {
    header('Content-Type: application/json');
    readfile($filePath);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
}
?>