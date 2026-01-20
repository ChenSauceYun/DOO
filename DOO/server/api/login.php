<?php
// 启动session，用于用户认证
session_start();
// 设置CORS头，允许跨域请求
header("Access-Control-Allow-Origin: *");
// 设置响应内容类型为JSON
header("Content-Type: application/json; charset=UTF-8");
// 允许的HTTP方法
header("Access-Control-Allow-Methods: POST");
// 预检请求缓存时间（秒）
header("Access-Control-Max-Age: 3600");
// 允许的请求头
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 引入数据库连接类
include_once __DIR__ . '/../config/Database.php';

// 创建数据库实例
$database = new Database();
// 获取数据库连接
$db = $database->getConnection();

// 获取请求的原始数据
$rawData = file_get_contents("php://input");
// 解析JSON数据
$data = json_decode($rawData);

// 验证用户名和密码是否为空
if (
    !empty($data->username) &&
    !empty($data->password)
) {
    // 准备SQL查询语句，根据用户名查询用户信息
    $query = "SELECT id, username, password, nickname, avatar, background_image, followers, following, likes FROM users WHERE username = :username LIMIT 0,1";
    // 预处理SQL语句，防止SQL注入
    $stmt = $db->prepare($query);
    // 绑定参数
    $stmt->bindParam(":username", $data->username);
    // 执行查询
    $stmt->execute();
    // 获取查询结果
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // 验证密码是否正确
    if ($row && password_verify($data->password, $row['password'])) {
        // 设置session数据
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['nickname'] = $row['nickname'];
        
        // 记录登录日志
        error_log("用户登录成功，设置session: user_id=" . $row['id']);
        
        // 移除密码字段，不返回给前端
        unset($row['password']);
        // 返回成功响应
        http_response_code(200);
        echo json_encode(array("message" => "登录成功", "code" => 200, "data" => $row), JSON_UNESCAPED_UNICODE);
    } else {
        // 密码错误，返回401状态码
        http_response_code(401);
        echo json_encode(array("message" => "用户名或密码错误", "code" => 401), JSON_UNESCAPED_UNICODE);
    }
} else {
    // 用户名或密码为空，返回400状态码
    http_response_code(400);
    echo json_encode(array("message" => "用户名和密码不能为空", "code" => 400), JSON_UNESCAPED_UNICODE);
}
?>