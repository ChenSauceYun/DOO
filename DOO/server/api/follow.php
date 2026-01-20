<?php
// 启动session，用于用户认证
session_start();
// 设置CORS头，允许跨域请求
header("Access-Control-Allow-Origin: *");
// 设置响应内容类型为JSON
header("Content-Type: application/json; charset=UTF-8");
// 允许的HTTP方法（GET、POST、DELETE）
header("Access-Control-Allow-Methods: GET, POST, DELETE");
// 允许的请求头
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 引入数据库连接类
include_once __DIR__ . '/../config/Database.php';

// 创建数据库实例
$database = new Database();
// 获取数据库连接
$db = $database->getConnection();

// 获取请求方法（GET、POST、DELETE）
$method = $_SERVER['REQUEST_METHOD'];

// 验证session中是否存在user_id（用户必须登录才能使用关注功能）
if (!isset($_SESSION['user_id'])) {
    // 记录错误日志
    error_log("Session user_id 未设置");
    error_log("Session 数据: " . print_r($_SESSION, true));
    
    // 返回401未授权状态码
    http_response_code(401);
    echo json_encode(array("message" => "未登录", "code" => 401), JSON_UNESCAPED_UNICODE);
    exit;
}

// 从session中获取当前用户ID
$user_id = $_SESSION['user_id'];
// 记录当前用户ID到日志
error_log("当前用户ID: " . $user_id);

// 根据请求方法执行不同操作
switch ($method) {
    // GET请求：获取关注列表或检查关注状态
    case 'GET':
        // 获取action参数（following=已关注列表，followers=粉丝列表，check=检查关注状态）
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        // 获取已关注列表
        if ($action === 'following') {
            // 准备SQL查询，查询当前用户关注的所有用户
            $query = "SELECT u.id, u.username, u.nickname, u.avatar, u.followers, u.following, u.likes 
                      FROM follows f 
                      LEFT JOIN users u ON f.following_id = u.id 
                      WHERE f.follower_id = :user_id 
                      ORDER BY f.created_at DESC";
            // 预处理SQL语句
            $stmt = $db->prepare($query);
            // 绑定参数
            $stmt->bindParam(":user_id", $user_id);
            // 执行查询
            $stmt->execute();
            // 获取所有结果
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 返回成功响应
            http_response_code(200);
            echo json_encode(array("message" => "获取成功", "code" => 200, "data" => $result), JSON_UNESCAPED_UNICODE);
        // 获取粉丝列表
        } else if ($action === 'followers') {
            // 准备SQL查询，查询关注当前用户的所有用户（粉丝）
            $query = "SELECT u.id, u.username, u.nickname, u.avatar, u.followers, u.following, u.likes 
                      FROM follows f 
                      LEFT JOIN users u ON f.follower_id = u.id 
                      WHERE f.following_id = :user_id 
                      ORDER BY f.created_at DESC";
            // 预处理SQL语句
            $stmt = $db->prepare($query);
            // 绑定参数
            $stmt->bindParam(":user_id", $user_id);
            // 执行查询
            $stmt->execute();
            // 获取所有结果
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 返回成功响应
            http_response_code(200);
            echo json_encode(array("message" => "获取成功", "code" => 200, "data" => $result), JSON_UNESCAPED_UNICODE);
        // 检查是否已关注某个用户
        } else if ($action === 'check') {
            // 获取目标用户ID
            $target_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
            
            // 准备SQL查询，检查当前用户是否已关注目标用户
            $query = "SELECT COUNT(*) as count FROM follows WHERE follower_id = :user_id AND following_id = :target_id";
            // 预处理SQL语句
            $stmt = $db->prepare($query);
            // 绑定参数
            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":target_id", $target_id);
            // 执行查询
            $stmt->execute();
            // 获取查询结果
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            // 判断是否已关注（count > 0表示已关注）
            $is_following = $result['count'] > 0;

            // 返回成功响应
            http_response_code(200);
            echo json_encode(array("message" => "获取成功", "code" => 200, "data" => array("is_following" => $is_following)), JSON_UNESCAPED_UNICODE);
        }
        break;

    // POST请求：关注用户
    case 'POST':
        // 获取请求的原始数据
        $rawData = file_get_contents("php://input");
        // 解析JSON数据
        $data = json_decode($rawData);

        // 验证用户ID是否为空
        if (empty($data->user_id)) {
            // 返回400错误状态码
            http_response_code(400);
            echo json_encode(array("message" => "用户ID不能为空", "code" => 400), JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 准备SQL查询，检查是否已关注该用户
        $query = "SELECT COUNT(*) as count FROM follows WHERE follower_id = :user_id AND following_id = :target_id";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":target_id", $data->user_id);
        // 执行查询
        $stmt->execute();
        // 获取查询结果
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // 如果已经关注，返回错误
        if ($result['count'] > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "已经关注", "code" => 400), JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 准备SQL插入语句，添加关注记录
        $query = "INSERT INTO follows (follower_id, following_id) VALUES (:follower_id, :following_id)";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":follower_id", $user_id);
        $stmt->bindParam(":following_id", $data->user_id);

        // 执行插入操作
        if ($stmt->execute()) {
            // 更新被关注者的粉丝数（+1）
            $query = "UPDATE users SET followers = followers + 1 WHERE id = :following_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":following_id", $data->user_id);
            $stmt->execute();

            // 更新关注者的关注数（+1）
            $query = "UPDATE users SET following = following + 1 WHERE id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();

            // 返回201成功状态码
            http_response_code(201);
            echo json_encode(array("message" => "关注成功", "code" => 201), JSON_UNESCAPED_UNICODE);
        } else {
            // 插入失败，返回500错误状态码
            http_response_code(500);
            echo json_encode(array("message" => "关注失败", "code" => 500), JSON_UNESCAPED_UNICODE);
        }
        break;

    // DELETE请求：取消关注
    case 'DELETE':
        // 获取目标用户ID
        $target_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        // 验证用户ID是否为空
        if (empty($target_id)) {
            // 返回400错误状态码
            http_response_code(400);
            echo json_encode(array("message" => "用户ID不能为空", "code" => 400), JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 准备SQL删除语句，删除关注记录
        $query = "DELETE FROM follows WHERE follower_id = :user_id AND following_id = :target_id";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":target_id", $target_id);

        // 执行删除操作
        if ($stmt->execute()) {
            // 更新被取消关注者的粉丝数（-1）
            $query = "UPDATE users SET followers = followers - 1 WHERE id = :target_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":target_id", $target_id);
            $stmt->execute();

            // 更新取消关注者的关注数（-1）
            $query = "UPDATE users SET following = following - 1 WHERE id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();

            // 返回200成功状态码
            http_response_code(200);
            echo json_encode(array("message" => "取消关注成功", "code" => 200), JSON_UNESCAPED_UNICODE);
        } else {
            // 删除失败，返回500错误状态码
            http_response_code(500);
            echo json_encode(array("message" => "取消关注失败", "code" => 500), JSON_UNESCAPED_UNICODE);
        }
        break;

    // 其他请求方法：返回405方法不允许
    default:
        http_response_code(405);
        echo json_encode(array("message" => "方法不允许", "code" => 405), JSON_UNESCAPED_UNICODE);
        break;
}
?>