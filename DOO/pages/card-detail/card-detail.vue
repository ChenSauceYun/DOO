<template>
	<view class="content">
		<!-- 导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 返回按钮 -->
			<view class="nav-back" @click="goBack">
				<text class="back-icon">←</text>
			</view>
			<!-- 标题 -->
			<text class="nav-title">{{ pageTitle }}</text>
			<!-- 占位，保持标题居中 -->
			<view class="nav-placeholder"></view>
		</view>

		<!-- 内容区域 -->
		<scroll-view class="content-area" scroll-y="true">
			<!-- 卡片详情 -->
			<view class="card-detail">
				<!-- 封面图 -->
				<view class="detail-cover">
					<image class="cover-image" :src="cardData.cover" mode="aspectFill"></image>
				</view>
				<!-- 标题 -->
				<text class="detail-title">{{ cardData.title }}</text>
				<!-- 作者信息 -->
				<view class="detail-author">
					<text class="author-label">作者：</text>
					<text class="author-name">{{ cardData.author }}</text>
				</view>
				<!-- 描述 -->
				<view class="detail-description">
					<text class="description-title">内容描述</text>
					<text class="description-text">{{ cardData.description || '暂无描述' }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			pageTitle: '详情',
			cardData: {
				id: 0,
				title: '',
				author: '',
				cover: '',
				description: ''
			}
		};
	},
	onLoad(options) {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight || 0;
		
		const eventChannel = this.$scope.eventChannel;
		if (eventChannel) {
			eventChannel.on('setCard', (data) => {
				this.cardData = data;
				this.pageTitle = data.title;
			});
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
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

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 44px;
	background-color: #ffffff;
	padding: 0 15px;
	border-bottom: 1px solid #f0f0f0;
}

.nav-back {
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.back-icon {
	font-size: 20px;
	color: #333333;
}

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	font-weight: bold;
	color: #333333;
}

.nav-placeholder {
	width: 30px;
}

.content-area {
	flex: 1;
	overflow: hidden;
}

.card-detail {
	background-color: #ffffff;
	margin: 15px;
	border-radius: 8px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-cover {
	width: 100%;
	height: 200px;
	border-radius: 8px;
	overflow: hidden;
	margin-bottom: 15px;
}

.cover-image {
	width: 100%;
	height: 100%;
}

.detail-title {
	display: block;
	font-size: 20px;
	font-weight: bold;
	color: #333333;
	margin-bottom: 15px;
}

.detail-author {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid #f0f0f0;
}

.author-label {
	font-size: 14px;
	color: #999999;
	margin-right: 5px;
}

.author-name {
	font-size: 14px;
	color: #666666;
}

.detail-description {
	margin-top: 20px;
}

.description-title {
	display: block;
	font-size: 16px;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10px;
}

.description-text {
	display: block;
	font-size: 14px;
	color: #666666;
	line-height: 1.8;
}
</style>
