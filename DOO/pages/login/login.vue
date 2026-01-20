<template>
	<!-- 页面容器 -->
	<view class="content">
		<!-- 状态栏占位，适配不同设备的状态栏高度 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 背景横幅区域 -->
		<view class="background-banner" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }">
			<!-- 横幅遮罩层，添加渐变效果 -->
			<view class="banner-overlay"></view>
		</view>
		
		<!-- 登录/注册表单容器 -->
		<view class="login-container">
			<!-- Logo和App名称区域 -->
			<view class="logo-section">
				<!-- App Logo -->
				<image class="logo" src="../../static/logo.png" mode="aspectFit"></image>
				<!-- App名称 -->
				<text class="app-name">DOO</text>
			</view>
			
			<!-- 表单区域 -->
			<view class="form-section">
				<!-- 用户名输入框 -->
				<view class="form-item">
					<text class="label">用户名</text>
					<input class="input" v-model="username" placeholder="请输入用户名" />
				</view>
				
				<!-- 密码输入框 -->
				<view class="form-item">
					<text class="label">密码</text>
					<input class="input" v-model="password" type="password" placeholder="请输入密码" />
				</view>
				
				<!-- 确认密码输入框（仅在注册模式下显示） -->
				<view class="form-item" v-if="isRegister">
					<text class="label">确认密码</text>
					<input class="input" v-model="confirmPassword" type="password" placeholder="请再次输入密码" />
				</view>
				
				<!-- 提交按钮，根据模式显示"注册"或"登录" -->
				<button class="btn-primary" @click="handleSubmit">{{ isRegister ? '注册' : '登录' }}</button>
				
				<!-- 切换登录/注册模式 -->
				<view class="switch-mode">
					<text class="switch-text">{{ isRegister ? '已有账号？' : '没有账号？' }}</text>
					<text class="switch-link" @click="toggleMode">{{ isRegister ? '立即登录' : '立即注册' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 导出Vue组件
export default {
	// 组件数据
	data() {
		return {
			// 用户名
			username: '',
			// 密码
			password: '',
			// 确认密码（注册时使用）
			confirmPassword: '',
			// 是否为注册模式（false=登录，true=注册）
			isRegister: false,
			// 背景图片URL
			backgroundUrl: 'https://via.placeholder.com/750x800/f33e54/ffffff?text=Background',
			// 状态栏高度（适配不同设备）
			statusBarHeight: 0,
			// API基础地址
			apiBase: 'http://192.168.1.12/DOO/server/api/'
		}
	},
	// 页面加载时执行
	onLoad() {
		// 获取系统信息，包括状态栏高度
		const systemInfo = uni.getSystemInfoSync();
		// 设置状态栏高度
		this.statusBarHeight = systemInfo.statusBarHeight || 0;
		
		// 检查本地是否已存储用户信息
		const userInfo = uni.getStorageSync('userInfo');
		// 如果已登录，直接跳转到发布页面
		if (userInfo) {
			uni.switchTab({
				url: '/pages/tabbar/tabbar-5/tabbar-5'
			});
		}
	},
	// 组件方法
	methods: {
		// 切换登录/注册模式
		toggleMode() {
			// 切换模式标志
			this.isRegister = !this.isRegister;
			// 清空表单数据
			this.username = '';
			this.password = '';
			this.confirmPassword = '';
		},
		
		// 处理表单提交（登录或注册）
		async handleSubmit() {
			// 验证必填字段
			if (!this.username || !this.password) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				});
				return;
			}
			
			// 根据模式执行不同操作
			if (this.isRegister) {
				// 注册模式：验证密码一致性
				if (this.password !== this.confirmPassword) {
					uni.showToast({
							title: '两次密码不一致',
							icon: 'none'
						});
						return;
					}
					// 执行注册
					await this.register();
				} else {
					// 登录模式：执行登录
					await this.login();
				}
			},
			
		// 用户注册
		async register() {
			// 显示加载提示
			uni.showLoading({
					title: '注册中...'
				});
				
				try {
					// 发送注册请求到后端API
					const res = await uni.request({
						url: this.apiBase + 'register.php',
						method: 'POST',
						data: {
							username: this.username,
							password: this.password
						},
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					// 隐藏加载提示
					uni.hideLoading();
					
					// 输出响应日志
					console.log('注册响应:', res);
					
					// 判断注册结果
					if (res.statusCode === 201) {
						// 注册成功
						uni.showToast({
							title: '注册成功，请登录',
							icon: 'success'
						});
						// 切换到登录模式
						this.isRegister = false;
					} else {
						// 注册失败
						uni.showToast({
							title: res.data.message || '注册失败',
							icon: 'none'
						});
					}
				} catch (error) {
					// 隐藏加载提示
					uni.hideLoading();
					// 输出错误日志
					console.error('注册错误:', error);
					// 显示错误提示
					uni.showToast({
						title: '网络错误，请检查后端服务',
						icon: 'none'
					});
				}
			},
			
		// 用户登录
		async login() {
			// 显示加载提示
			uni.showLoading({
					title: '登录中...'
				});
				
				try {
					// 发送登录请求到后端API
					const res = await uni.request({
						url: this.apiBase + 'login.php',
						method: 'POST',
						data: {
							username: this.username,
							password: this.password
						},
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					// 隐藏加载提示
					uni.hideLoading();
					
					// 输出响应日志
					console.log('登录响应:', res);
					
					// 判断登录结果
					if (res.statusCode === 200) {
						// 登录成功
						const userInfo = res.data.data;
						// 存储用户信息到本地
						uni.setStorageSync('userInfo', userInfo);
						uni.setStorageSync('userId', userInfo.id);
						uni.setStorageSync('isLoggedIn', true);
						
						// 显示成功提示
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						
						// 延迟跳转到发布页面
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabbar/tabbar-5/tabbar-5'
							});
						}, 1500);
					} else {
						// 登录失败
						uni.showToast({
							title: res.data.message || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					// 隐藏加载提示
					uni.hideLoading();
					// 输出错误日志
					console.error('登录错误:', error);
					// 显示错误提示
					uni.showToast({
						title: '网络错误，请检查后端服务',
						icon: 'none'
					});
				}
		}
	}
}
</script>

<style lang="scss" scoped>
/* 页面容器样式 */
.content {
	padding: 0;
	background-color: #f5f5f5;
	min-height: 100vh;
}

/* 状态栏样式 */
.status-bar {
	width: 100%;
	background-color: transparent;
}

/* 背景横幅样式 */
.background-banner {
	width: 100%;
	height: 500upx;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: relative;
}

/* 横幅遮罩层样式 */
.banner-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
}

/* 登录容器样式 */
.login-container {
	margin: -100upx 30upx 0 30upx;
	position: relative;
	z-index: 2;
}

/* Logo区域样式 */
.logo-section {
	background-color: #ffffff;
	border-radius: 20upx;
	padding: 40upx;
	text-align: center;
	margin-bottom: 20upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.08);
}

/* Logo图片样式 */
.logo {
	width: 120upx;
	height: 120upx;
	margin-bottom: 20upx;
}

/* App名称样式 */
.app-name {
	font-size: 48upx;
	font-weight: bold;
	color: #f33e54;
}

/* 表单区域样式 */
.form-section {
	background-color: #ffffff;
	border-radius: 20upx;
	padding: 40upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.08);
}

/* 表单项样式 */
.form-item {
	margin-bottom: 30upx;
}

/* 标签样式 */
.label {
	display: block;
	font-size: 28upx;
	color: #666;
	margin-bottom: 15upx;
}

/* 输入框样式 */
.input {
	width: 100%;
	height: 80upx;
	border: 2upx solid #e0e0e0;
	border-radius: 10upx;
	padding: 0 20upx;
	font-size: 30upx;
	box-sizing: border-box;
}

/* 输入框聚焦样式 */
.input:focus {
	border-color: #f33e54;
}

/* 主按钮样式 */
.btn-primary {
	width: 100%;
	height: 90upx;
	line-height: 90upx;
	background: linear-gradient(135deg, #f33e54 0%, #ff6b6b 100%);
	color: #ffffff;
	border-radius: 45upx;
	font-size: 32upx;
	font-weight: bold;
	border: none;
	margin-top: 20upx;
}

/* 切换模式区域样式 */
.switch-mode {
	text-align: center;
	margin-top: 40upx;
}

/* 切换文本样式 */
.switch-text {
	font-size: 28upx;
	color: #999;
}

/* 切换链接样式 */
.switch-link {
	font-size: 28upx;
	color: #f33e54;
	margin-left: 10upx;
}
</style>