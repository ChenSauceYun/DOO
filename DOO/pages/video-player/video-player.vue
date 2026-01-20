<template>
	<view class="content">
		<view class="video-container">
			<video 
				class="video-player"
				:src="videoUrl"
				:poster="poster"
				controls
				autoplay
				show-center-play-btn
				@error="onVideoError"
				@play="onVideoPlay"
				@pause="onVideoPause"
			></video>
		</view>
		
		<view class="video-info">
			<text class="video-title">{{ title }}</text>
			<view class="video-meta">
				<text class="author">{{ author }}</text>
				<text class="views">{{ views }}</text>
			</view>
		</view>
		
		<view class="back-button" @click="goBack">
			<text class="back-icon">‹</text>
			<text class="back-text">返回</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoUrl: '',
			title: '',
			author: '',
			views: '',
			poster: ''
		};
	},
	onLoad(options) {
		if (options.videoUrl) {
			this.videoUrl = decodeURIComponent(options.videoUrl);
		}
		if (options.title) {
			this.title = decodeURIComponent(options.title);
		}
		if (options.author) {
			this.author = decodeURIComponent(options.author);
		}
		if (options.views) {
			this.views = decodeURIComponent(options.views);
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		onVideoError(e) {
			console.error('视频播放错误:', e);
			uni.showToast({
				title: '视频加载失败',
				icon: 'none'
			});
		},
		onVideoPlay() {
			console.log('视频开始播放');
		},
		onVideoPause() {
			console.log('视频暂停');
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	min-height: 100vh;
	background-color: #000000;
	display: flex;
	flex-direction: column;
}

.video-container {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #000000;
}

.video-player {
	width: 100%;
	height: 100%;
}

.video-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.8);
	padding: 20px;
	color: #ffffff;
}

.video-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	display: block;
}

.video-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	color: #cccccc;
}

.author {
	margin-right: 20px;
}

.views {
	margin-left: 20px;
}

.back-button {
	position: absolute;
	top: 20px;
	left: 20px;
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 10px 15px;
	border-radius: 20px;
	z-index: 999;
}

.back-icon {
	font-size: 24px;
	color: #ffffff;
	margin-right: 5px;
}

.back-text {
	font-size: 14px;
	color: #ffffff;
}
</style>
