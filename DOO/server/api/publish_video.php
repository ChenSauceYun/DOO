<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    error_log('数据库连接失败');
    echo json_encode([
        'code' => 500,
        'message' => '数据库连接失败，请检查配置'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    error_log('发布视频请求数据: ' . json_encode($data));
    
    $user_id = $data['user_id'] ?? 0;
    $title = $data['title'] ?? '';
    $description = $data['description'] ?? '';
    $video_url = $data['video_url'] ?? '';
    $cover_url = $data['cover_url'] ?? '';
    $tags = $data['tags'] ?? '';
    
    error_log('user_id: ' . $user_id);
    error_log('title: ' . $title);
    error_log('video_url: ' . $video_url);
    error_log('cover_url: ' . $cover_url);
    
    if (empty($user_id) || empty($title) || empty($video_url)) {
        error_log('参数验证失败');
        echo json_encode([
            'code' => 400,
            'message' => '用户ID、标题和视频URL不能为空'
        ]);
        exit;
    }
    
    try {
        $stmt = $conn->prepare("INSERT INTO videos (user_id, title, description, video_url, cover_url, tags, views, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())");
        $result = $stmt->execute([$user_id, $title, $description, $video_url, $cover_url, $tags]);
        
        error_log('插入结果: ' . ($result ? '成功' : '失败'));
        error_log('最后插入ID: ' . $conn->lastInsertId());
        
        if ($result) {
            echo json_encode([
                'code' => 200,
                'message' => '发布成功',
                'data' => [
                    'id' => $conn->lastInsertId(),
                    'title' => $title,
                    'description' => $description,
                    'video_url' => $video_url,
                    'cover_url' => $cover_url,
                    'tags' => $tags
                ]
            ]);
        } else {
            echo json_encode([
                'code' => 500,
                'message' => '发布失败'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'code' => 500,
            'message' => '数据库错误: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'code' => 405,
        'message' => '方法不允许'
    ]);
}
