<?php
// 数据库连接类
class Database {
    // 数据库主机地址
    private $host = 'localhost';
    // 数据库名称
    private $db_name = 'doo_app';
    // 数据库用户名
    private $username = 'root';
    // 数据库密码
    private $password = '320722';
    // 数据库连接对象
    public $conn;

    // 获取数据库连接方法
    public function getConnection() {
        // 初始化连接为null
        $this->conn = null;
        try {
            // 创建PDO连接实例
            // 使用MySQL驱动，连接到指定主机和数据库
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // 设置字符集为UTF-8，支持中文
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // 记录连接错误日志
            error_log("Connection error: " . $exception->getMessage());
            // 抛出异常，包含错误信息
            throw new Exception("数据库连接失败: " . $exception->getMessage());
        }
        // 返回数据库连接对象
        return $this->conn;
    }
}
?>