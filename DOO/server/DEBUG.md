# 注册功能调试指南

## 已修复问题
 
 ### 1. 路径问题修复
 - **问题**: PHP 文件无法找到 config/Database.php
 - **修复**: 使用 `__DIR__ . '/../config/Database.php'` 绝对路径
 - **影响文件**: register.php, login.php, update_user.php
 
 ### 2. 数据读取修复
 - **问题**: JSON 数据读取不正确
 - **修复**: 先读取原始数据再解析
 - **影响文件**: login.php, update_user.php
 
 ### 3. 调试功能
 - **添加**: GET 请求测试接口是否正常运行
 - **添加**: PHP 错误显示开启
 
 ### 4. 上传功能修复
 - **问题**: upload.php 语法错误（`$_FILES` 数组缺少括号）
 - **修复**: 修复所有 `$_FILES` 数组访问语法
 - **问题**: 文件URL返回不正确
 - **修复**: 使用 `$_SERVER` 动态生成正确的URL
 - **问题**: 前端错误处理不完善
 - **修复**: 添加详细的调试日志和错误处理
 - **添加**: GET 请求测试上传API
 
 ## 问题排查步骤

### 1. 测试PHP后端是否正常运行

在浏览器中访问以下URL测试API是否正常：

```
http://localhost/DOO/server/api/register.php
```

如果看到以下JSON响应，说明PHP运行正常：

```json
{
  "message": "API运行正常",
  "code": 200,
  "server_info": {
    "php_version": "8.x.x",
    "request_method": "GET",
    "content_type": "not set"
  }
}
```

### 2. 检查数据库连接

确保：
- MySQL服务正在运行
- 数据库 `doo_app` 已创建
- 数据库用户名和密码正确

编辑 `server/config/Database.php` 修改数据库配置：

```php
private $host = 'localhost';        // 数据库主机
private $db_name = 'doo_app';     // 数据库名
private $username = 'root';         // 数据库用户名
private $password = '';             // 数据库密码
```

### 3. 检查PHP错误

register.php 文件已开启错误显示，如果PHP有错误会直接显示在响应中。

### 4. 检查前端API地址

在以下文件中确认API地址正确：

- `pages/login/login.vue` (第16行)
- `pages/tabbar/tabbar-5/tabbar-5.vue` (第88行)

确保 `apiBase` 的值为你的实际服务器地址：

```javascript
apiBase: 'http://localhost/DOO/server/api/'
```

### 5. 检查浏览器控制台

打开浏览器开发者工具（F12），查看Console标签页的错误信息。

### 6. 检查网络请求

在开发者工具的Network标签页中，查看register.php请求的详细信息：
- 请求URL是否正确
- 请求方法是否为POST
- 请求头是否包含Content-Type: application/json
- 响应状态码是什么
- 响应内容是什么

### 7. 测试上传功能

在浏览器中访问以下URL测试上传API：

```
http://localhost/DOO/server/api/upload.php
```

应该看到：

```json
{
  "message": "上传API运行正常",
  "code": 200,
  "server_info": {
    "php_version": "7.x.x",
    "upload_dir": "D:\\wwwroot\\192.168.1.12\\DOO\\server\\uploads/",
    "dir_exists": true,
    "dir_writable": true,
    "request_method": "GET"
  }
}
```

如果 `dir_writable` 为 `false`，需要给 uploads 目录添加写入权限。

### 8. 查看上传日志

打开浏览器控制台（F12），查看以下日志：
- "开始上传图片:" - 显示上传的文件路径和类型
- "上传响应:" - 显示服务器返回的完整响应
- "解析后的数据:" - 显示解析后的JSON数据
- "上传错误:" - 显示上传过程中的错误

## 常见问题

### 问题1: 显示"网络错误"

**原因**: PHP后端未运行或URL错误

**解决方法**:
1. 确保PHP服务器正在运行
2. 检查API地址是否正确
3. 使用浏览器直接访问API地址测试

### 问题2: 显示"用户名和密码不能为空"

**原因**: 前端发送的数据格式不正确

**解决方法**: 检查前端代码中uni.request的data参数格式

### 问题3: PHP语法错误

**原因**: PHP文件中有语法错误

**解决方法**: 查看PHP错误日志或浏览器响应中的错误信息

## 测试数据

使用Postman或curl测试注册接口：

```bash
curl -X POST http://localhost/DOO/server/api/register.php \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

## 上传目录权限

确保 `server/uploads/` 目录存在且具有写入权限：

```bash
mkdir -p server/uploads
chmod 777 server/uploads
```
