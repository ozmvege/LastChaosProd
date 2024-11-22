<?php

// Get the requested path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove leading/trailing slashes and set default to "index"
$path = trim($path, '/') ?: 'index';

// Sanitize the path to prevent invalid or dangerous file names
$path = preg_replace('/[^a-zA-Z0-9-_]/', '', $path);

// Build the full file path for .html files
$file = __DIR__ . "/$path.html";

// Check if the target file exists
if (file_exists($file)) {
    // Serve the HTML file
    header("Content-Type: text/html");
    readfile($file);
    exit;
}

// Handle 404 - File Not Found
http_response_code(404);
echo "404 Not Found: The page '$path' does not exist.";

