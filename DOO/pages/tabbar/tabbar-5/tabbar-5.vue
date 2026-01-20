<template>
	<view class="content">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="background-banner" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }" @click="changeBackground">
			<view class="banner-overlay"></view>
		</view>
		<view class="user-card">
			<view class="avatar-wrapper" @click="changeAvatar">
				<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="nickname">{{ nickname }}</text>
				<view class="user-stats" v-if="isLoggedIn">
					<text class="stat-item">粉丝 0</text>
					<text class="stat-divider">|</text>
					<text class="stat-item">关注 0</text>
					<text class="stat-divider">|</text>
					<text class="stat-item">获赞 0</text>
				</view>
			</view>
			<view class="button-group" v-if="!isLoggedIn">
				<button class="btn btn-login" @click="handleLogin">登录</button>
				<button class="btn btn-register" @click="handleRegister">注册</button>
			</view>
			<view class="edit-btn" v-else @click="goToEditProfile">
			<text class="edit-text">编辑资料</text>
		</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-item" @click="handleMenuClick('myPosts')">
				<view class="menu-icon">
					<text class="icon-text">📝</text>
				</view>
				<text class="menu-text">我的帖子</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleMenuClick('myVideos')">
				<view class="menu-icon">
					<text class="icon-text">🎬</text>
				</view>
				<text class="menu-text">我的视频</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleMenuClick('myQuestions')">
				<view class="menu-icon">
					<text class="icon-text">❓</text>
				</view>
				<text class="menu-text">我的提问</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleMenuClick('favorites')">
				<view class="menu-icon">
					<text class="icon-text">⭐</text>
				</view>
				<text class="menu-text">我的收藏</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleMenuClick('aboutUs')">
				<view class="menu-icon">
					<text class="icon-text">ℹ️</text>
				</view>
				<text class="menu-text">关于我们</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleChangePassword">
				<view class="menu-icon">
					<text class="icon-text">🔑</text>
				</view>
				<text class="menu-text">修改密码</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="handleLogout">
				<view class="menu-icon">
					<text class="icon-text">🚪</text>
				</view>
				<text class="menu-text">退出登录</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<view class="password-modal" v-if="showPasswordModal" @click.self="showPasswordModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">修改密码</text>
					<text class="modal-close" @click="showPasswordModal = false">✕</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="label">原密码</text>
						<view class="input-wrapper">
							<input 
								class="input" 
								v-model="oldPassword" 
								:type="showOldPassword ? 'text' : 'password'" 
								placeholder="请输入原密码" 
								:placeholder-style="{ color: '#999999' }"
							/>
							<text class="toggle-password" @click="showOldPassword = !showOldPassword">
								{{ showOldPassword ? '隐藏' : '显示' }}
							</text>
						</view>
					</view>
					<view class="form-item">
						<text class="label">新密码</text>
						<view class="input-wrapper">
							<input 
								class="input" 
								v-model="newPassword" 
								:type="showNewPassword ? 'text' : 'password'" 
								placeholder="请输入新密码（6-20位）" 
								:placeholder-style="{ color: '#999999' }"
								maxlength="20"
								@input="checkPasswordStrength"
							/>
							<text class="toggle-password" @click="showNewPassword = !showNewPassword">
								{{ showNewPassword ? '隐藏' : '显示' }}
							</text>
						</view>
						<view class="password-strength" v-if="newPassword">
							<text class="strength-label">密码强度:</text>
							<view class="strength-bar">
								<view class="strength-fill" :class="passwordStrength.class"></view>
							</view>
							<text class="strength-text" :class="passwordStrength.class">{{ passwordStrength.text }}</text>
						</view>
					</view>
					<view class="form-item">
						<text class="label">确认密码</text>
						<view class="input-wrapper">
							<input 
								class="input" 
								v-model="confirmPassword" 
								:type="showConfirmPassword ? 'text' : 'password'" 
								placeholder="请再次输入新密码" 
								:placeholder-style="{ color: '#999999' }"
								@input="checkPasswordMatch"
							/>
							<text class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
								{{ showConfirmPassword ? '隐藏' : '显示' }}
							</text>
						</view>
						<text class="match-hint" v-if="confirmPassword">
							<text class="match-success" v-if="passwordMatch">✓ 密码一致</text>
							<text class="match-error" v-else>✗ 密码不一致</text>
						</text>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showPasswordModal = false">取消</button>
					<button class="btn-confirm" @click="confirmChangePassword" :disabled="!canSubmit">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: 'https://via.placeholder.com/150',
				nickname: '未登录',
				isLoggedIn: false,
				backgroundUrl: 'https://via.placeholder.com/750x450/f33e54/ffffff?text=Background',
				statusBarHeight: 0,
				userInfo: null,
				apiBase: 'http://192.168.1.12/DOO/server/api/',
				showPasswordModal: false,
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				showOldPassword: false,
				showNewPassword: false,
				showConfirmPassword: false,
				passwordStrength: { score: 0, text: '', class: '' },
				passwordMatch: false
			}
		},
		computed: {
			canSubmit() {
				return this.oldPassword && 
				       this.newPassword && 
				       this.confirmPassword && 
				       this.newPassword === this.confirmPassword && 
				       this.newPassword.length >= 6;
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 0;
			
			this.loadUserInfo();
		},
		onShow() {
			this.loadUserInfo();
		},
		methods: {
			loadUserInfo() {
				const userInfo = uni.getStorageSync('userInfo');
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				
				console.log('loadUserInfo - 从存储读取:', userInfo);
				console.log('loadUserInfo - 登录状态:', isLoggedIn);
				
				if (isLoggedIn && userInfo) {
					this.isLoggedIn = true;
					this.userInfo = userInfo;
					this.nickname = userInfo.nickname || userInfo.username;
					this.avatarUrl = userInfo.avatar || 'https://via.placeholder.com/150';
					this.backgroundUrl = userInfo.background_image || 'https://via.placeholder.com/750x450/f33e54/ffffff?text=Background';
					console.log('loadUserInfo - 头像URL:', this.avatarUrl);
					console.log('loadUserInfo - 背景URL:', this.backgroundUrl);
				} else {
					this.isLoggedIn = false;
					this.userInfo = null;
					this.nickname = '未登录';
					this.avatarUrl = 'https://via.placeholder.com/150';
					this.backgroundUrl = 'https://via.placeholder.com/750x450/f33e54/ffffff?text=Background';
					console.log('loadUserInfo - 未登录，使用默认值');
				}
			},
			
			handleLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			
			handleRegister() {
				uni.navigateTo({
					url: '/pages/login/login?mode=register'
				});
			},
			
			handleEdit() {
				uni.showToast({
					title: '编辑资料功能开发中',
					icon: 'none'
				});
			},
			
			goToEditProfile() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				uni.navigateTo({
					url: '/pages/edit-profile/edit-profile'
				});
			},
			
			changeAvatar() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0];
						await this.uploadImage(tempFilePath, 'avatar');
					}
				});
			},
			
			changeBackground() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0];
						await this.uploadImage(tempFilePath, 'background');
					}
				});
			},
			
			async uploadImage(filePath, type) {
				uni.showLoading({
					title: '上传中...'
				});
				
				try {
					console.log('开始上传图片:', filePath, type);
					
					const uploadRes = await uni.uploadFile({
						url: this.apiBase + 'upload.php',
						filePath: filePath,
						name: 'file'
					});
					
					console.log('上传响应:', uploadRes);
					console.log('响应状态码:', uploadRes.statusCode);
					console.log('响应数据:', uploadRes.data);
					
					if (!uploadRes.data) {
						uni.hideLoading();
						uni.showToast({
							title: '上传失败，服务器未返回数据',
							icon: 'none'
						});
						return;
					}
					
					let data;
					try {
						data = JSON.parse(uploadRes.data);
					} catch (e) {
						uni.hideLoading();
						console.error('JSON解析失败:', e, uploadRes.data);
						uni.showToast({
							title: '服务器返回数据格式错误',
							icon: 'none'
						});
						return;
					}
					
					console.log('解析后的数据:', data);
					
					if (data.code === 200) {
						const imageUrl = data.data.url;
						console.log('获取到的图片URL:', imageUrl);
						
						if (type === 'avatar') {
							console.log('更新头像:', imageUrl);
							this.avatarUrl = imageUrl;
							await this.updateUserInfo({ avatar: imageUrl });
							console.log('头像已设置:', this.avatarUrl);
						} else if (type === 'background') {
							console.log('更新背景:', imageUrl);
							this.backgroundUrl = imageUrl;
							await this.updateUserInfo({ background_image: imageUrl });
							console.log('背景已设置:', this.backgroundUrl);
						}
						
						uni.hideLoading();
						uni.showToast({
							title: '上传成功',
							icon: 'success'
						});
					} else {
						uni.hideLoading();
						uni.showToast({
							title: data.message || '上传失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('上传错误:', error);
					uni.showToast({
						title: '上传失败，请检查网络连接',
						icon: 'none'
					});
				}
			},
			
			async updateUserInfo(data) {
				try {
					console.log('更新用户信息:', data);
					
					const res = await uni.request({
						url: this.apiBase + 'update_user.php',
						method: 'POST',
						data: {
							user_id: this.userInfo.id,
							...data
						},
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					console.log('更新响应:', res);
					console.log('响应状态码:', res.statusCode);
					console.log('响应数据:', res.data);
					
					if (res.statusCode === 200) {
						const updatedUserInfo = { ...this.userInfo, ...data };
						this.userInfo = updatedUserInfo;
						uni.setStorageSync('userInfo', updatedUserInfo);
						console.log('用户信息已更新:', updatedUserInfo);
						
						if (data.avatar) {
							this.avatarUrl = data.avatar;
							console.log('头像已更新到视图:', this.avatarUrl);
						}
						if (data.background_image) {
							this.backgroundUrl = data.background_image;
							console.log('背景已更新到视图:', this.backgroundUrl);
						}
						
						this.$forceUpdate();
					} else {
						console.error('更新失败:', res.data);
					}
				} catch (error) {
					console.error('更新用户信息失败:', error);
				}
			},
			
			checkPasswordStrength() {
				if (!this.newPassword) {
					this.passwordStrength = { score: 0, text: '', class: '' };
					return;
				}
				
				let score = 0;
				const password = this.newPassword;
				
				if (password.length >= 6) score++;
				if (password.length >= 10) score++;
				if (password.length >= 12) score++;
				
				if (/[a-z]/.test(password)) score++;
				if (/[A-Z]/.test(password)) score++;
				if (/[0-9]/.test(password)) score++;
				if (/[^a-zA-Z0-9]/.test(password)) score++;
				
				if (score <= 2) {
					this.passwordStrength = { score, text: '弱', class: 'weak' };
				} else if (score <= 4) {
					this.passwordStrength = { score, text: '中', class: 'medium' };
				} else {
					this.passwordStrength = { score, text: '强', class: 'strong' };
				}
			},
			
			checkPasswordMatch() {
				if (!this.confirmPassword) {
					this.passwordMatch = false;
					return;
				}
				this.passwordMatch = this.newPassword === this.confirmPassword;
			},
			
			handleChangePassword() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				this.showPasswordModal = true;
				this.oldPassword = '';
				this.newPassword = '';
				this.confirmPassword = '';
			},
			
			async confirmChangePassword() {
				if (!this.canSubmit) {
					return;
				}
				
				uni.showLoading({
					title: '修改中...'
				});
				
				try {
					const res = await uni.request({
						url: this.apiBase + 'change_password.php',
						method: 'POST',
						data: {
							user_id: this.userInfo.id,
							old_password: this.oldPassword,
							new_password: this.newPassword
						},
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					uni.hideLoading();
					
					console.log('修改密码响应:', res);
					
					if (res.statusCode === 200) {
						uni.showToast({
							title: '密码修改成功',
							icon: 'success'
						});
						
						this.showPasswordModal = false;
						this.oldPassword = '';
						this.newPassword = '';
						this.confirmPassword = '';
						this.passwordStrength = { score: 0, text: '', class: '' };
						this.passwordMatch = false;
					} else {
						uni.showToast({
							title: res.data.message || '密码修改失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('修改密码错误:', error);
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
			},
			
			handleLogout() {
				if (!this.isLoggedIn) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('isLoggedIn');
							
							this.isLoggedIn = false;
							this.userInfo = null;
							this.nickname = '未登录';
							this.avatarUrl = 'https://via.placeholder.com/150';
							this.backgroundUrl = 'https://via.placeholder.com/750x450/f33e54/ffffff?text=Background';
							
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							});
						}
					}
				});
			},
			
			handleMenuClick(type) {
				const menuMap = {
					myPosts: '我的帖子',
					myVideos: '我的视频',
					myQuestions: '我的提问',
					favorites: '我的收藏',
					aboutUs: '关于我们'
				};
				uni.showToast({
					title: menuMap[type],
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.status-bar {
		width: 100%;
		background-color: transparent;
	}

	.background-banner {
		width: 100%;
		height: 450upx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
	}

	.banner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
	}

	.user-card {
		background-color: #ffffff;
		border-radius: 20upx;
		padding: 40upx 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.08);
		margin: -80upx 30upx 20upx 30upx;
		position: relative;
		z-index: 2;
	}

	.avatar-wrapper {
		margin-right: 30upx;
	}

	.avatar {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		border: 4upx solid #ffffff;
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.15);
	}

	.user-info {
		flex: 1;
		margin-right: 20upx;
	}

	.nickname {
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 15upx;
	}

	.user-stats {
		display: flex;
		align-items: center;
		font-size: 24upx;
		color: #999999;
	}

	.stat-item {
		margin: 0 8upx;
	}

	.stat-divider {
		margin: 0 8upx;
		color: #e0e0e0;
	}

	.button-group {
		display: flex;
		gap: 20upx;
	}

	.btn {
		padding: 0 30upx;
		height: 70upx;
		line-height: 70upx;
		border-radius: 35upx;
		font-size: 28upx;
		font-weight: 500;
		border: none;
		margin: 0;
	}

	.btn-login {
		background: linear-gradient(135deg, #f33e54 0%, #ff6b6b 100%);
		color: #ffffff;
	}

	.btn-register {
		background: #ffffff;
		color: #f33e54;
		border: 2upx solid #f33e54;
	}

	.edit-btn {
		padding: 0 30upx;
		height: 70upx;
		line-height: 70upx;
		border-radius: 35upx;
		border: 2upx solid #f33e54;
		background: #ffffff;
	}

	.edit-text {
		font-size: 28upx;
		color: #f33e54;
		font-weight: 500;
	}

	.menu-list {
		background-color: #ffffff;
		border-radius: 20upx;
		overflow: hidden;
		box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.08);
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 35upx 30upx;
		border-bottom: 1upx solid #f0f0f0;
		position: relative;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-icon {
		width: 50upx;
		height: 50upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20upx;
	}

	.icon-text {
		font-size: 36upx;
	}

	.menu-text {
		flex: 1;
		font-size: 30upx;
		color: #333333;
	}

	.menu-arrow {
		font-size: 40upx;
		color: #cccccc;
		font-weight: 300;
	}

	.password-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 20upx;
		box-sizing: border-box;
	}

	.modal-content {
		background-color: #ffffff;
		border-radius: 20upx;
		padding: 40upx;
		width: 85%;
		max-width: 650upx;
		max-height: 90vh;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30upx;
	}

	.modal-title {
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
	}

	.modal-close {
		font-size: 40upx;
		color: #999999;
		cursor: pointer;
	}

	.modal-body {
		margin-bottom: 30upx;
	}

	.form-item {
		margin-bottom: 25upx;
	}

	.label {
		font-size: 28upx;
		color: #333333;
		display: block;
		margin-bottom: 12upx;
		font-weight: 500;
	}

	.input {
		width: 100%;
		height: 80upx;
		border: 2upx solid #e0e0e0;
		border-radius: 10upx;
		padding: 0 80upx 0 20upx;
		font-size: 28upx;
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.input:focus {
		border-color: #f33e54;
		outline: none;
	}

	.modal-footer {
		display: flex;
		gap: 20upx;
	}

	.btn-cancel {
		flex: 1;
		height: 80upx;
		line-height: 80upx;
		background: #f0f0f0;
		color: #333333;
		border-radius: 40upx;
		font-size: 28upx;
		border: none;
	}

	.btn-confirm {
		flex: 1;
		height: 80upx;
		line-height: 80upx;
		background: linear-gradient(135deg, #f33e54 0%, #ff6b6b 100%);
		color: #ffffff;
		border-radius: 40upx;
		font-size: 28upx;
		font-weight: bold;
		border: none;
	}

	.btn-confirm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.toggle-password {
		position: absolute;
		right: 20upx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 28upx;
		color: #999999;
		cursor: pointer;
		user-select: none;
		padding: 10upx;
	}

	.password-strength {
		display: flex;
		align-items: center;
		margin-top: 15upx;
		padding: 15upx;
		background-color: #f8f9fa;
		border-radius: 10upx;
	}

	.strength-label {
		font-size: 24upx;
		color: #666666;
		margin-right: 15upx;
	}

	.strength-bar {
		flex: 1;
		height: 6upx;
		background-color: #e0e0e0;
		border-radius: 3upx;
		overflow: hidden;
	}

	.strength-fill {
		height: 100%;
		width: 0;
		transition: width 0.3s ease;
	}

	.strength-fill.weak {
		width: 33%;
		background-color: #ff4757;
	}

	.strength-fill.medium {
		width: 66%;
		background-color: #ffa502;
	}

	.strength-fill.strong {
		width: 100%;
		background-color: #2ed573;
	}

	.strength-text {
		font-size: 24upx;
		margin-left: 10upx;
	}

	.strength-text.weak {
		color: #ff4757;
	}

	.strength-text.medium {
		color: #ffa502;
	}

	.strength-text.strong {
		color: #2ed573;
	}

	.match-hint {
		display: flex;
		align-items: center;
		margin-top: 10upx;
		padding: 10upx 15upx;
		border-radius: 8upx;
	}

	.match-success {
		color: #2ed573;
		background-color: #d4edda;
		font-size: 24upx;
	}

	.match-error {
		color: #ff4757;
		background-color: #ffeaea;
		font-size: 24upx;
	}
</style>
