<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(array(
        "message" => "API运行正常",
        "code" => 200,
        "server_info" => array(
            "php_version" => phpversion(),
            "request_method" => $_SERVER['REQUEST_METHOD'],
            "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'not set'
        )
    ));
    exit;
}

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$rawData = file_get_contents("php://input");
$data = json_decode($rawData);

if (!empty($data->username) && !empty($data->password)) {
    $query = "SELECT id FROM users WHERE username = :username LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        http_response_code(400);
        echo json_encode(array("message" => "用户名已存在", "code" => 400));
    } else {
        $query = "INSERT INTO users SET username=:username, password=:password, nickname=:username";
        $stmt = $db->prepare($query);

        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

        $stmt->bindParam(":username", $data->username);
        $stmt->bindParam(":password", $hashed_password);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "注册成功", "code" => 201, "data" => array("username" => $data->username)));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "注册失败", "code" => 503));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "用户名和密码不能为空", "code" => 400));
}
