<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', '1');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uploadDir = __DIR__ . '/../uploads/';
    $exists = file_exists($uploadDir);
    $writable = is_writable($uploadDir);
    
    $response = array(
        "message" => "上传API运行正常",
        "code" => 200,
        "server_info" => array(
            "php_version" => phpversion(),
            "upload_dir" => $uploadDir,
            "dir_exists" => $exists,
            "dir_writable" => $writable,
            "request_method" => $_SERVER['REQUEST_METHOD']
        )
    );
    
    echo json_encode($response);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileSize = $_FILES['file']['size'];
    $fileType = $_FILES['file']['type'];

    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    $uploadFilePath = $uploadDir . $newFileName;

    $allowedTypes = array('image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi');

    if (in_array($fileType, $allowedTypes)) {
        $maxSize = in_array($fileType, array('video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi')) ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if ($fileSize < $maxSize) {
            if (move_uploaded_file($fileTmpPath, $uploadFilePath)) {
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
                $host = $_SERVER['HTTP_HOST'];
                $fileUrl = $protocol . '://' . $host . '/DOO/server/uploads/' . $newFileName;
                
                $response = array(
                    "message" => "上传成功",
                    "code" => 200,
                    "data" => array(
                        "url" => $fileUrl,
                        "filename" => $newFileName
                    )
                );
                
                http_response_code(200);
                echo json_encode($response);
            } else {
                $response = array("message" => "文件上传失败", "code" => 500);
                http_response_code(500);
                echo json_encode($response);
            }
        } else {
            $isVideo = in_array($fileType, array('video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'));
            $maxSizeText = $isVideo ? '50MB' : '5MB';
            $response = array("message" => "文件大小不能超过" . $maxSizeText, "code" => 400);
            http_response_code(400);
            echo json_encode($response);
        }
    } else {
        $response = array("message" => "只支持JPG、PNG、GIF、MP4格式的文件", "code" => 400);
        http_response_code(400);
        echo json_encode($response);
    }
} else {
    $errorMsg = isset($_FILES['file']) ? "上传错误: " . $_FILES['file']['error'] : "没有文件被上传";
    $response = array("message" => $errorMsg, "code" => 400);
    http_response_code(400);
    echo json_encode($response);
}
