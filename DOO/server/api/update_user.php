<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$rawData = file_get_contents("php://input");
$data = json_decode($rawData);

if (!empty($data->user_id)) {
    $setClauses = array();
    $params = array();

    if (!empty($data->nickname)) {
        $setClauses[] = "nickname = :nickname";
        $params[':nickname'] = $data->nickname;
    }

    if (!empty($data->avatar)) {
        $setClauses[] = "avatar = :avatar";
        $params[':avatar'] = $data->avatar;
    }

    if (!empty($data->background_image)) {
        $setClauses[] = "background_image = :background_image";
        $params[':background_image'] = $data->background_image;
    }

    if (count($setClauses) > 0) {
        $query = "UPDATE users SET " . implode(", ", $setClauses) . " WHERE id = :user_id";
        $stmt = $db->prepare($query);
        $params[':user_id'] = $data->user_id;

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "更新成功", "code" => 200));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "更新失败", "code" => 503));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "没有需要更新的数据", "code" => 400));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "用户ID不能为空", "code" => 400));
}
