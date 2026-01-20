<?php
// 启动session，用于用户认证
session_start();
// 设置CORS头，允许跨域请求
header("Access-Control-Allow-Origin: *");
// 设置响应内容类型为JSON
header("Content-Type: application/json; charset=UTF-8");
// 允许的HTTP方法（GET、POST、PUT）
header("Access-Control-Allow-Methods: GET, POST, PUT");
// 允许的请求头
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 引入数据库连接类
include_once __DIR__ . '/../config/Database.php';

// 创建数据库实例
$database = new Database();
// 获取数据库连接
$db = $database->getConnection();

// 获取请求方法（GET、POST、PUT）
$method = $_SERVER['REQUEST_METHOD'];

// 验证session中是否存在user_id（用户必须登录才能使用消息功能）
if (!isset($_SESSION['user_id'])) {
    // 返回401未授权状态码
    http_response_code(401);
    echo json_encode(array("message" => "未登录", "code" => 401), JSON_UNESCAPED_UNICODE);
    exit;
}

// 从session中获取当前用户ID
$user_id = $_SESSION['user_id'];

// 根据请求方法执行不同操作
switch ($method) {
    // GET请求：获取消息列表
    case 'GET':
        // 准备SQL查询语句，查询当前用户相关的所有消息（发送或接收），按时间降序排列，限制50条
        $query = "SELECT m.id, m.sender_id, m.receiver_id, m.content, m.is_read, m.created_at, 
                       s.username as sender_name, s.nickname as sender_nickname, s.avatar as sender_avatar,
                       r.username as receiver_name, r.nickname as receiver_nickname, r.avatar as receiver_avatar
                FROM messages m 
                LEFT JOIN users s ON m.sender_id = s.id 
                LEFT JOIN users r ON m.receiver_id = r.id 
                WHERE m.receiver_id = :user_id OR m.sender_id = :user_id 
                ORDER BY m.created_at DESC 
                LIMIT 50";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":user_id", $user_id);
        // 执行查询
        $stmt->execute();
        // 获取所有结果
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 返回200成功状态码
        http_response_code(200);
        // 返回JSON响应
        echo json_encode(array("message" => "获取成功", "code" => 200, "data" => $result), JSON_UNESCAPED_UNICODE);
        break;

    // POST请求：发送消息
    case 'POST':
        // 获取请求的原始数据
        $rawData = file_get_contents("php://input");
        // 解析JSON数据
        $data = json_decode($rawData);

        // 验证接收者ID和消息内容是否为空
        if (empty($data->receiver_id) || empty($data->content)) {
            // 返回400错误状态码
            http_response_code(400);
            echo json_encode(array("message" => "接收者ID和内容不能为空", "code" => 400), JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 准备SQL插入语句，插入消息记录
        $query = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (:sender_id, :receiver_id, :content)";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":sender_id", $user_id);
        $stmt->bindParam(":receiver_id", $data->receiver_id);
        $stmt->bindParam(":content", $data->content);

        // 执行插入操作
        if ($stmt->execute()) {
            // 返回201成功状态码
            http_response_code(201);
            // 返回JSON响应
            echo json_encode(array("message" => "发送成功", "code" => 201), JSON_UNESCAPED_UNICODE);
        } else {
            // 插入失败，返回500错误状态码
            http_response_code(500);
            // 返回JSON响应
            echo json_encode(array("message" => "发送失败", "code" => 500), JSON_UNESCAPED_UNICODE);
        }
        break;

    // PUT请求：标记消息已读
    case 'PUT':
        // 获取消息ID
        $message_id = isset($_GET['id']) ? $_GET['id'] : 0;
        
        // 验证消息ID是否为空
        if (empty($message_id)) {
            // 返回400错误状态码
            http_response_code(400);
            // 返回JSON响应
            echo json_encode(array("message" => "消息ID不能为空", "code" => 400), JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 准备SQL更新语句，标记消息为已读
        $query = "UPDATE messages SET is_read = 1 WHERE id = :id AND receiver_id = :user_id";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":id", $message_id);
        $stmt->bindParam(":user_id", $user_id);

        // 执行更新操作
        if ($stmt->execute()) {
            // 返回200成功状态码
            http_response_code(200);
            // 返回JSON响应
            echo json_encode(array("message" => "标记已读成功", "code" => 200), JSON_UNESCAPED_UNICODE);
        } else {
            // 更新失败，返回500错误状态码
            http_response_code(500);
            // 返回JSON响应
            echo json_encode(array("message" => "标记失败", "code" => 500), JSON_UNESCAPED_UNICODE);
        }
        break;

    // 其他请求方法：返回405方法不允许
    default:
        http_response_code(405);
        // 返回JSON响应
        echo json_encode(array("message" => "方法不允许", "code" => 405), JSON_UNESCAPED_UNICODE);
        break;
}
?>