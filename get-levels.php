<?php

if ($_SERVER['HTTP_REFERER'] !== 'https://vegoz.info/petexp_calc.html') {
    http_response_code(403);
    echo "Access denied";
    exit;
}
// Path to the JSON file
$filePath = 'data/levels_updated.json';

// Serve the file securely
if (file_exists($filePath)) {
    header('Content-Type: application/json');
    readfile($filePath);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
}
?>