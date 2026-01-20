-- 添加管理员角色字段到用户表
USE doo_app;

ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' COMMENT '用户角色：user-普通用户，admin-管理员' AFTER password;

-- 创建轮播图表
CREATE TABLE IF NOT EXISTS carousels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '轮播图标题',
    author VARCHAR(100) DEFAULT NULL COMMENT '作者',
    image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用：1-启用，0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- 插入默认管理员账号（用户名：admin，密码：admin123）
INSERT INTO users (username, password, nickname, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';

-- 插入示例轮播图数据
INSERT INTO carousels (title, author, image_url, sort_order) VALUES 
('热门推荐', '官方推荐', '/static/img/banner1.jpg', 1),
('精选内容', '编辑精选', '/static/img/banner2.jpg', 2),
('最新发布', '用户发布', '/static/img/banner3.jpg', 3),
('关注推荐', '好友推荐', '/static/img/banner4.jpg', 4);