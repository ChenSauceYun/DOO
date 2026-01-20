<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$rawData = file_get_contents("php://input");
$data = json_decode($rawData);

if (
    !empty($data->user_id) &&
    !empty($data->old_password) &&
    !empty($data->new_password)
) {
    $query = "SELECT id, password FROM users WHERE id = :user_id LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(array("message" => "用户不存在", "code" => 404));
    } else {
        if (password_verify($data->old_password, $row['password'])) {
            $hashed_password = password_hash($data->new_password, PASSWORD_DEFAULT);
            
            $query = "UPDATE users SET password = :password WHERE id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":password", $hashed_password);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "密码修改成功", "code" => 200));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "密码修改失败", "code" => 503));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "原密码错误", "code" => 401));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "参数不完整", "code" => 400));
}
