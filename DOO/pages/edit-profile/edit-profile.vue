<template>
	<view class="content">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<view class="header">
			<view class="nav-bar">
				<text class="nav-back" @click="goBack">‹</text>
				<text class="nav-title">编辑资料</text>
				<text class="nav-save" @click="saveProfile">保存</text>
			</view>
		</view>
		
		<view class="profile-section">
			<view class="avatar-section" @click="changeAvatar">
				<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
				<view class="avatar-edit">
					<text class="edit-icon">📷</text>
					<text class="edit-text">更换头像</text>
				</view>
			</view>
			
			<view class="form-section">
				<view class="form-item">
					<text class="label">昵称</text>
					<input class="input" v-model="nickname" placeholder="请输入昵称" maxlength="20" />
					<text class="count">{{ nickname.length }}/20</text>
				</view>
				
				<view class="form-item">
					<text class="label">性别</text>
					<view class="gender-options">
						<view 
							class="gender-option" 
							:class="{ active: gender === 'male' }"
							@click="gender = 'male'"
						>
							<text class="gender-icon">♂</text>
							<text class="gender-text">男</text>
						</view>
						<view 
							class="gender-option" 
							:class="{ active: gender === 'female' }"
							@click="gender = 'female'"
						>
							<text class="gender-icon">♀</text>
							<text class="gender-text">女</text>
						</view>
						<view 
							class="gender-option" 
							:class="{ active: gender === 'secret' }"
							@click="gender = 'secret'"
						>
							<text class="gender-icon">?</text>
							<text class="gender-text">保密</text>
						</view>
					</view>
				</view>
				
				<view class="form-item">
					<text class="label">生日</text>
					<picker mode="date" :value="birthday" @change="onBirthdayChange">
						<view class="picker">
							<text class="picker-text">{{ birthday || '请选择生日' }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="label">地区</text>
					<picker mode="region" :value="region" @change="onRegionChange">
						<view class="picker">
							<text class="picker-text">{{ region || '请选择地区' }}</text>
							<text class="picker-arrow">›</text>
						</view>
					</picker>
				</view>
				
				<view class="form-item textarea-item">
					<text class="label">个人简介</text>
					<textarea 
						class="textarea" 
						v-model="bio" 
						placeholder="介绍一下自己吧..." 
						maxlength="200"
						@input="onBioInput"
					></textarea>
					<text class="count">{{ bio.length }}/200</text>
				</view>
			</view>
		</view>
		
		<view class="upload-modal" v-if="showUploadModal" @click.self="showUploadModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择头像</text>
					<text class="modal-close" @click="showUploadModal = false">✕</text>
				</view>
				<view class="modal-body">
					<view class="upload-option" @click="chooseFromAlbum">
						<text class="upload-icon">🖼️</text>
						<text class="upload-text">从相册选择</text>
					</view>
					<view class="upload-option" @click="takePhoto">
						<text class="upload-icon">📷</text>
						<text class="upload-text">拍照</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				userInfo: null,
				avatarUrl: 'https://via.placeholder.com/150',
				nickname: '',
				gender: 'secret',
				birthday: '',
				region: '',
				bio: '',
				showUploadModal: false,
				apiBase: 'http://192.168.1.12/DOO/server/api/'
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 0;
			
			this.loadUserInfo();
		},
		methods: {
			loadUserInfo() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.userInfo = userInfo;
					this.avatarUrl = userInfo.avatar || 'https://via.placeholder.com/150';
					this.nickname = userInfo.nickname || userInfo.username || '';
					this.gender = userInfo.gender || 'secret';
					this.birthday = userInfo.birthday || '';
					this.region = userInfo.region || '';
					this.bio = userInfo.bio || '';
				}
			},
			
			goBack() {
				uni.navigateBack();
			},
			
			changeAvatar() {
				this.showUploadModal = true;
			},
			
			chooseFromAlbum() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0];
						await this.uploadAvatar(tempFilePath);
						this.showUploadModal = false;
					}
				});
			},
			
			takePhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['camera'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0];
						await this.uploadAvatar(tempFilePath);
						this.showUploadModal = false;
					}
				});
			},
			
			async uploadAvatar(filePath) {
				uni.showLoading({
					title: '上传中...'
				});
				
				try {
					const uploadRes = await uni.uploadFile({
						url: this.apiBase + 'upload.php',
						filePath: filePath,
						name: 'file'
					});
					
					const data = JSON.parse(uploadRes.data);
					
					if (data.code === 200) {
						this.avatarUrl = data.data.url;
						uni.hideLoading();
						uni.showToast({
							title: '头像上传成功',
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
						title: '上传失败',
						icon: 'none'
					});
				}
			},
			
			onBirthdayChange(e) {
				this.birthday = e.detail.value;
			},
			
			onRegionChange(e) {
				this.region = e.detail.value.join(' ');
			},
			
			onBioInput(e) {
				if (this.bio.length > 200) {
					this.bio = this.bio.substring(0, 200);
				}
			},
			
			async saveProfile() {
				if (!this.nickname) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					});
					return;
				}
				
				uni.showLoading({
					title: '保存中...'
				});
				
				try {
					const res = await uni.request({
						url: this.apiBase + 'update_user.php',
						method: 'POST',
						data: {
							user_id: this.userInfo.id,
							nickname: this.nickname,
							gender: this.gender,
							birthday: this.birthday,
							region: this.region,
							bio: this.bio,
							avatar: this.avatarUrl
						},
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					uni.hideLoading();
					
					if (res.statusCode === 200) {
						const updatedUserInfo = {
							...this.userInfo,
							nickname: this.nickname,
							gender: this.gender,
							birthday: this.birthday,
							region: this.region,
							bio: this.bio,
							avatar: this.avatarUrl
						};
						
						uni.setStorageSync('userInfo', updatedUserInfo);
						this.userInfo = updatedUserInfo;
						
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					} else {
						uni.showToast({
							title: res.data.message || '保存失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('保存错误:', error);
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				}
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
		background-color: #ffffff;
	}

	.header {
		background-color: #ffffff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.05);
	}

	.nav-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88upx;
		padding: 0 30upx;
		position: relative;
	}

	.nav-back {
		font-size: 40upx;
		color: #333333;
		font-weight: 500;
		width: 60upx;
	}

	.nav-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
		white-space: nowrap;
	}

	.nav-save {
		font-size: 32upx;
		color: #f33e54;
		font-weight: 500;
		padding: 10upx 20upx;
		border: 1upx solid #f33e54;
		border-radius: 20upx;
	}

	.profile-section {
		padding: 20upx;
	}

	.avatar-section {
		background-color: #ffffff;
		border-radius: 20upx;
		padding: 40upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20upx;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.05);
	}

	.avatar {
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
		border: 4upx solid #ffffff;
		box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.15);
		margin-bottom: 20upx;
	}

	.avatar-edit {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15upx 30upx;
		background: linear-gradient(135deg, #f33e54 0%, #ff6b6b 100%);
		border-radius: 40upx;
	}

	.edit-icon {
		font-size: 36upx;
		margin-bottom: 5upx;
	}

	.edit-text {
		font-size: 24upx;
		color: #ffffff;
	}

	.form-section {
		background-color: #ffffff;
		border-radius: 20upx;
		padding: 0 30upx;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.05);
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: 35upx 0;
		border-bottom: 1upx solid #f0f0f0;
		position: relative;
	}

	.form-item:last-child {
		border-bottom: none;
	}

	.label {
		width: 150upx;
		font-size: 30upx;
		color: #333333;
		font-weight: 500;
	}

	.input {
		flex: 1;
		height: 80upx;
		font-size: 30upx;
		color: #333333;
		padding: 0 20upx;
	}

	.count {
		position: absolute;
		right: 0;
		font-size: 24upx;
		color: #999999;
	}

	.gender-options {
		flex: 1;
		display: flex;
		gap: 20upx;
	}

	.gender-option {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20upx;
		border: 2upx solid #e0e0e0;
		border-radius: 10upx;
	}

	.gender-option.active {
		border-color: #f33e54;
		background-color: #fff5f5;
	}

	.gender-icon {
		font-size: 40upx;
		margin-bottom: 8upx;
	}

	.gender-text {
		font-size: 26upx;
		color: #666666;
	}

	.gender-option.active .gender-text {
		color: #f33e54;
		font-weight: 500;
	}

	.picker {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}

	.picker-text {
		font-size: 30upx;
		color: #333333;
	}

	.picker-arrow {
		font-size: 40upx;
		color: #cccccc;
	}

	.textarea-item {
		flex-direction: column;
		align-items: flex-start;
		padding-top: 35upx;
	}

	.textarea {
		width: 100%;
		min-height: 150upx;
		font-size: 30upx;
		color: #333333;
		padding: 20upx;
		background-color: #f8f9fa;
		border-radius: 10upx;
		margin-bottom: 10upx;
	}

	.upload-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 20upx;
	}

	.modal-content {
		background-color: #ffffff;
		border-radius: 20upx;
		padding: 40upx;
		width: 85%;
		max-width: 500upx;
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
		display: flex;
		flex-direction: column;
		gap: 20upx;
	}

	.upload-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30upx;
		background-color: #f8f9fa;
		border-radius: 15upx;
	}

	.upload-icon {
		font-size: 50upx;
		margin-bottom: 10upx;
	}

	.upload-text {
		font-size: 28upx;
		color: #333333;
	}
</style>
