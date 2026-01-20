<?php
// 启动session，用于管理员认证
session_start();
// 设置CORS头，允许跨域请求
header("Access-Control-Allow-Origin: *");
// 设置响应内容类型为JSON
header("Content-Type: application/json; charset=UTF-8");
// 允许的HTTP方法（GET、POST、PUT、DELETE）
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// 允许的请求头
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 验证session中是否存在管理员标识（必须登录才能使用管理功能）
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    // 返回401未授权状态码
    http_response_code(401);
    echo json_encode(array("message" => "未授权访问", "code" => 401));
    exit;
}

// 引入数据库连接类
include_once __DIR__ . '/../config/Database.php';

// 创建数据库实例
$database = new Database();
// 获取数据库连接
$db = $database->getConnection();

// 获取请求方法（GET、POST、PUT、DELETE）
$method = $_SERVER['REQUEST_METHOD'];

// 根据请求方法执行不同操作
switch ($method) {
    // GET请求：获取视频列表
    case 'GET':
        // 准备SQL查询语句，查询所有视频信息，关联用户表获取作者信息，按ID降序排列
        $query = "SELECT v.id, v.title, v.description, v.video_url, v.cover_url, v.views, v.created_at, u.username as author 
                  FROM videos v 
                  LEFT JOIN users u ON v.user_id = u.id 
                  ORDER BY v.id DESC";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 执行查询
        $stmt->execute();
        // 获取所有结果
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 返回200成功状态码
        http_response_code(200);
        // 返回JSON响应
        echo json_encode(array("message" => "获取成功", "code" => 200, "data" => $result));
        break;

    // POST请求：添加视频
    case 'POST':
        // 获取请求的原始数据
        $rawData = file_get_contents("php://input");
        // 解析JSON数据
        $data = json_decode($rawData);

        // 验证必填字段是否为空
        if (
            !empty($data->title) &&
            !empty($data->video_url)
        ) {
            // 准备SQL插入语句，插入视频记录
            $query = "INSERT INTO videos SET title=:title, description=:description, video_url=:video_url, cover_url=:cover_url, user_id=:user_id";
            // 预处理SQL语句
            $stmt = $db->prepare($query);

            // 绑定参数
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":video_url", $data->video_url);
            $stmt->bindParam(":cover_url", $data->cover_url);
            $stmt->bindParam(":user_id", $_SESSION['admin_id']);

            // 执行插入操作
            if ($stmt->execute()) {
                // 返回201成功状态码
                http_response_code(201);
                // 返回JSON响应
                echo json_encode(array("message" => "创建成功", "code" => 201));
            } else {
                // 插入失败，返回503错误状态码
                http_response_code(503);
                // 返回JSON响应
                echo json_encode(array("message" => "创建失败", "code" => 503));
            }
        } else {
            // 必填字段为空，返回400错误状态码
            http_response_code(400);
            // 返回JSON响应
            echo json_encode(array("message" => "数据不完整", "code" => 400));
        }
        break;

    // PUT请求：更新视频
    case 'PUT':
        // 获取请求的原始数据
        $rawData = file_get_contents("php://input");
        // 解析JSON数据
        $data = json_decode($rawData);

        // 验证视频ID是否为空
        if (!empty($data->id)) {
            // 准备SQL更新语句，更新视频信息
            $query = "UPDATE videos SET title=:title, description=:description, video_url=:video_url, cover_url=:cover_url WHERE id=:id";
            // 预处理SQL语句
            $stmt = $db->prepare($query);

            // 绑定参数
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":video_url", $data->video_url);
            $stmt->bindParam(":cover_url", $data->cover_url);
            $stmt->bindParam(":id", $data->id);

            // 执行更新操作
            if ($stmt->execute()) {
                // 返回200成功状态码
                http_response_code(200);
                // 返回JSON响应
                echo json_encode(array("message" => "更新成功", "code" => 200));
            } else {
                // 更新失败，返回503错误状态码
                http_response_code(503);
                // 返回JSON响应
                echo json_encode(array("message" => "更新失败", "code" => 503));
            }
        } else {
            // 视频ID为空，返回400错误状态码
            http_response_code(400);
            // 返回JSON响应
            echo json_encode(array("message" => "缺少ID", "code" => 400));
        }
        break;

    // DELETE请求：删除视频
    case 'DELETE':
        // 获取视频ID
        $id = isset($_GET['id']) ? $_GET['id'] : die();
        
        // 准备SQL删除语句，删除视频记录
        $query = "DELETE FROM videos WHERE id = :id";
        // 预处理SQL语句
        $stmt = $db->prepare($query);
        // 绑定参数
        $stmt->bindParam(":id", $id);

        // 执行删除操作
        if ($stmt->execute()) {
            // 返回200成功状态码
            http_response_code(200);
            // 返回JSON响应
            echo json_encode(array("message" => "删除成功", "code" => 200));
        } else {
            // 删除失败，返回503错误状态码
            http_response_code(503);
            // 返回JSON响应
            echo json_encode(array("message" => "删除失败", "code" => 503));
        }
        break;

    // 其他请求方法：返回405方法不允许
    default:
        http_response_code(405);
        echo json_encode(array("message" => "方法不允许", "code" => 405));
        break;
}
?>