# DOO 项目后端配置说明

## 数据库配置

### 1. 创建数据库

执行 `server/database.sql` 文件来创建数据库和用户表：

```bash
mysql -u root -p < server/database.sql
```

或者手动在MySQL中执行SQL语句。

### 2. 修改数据库配置

编辑 `server/config/Database.php` 文件，修改数据库连接信息：

```php
private $host = 'localhost';        // 数据库主机
private $db_name = 'doo_app';     // 数据库名
private $username = 'root';         // 数据库用户名
private $password = '';             // 数据库密码
```

## 后端API接口

### 1. 用户注册

- **接口地址**: `http://localhost/DOO/server/api/register.php`
- **请求方式**: POST
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **返回示例**:
  ```json
  {
    "message": "注册成功",
    "code": 201,
    "data": {
      "username": "用户名"
    }
  }
  ```

### 2. 用户登录

- **接口地址**: `http://localhost/DOO/server/api/login.php`
- **请求方式**: POST
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **返回示例**:
  ```json
  {
    "message": "登录成功",
    "code": 200,
    "data": {
      "id": 1,
      "username": "用户名",
      "nickname": "昵称",
      "avatar": "头像URL",
      "background_image": "背景图片URL",
      "followers": 0,
      "following": 0,
      "likes": 0
    }
  }
  ```

### 3. 更新用户信息

- **接口地址**: `http://localhost/DOO/server/api/update_user.php`
- **请求方式**: POST
- **请求参数**:
  ```json
  {
    "user_id": 1,
    "nickname": "新昵称",
    "avatar": "头像URL",
    "background_image": "背景图片URL"
  }
  ```
- **返回示例**:
  ```json
  {
    "message": "更新成功",
    "code": 200
  }
  ```

### 4. 文件上传

- **接口地址**: `http://localhost/DOO/server/api/upload.php`
- **请求方式**: POST (multipart/form-data)
- **请求参数**:
  - `file`: 图片文件（支持JPG、PNG、GIF格式，最大5MB）
- **返回示例**:
  ```json
  {
    "message": "上传成功",
    "code": 200,
    "data": {
      "url": "http://localhost/DOO/server/uploads/xxx.jpg",
      "filename": "xxx.jpg"
    }
  }
  ```

## 前端配置

### 1. 修改API地址

在以下文件中修改 `apiBase` 地址：

- `pages/login/login.vue`
- `pages/tabbar/tabbar-5/tabbar-5.vue`

将 `http://localhost/DOO/server/api/` 修改为你的实际服务器地址。

### 2. 启动项目

使用HBuilderX或命令行启动项目：

```bash
npm run dev:h5
```

## 功能说明

### 登录注册页面

- 支持用户注册和登录
- 密码加密存储（使用PHP password_hash）
- 登录成功后跳转到"我"页面
- 自动检测登录状态

### 个人中心页面

- 显示用户头像、昵称、统计数据
- 未登录状态显示登录/注册按钮
- 已登录状态显示编辑资料按钮
- 支持上传自定义背景图片
- 登录后才能更换背景

### 数据存储

- 用户信息存储在本地Storage中
- 登录状态持久化
- 页面刷新后自动加载用户信息

## 注意事项

1. **文件上传目录权限**: 确保 `server/uploads/` 目录具有写入权限
2. **CORS配置**: 后端API已配置CORS，允许跨域请求
3. **密码安全**: 密码使用PHP的password_hash加密存储
4. **图片限制**: 上传图片限制为5MB，仅支持JPG、PNG、GIF格式
5. **API地址**: 根据实际部署环境修改API基础地址

## 目录结构

```
DOO/
├── server/
│   ├── api/
│   │   ├── register.php        # 注册接口
│   │   ├── login.php          # 登录接口
│   │   ├── update_user.php     # 更新用户信息接口
│   │   └── upload.php        # 文件上传接口
│   ├── config/
│   │   └── Database.php       # 数据库配置
│   ├── uploads/               # 上传文件存储目录
│   └── database.sql          # 数据库表结构
├── pages/
│   ├── login/
│   │   └── login.vue         # 登录注册页面
│   └── tabbar/
│       └── tabbar-5/
│           └── tabbar-5.vue   # 个人中心页面
└── pages.json               # 页面配置
```
