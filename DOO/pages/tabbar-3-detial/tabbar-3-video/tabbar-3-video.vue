<template>
	<view class="content">
		<view class="header">
			<view class="nav-bar">
				<text class="nav-back" @click="goBack">‹</text>
				<text class="nav-title">发视频</text>
				<text class="nav-publish" @click="publishVideo">发布</text>
			</view>
		</view>
		
		<view class="form-section">
			<view class="video-upload" @click="chooseVideo">
				<view class="upload-placeholder" v-if="!videoUrl">
					<text class="upload-icon">📹</text>
					<text class="upload-text">点击上传视频</text>
				</view>
				<view class="video-preview" v-else>
					<video class="preview-video" :src="videoUrl" object-fit="contain"></video>
					<view class="remove-video" @click.stop="removeVideo">✕</view>
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">视频标题</text>
				<input 
					class="input" 
					v-model="title" 
					placeholder="请输入视频标题" 
					maxlength="50"
				/>
				<text class="count">{{ title.length }}/50</text>
			</view>
			
			<view class="form-item">
				<text class="label">视频描述</text>
				<textarea 
					class="textarea" 
					v-model="description" 
					placeholder="介绍一下你的视频..." 
					maxlength="200"
					@input="onDescriptionInput"
				></textarea>
				<text class="count">{{ description.length }}/200</text>
			</view>
			
			<view class="form-item">
				<text class="label">添加话题</text>
				<view class="tags-input">
					<text 
						class="tag" 
						v-for="(tag, index) in tags" 
						:key="index"
						@click="removeTag(index)"
					>
						#{{ tag }}
					</text>
					<input 
						class="tag-input-field" 
						v-model="tagInput" 
						placeholder="输入话题标签" 
						@confirm="addTag"
					/>
				</view>
			</view>
		</view>
		
		<view class="upload-modal" v-if="showUploadModal" @click.self="showUploadModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择视频来源</text>
					<text class="modal-close" @click="showUploadModal = false">✕</text>
				</view>
				<view class="modal-body">
					<view class="upload-option" @click="chooseFromAlbum">
						<text class="upload-icon">🖼️</text>
						<text class="upload-text">从相册选择</text>
					</view>
					<view class="upload-option" @click="recordVideo">
						<text class="upload-icon">📷</text>
						<text class="upload-text">拍摄视频</text>
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
			videoUrl: '',
			title: '',
			description: '',
			tags: [],
			tagInput: '',
			showUploadModal: false,
			apiBase: 'http://192.168.1.12/DOO/server/api/'
		};
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		chooseVideo() {
			this.showUploadModal = true;
		},
		
		chooseFromAlbum() {
			uni.chooseVideo({
				sourceType: ['album'],
				maxDuration: 60,
				success: (res) => {
					this.videoUrl = res.tempFilePath;
					this.showUploadModal = false;
				}
			});
		},
		
		recordVideo() {
			uni.chooseVideo({
				sourceType: ['camera'],
				maxDuration: 60,
				success: (res) => {
					this.videoUrl = res.tempFilePath;
					this.showUploadModal = false;
				}
			});
		},
		
		removeVideo() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这个视频吗？',
				success: (res) => {
					if (res.confirm) {
						this.videoUrl = '';
					}
				}
			});
		},
		
		onDescriptionInput(e) {
			if (this.description.length > 200) {
				this.description = this.description.substring(0, 200);
			}
		},
		
		addTag() {
			if (this.tagInput.trim()) {
				if (this.tags.length >= 5) {
					uni.showToast({
						title: '最多添加5个话题',
						icon: 'none'
					});
					return;
				}
				if (!this.tags.includes(this.tagInput.trim())) {
					this.tags.push(this.tagInput.trim());
				}
				this.tagInput = '';
			}
		},
		
		removeTag(index) {
			this.tags.splice(index, 1);
		},
		
		async publishVideo() {
			if (!this.videoUrl) {
				uni.showToast({
					title: '请先上传视频',
					icon: 'none'
				});
				return;
			}
			
			if (!this.title.trim()) {
				uni.showToast({
					title: '请输入视频标题',
					icon: 'none'
				});
				return;
			}
			
			const userId = uni.getStorageSync('userId') || uni.getStorageSync('user_id') || 0;
			console.log('当前用户ID:', userId);
			console.log('视频标题:', this.title);
			console.log('视频描述:', this.description);
			
			uni.showLoading({
				title: '发布中...'
			});
			
			try {
				const uploadRes = await uni.uploadFile({
					url: this.apiBase + 'upload.php',
					filePath: this.videoUrl,
					name: 'file'
				});
				
				console.log('上传响应:', uploadRes);
				console.log('上传响应数据:', uploadRes.data);
				
				let data;
				try {
					data = JSON.parse(uploadRes.data);
				} catch (e) {
					console.error('JSON解析错误:', e);
					console.error('原始数据:', uploadRes.data);
					uni.hideLoading();
					uni.showToast({
						title: '上传失败，请重试',
						icon: 'none'
					});
					return;
				}
				
				if (data.code === 200) {
					const videoData = {
						user_id: userId,
						title: this.title,
						description: this.description,
						video_url: data.data.url,
						tags: this.tags.join(',')
					};
					
					const res = await uni.request({
						url: this.apiBase + 'publish_video.php',
						method: 'POST',
						data: videoData,
						header: {
							'Content-Type': 'application/json'
						}
					});
					
					console.log('发布视频响应:', res);
					console.log('发布响应状态码:', res.statusCode);
					console.log('发布响应数据:', res.data);
					
					uni.hideLoading();
					
					if (res.statusCode === 200 && res.data.code === 200) {
						console.log('视频发布成功');
						uni.showToast({
							title: '发布成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: res.data.message || '发布失败',
							icon: 'none'
						});
					}
				} else {
					uni.hideLoading();
					uni.showToast({
						title: data.message || '上传失败',
						icon: 'none'
					});
				}
			} catch (error) {
				uni.hideLoading();
				console.error('发布视频错误:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
}

.header {
	background-color: #ffffff;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	padding-top: 44px;
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

.nav-publish {
	font-size: 32upx;
	color: #f33e54;
	font-weight: 500;
	padding: 10upx 20upx;
	border: 1upx solid #f33e54;
	border-radius: 20upx;
}

.form-section {
	flex: 1;
	padding: 30upx;
	overflow-y: auto;
}

.video-upload {
	width: 100%;
	height: 400upx;
	background-color: #ffffff;
	border-radius: 16upx;
	margin-bottom: 30upx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2upx dashed #e0e0e0;
}

.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.upload-icon {
	font-size: 80upx;
	margin-bottom: 20upx;
}

.upload-text {
	font-size: 28upx;
	color: #999999;
}

.video-preview {
	width: 100%;
	height: 100%;
	position: relative;
}

.preview-video {
	width: 100%;
	height: 100%;
}

.remove-video {
	position: absolute;
	top: 10upx;
	right: 10upx;
	width: 50upx;
	height: 50upx;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 32upx;
}

.form-item {
	background-color: #ffffff;
	border-radius: 16upx;
	padding: 30upx;
	margin-bottom: 20upx;
}

.label {
	font-size: 28upx;
	color: #333333;
	font-weight: 500;
	display: block;
	margin-bottom: 15upx;
}

.input {
	width: 100%;
	height: 80upx;
	border: 2upx solid #e0e0e0;
	border-radius: 10upx;
	padding: 0 20upx;
	font-size: 28upx;
	box-sizing: border-box;
}

.textarea {
	width: 100%;
	min-height: 150upx;
	border: 2upx solid #e0e0e0;
	border-radius: 10upx;
	padding: 20upx;
	font-size: 28upx;
	box-sizing: border-box;
	resize: none;
}

.count {
	position: absolute;
	right: 30upx;
	bottom: 30upx;
	font-size: 24upx;
	color: #999999;
}

.tags-input {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10upx;
}

.tag {
	background-color: #f33e54;
	color: #ffffff;
	font-size: 24upx;
	padding: 8upx 16upx;
	border-radius: 20upx;
	display: flex;
	align-items: center;
}

.tag-input-field {
	flex: 1;
	min-width: 150upx;
	height: 60upx;
	border: 2upx solid #e0e0e0;
	border-radius: 10upx;
	padding: 0 15upx;
	font-size: 26upx;
}

.upload-modal {
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
	padding: 40upx;
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
	padding: 40upx;
	background-color: #f8f9fa;
	border-radius: 16upx;
}

.upload-option .upload-icon {
	font-size: 60upx;
	margin-bottom: 15upx;
}

.upload-option .upload-text {
	font-size: 28upx;
	color: #333333;
}
</style>
