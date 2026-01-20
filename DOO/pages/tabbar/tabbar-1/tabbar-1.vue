<template>
	<!-- 页面容器 -->
	<view class="content">
		<!-- 导航栏，包含推荐和关注两个标签 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 推荐标签 -->
			<view 
				class="nav-item" 
				:class="{ active: activeTab === 'recommend' }"
				@click="switchTab('recommend')"
			>
				推荐
			</view>
			<!-- 关注标签 -->
			<view 
				class="nav-item" 
				:class="{ active: activeTab === 'follow' }"
				@click="switchTab('follow')"
			>
				关注
			</view>
		</view>
		
		<!-- 内容区域，支持下拉刷新 -->
		<scroll-view 
			class="content-area" 
			scroll-y="true" 
			:refresher-enabled="true" 
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
		>
			<!-- 推荐标签内容 -->
			<view v-if="activeTab === 'recommend'" class="tab-content">
				<!-- 轮播图区域 -->
				<view class="carousel-section">
					<!-- 轮播图组件 -->
					<swiper 
						class="carousel-swiper"
						:indicator-dots="true"
						:autoplay="true"
						:interval="3000"
						:circular="true"
					>
						<!-- 轮播图项 -->
						<swiper-item 
						class="carousel-item" 
						v-for="(item, index) in carouselList" 
						:key="index"
						@click="clickCarouselItem(item)"
					>
							<!-- 轮播图卡片 -->
							<view class="carousel-card">
								<!-- 轮播图图片 -->
								<image class="carousel-image" :src="item.image" mode="aspectFill"></image>
								<!-- 轮播图信息（标题和作者） -->
								<view class="carousel-info">
									<text class="carousel-title">{{ item.title }}</text>
									<text class="carousel-author">{{ item.author }}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				
				<!-- 卡片区域 -->
				<view class="cards-section">
					<!-- 卡片容器 -->
					<view class="cards-container">
						<!-- 卡片项 -->
						<view 
							class="card-item" 
							v-for="(card, index) in cardList" 
							:key="index"
							@click="clickCard(card)"
						>
							<!-- 卡片缩略图 -->
							<view class="card-thumb">
								<image class="thumb-image" :src="card.cover" mode="aspectFill"></image>
							</view>
							<!-- 卡片信息（标题和作者） -->
							<view class="card-info">
								<text class="card-title">{{ card.title }}</text>
								<text class="card-author">{{ card.author }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 关注标签内容 -->
			<view v-if="activeTab === 'follow'" class="tab-content follow-content">
				<!-- 空状态提示 -->
				<view class="empty-state">
					<text class="empty-text">暂无关注内容</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
// 导出Vue组件
export default {
	// 组件数据
	data() {
		return {
			// 当前激活的标签（recommend=推荐，follow=关注）
			activeTab: 'recommend',
			// 状态栏高度（适配不同设备）
			statusBarHeight: 0,
			// 轮播图列表
			carouselList: [],
			// 卡片列表
			cardList: [
				{
					id: 1,
					title: '热门视频',
					author: 'DOO官方',
					cover: 'https://via.placeholder.com/100x100/409eff/ffffff?text=Video1',
					description: '这是热门视频的详细描述内容，包含了视频的主要信息和特色介绍。'
				},
				{
					id: 2,
					title: '精选内容',
					author: '编辑推荐',
					cover: 'https://via.placeholder.com/100x100/67c23a/ffffff?text=Video2',
					description: '这是精选内容的详细描述，由编辑团队精心挑选的优质内容。'
				},
				{
					id: 3,
					title: '最新发布',
					author: '用户A',
					cover: 'https://via.placeholder.com/100x100/e6a23c/ffffff?text=Video3',
					description: '这是最新发布的内容，包含了最新的动态和资讯。'
				},
				{
					id: 4,
					title: '推荐观看',
					author: '用户B',
					cover: 'https://via.placeholder.com/100x100/f56c6c/ffffff?text=Video4',
					description: '这是推荐观看的内容，根据您的喜好智能推荐。'
				}
			],
			// 是否正在刷新
			refreshing: false
		};
	},
	// 页面加载时执行
	onLoad() {
		// 获取系统信息，包括状态栏高度
		const systemInfo = uni.getSystemInfoSync();
		// 设置状态栏高度
		this.statusBarHeight = systemInfo.statusBarHeight || 0;
		// 输出日志
		console.log('首页加载，状态栏高度:', this.statusBarHeight);
		// 加载轮播图数据
		this.loadCarouselData();
	},
	// 组件方法
	methods: {
		// 加载轮播图数据
		async loadCarouselData() {
			// 输出日志
			console.log('开始加载轮播图...');
			try {
				// 发送请求到轮播图API
				const response = await uni.request({
					url: 'http://192.168.1.12/DOO/server/api/get_carousels.php',
					method: 'GET'
				});
				
				// 输出响应日志
				console.log('轮播图响应状态码:', response.statusCode);
				console.log('轮播图响应数据:', response.data);
				console.log('轮播图响应数据类型:', typeof response.data);
				
				// 判断响应状态
				if (response.statusCode === 200) {
					// 解析响应数据
					let result;
					// 如果响应是字符串，需要解析JSON
					if (typeof response.data === 'string') {
						result = JSON.parse(response.data);
					// 如果响应已经是对象，直接使用
					} else if (typeof response.data === 'object') {
						result = response.data;
					} else {
						// 数据类型错误
						console.error('响应数据类型错误:', typeof response.data);
						return;
					}
					
					// 输出解析结果
					console.log('轮播图解析结果:', result);
					// 判断API返回码
					if (result.code === 200) {
						// 设置轮播图列表
						this.carouselList = result.data || [];
						// 输出成功日志
						console.log('轮播图数据加载成功:', this.carouselList);
					} else {
						// API返回错误
						console.log('轮播图API返回错误:', result.message);
					}
				} else {
					// 请求失败
					console.log('轮播图请求失败，状态码:', response.statusCode);
				}
			} catch (error) {
				// 捕获异常
				console.error('加载轮播图失败:', error);
			}
		},
		// 下拉刷新处理
		async onRefresh() {
			// 输出日志
			console.log('下拉刷新...');
			// 设置刷新状态
			this.refreshing = true;
			
			try {
				// 加载轮播图数据
				await this.loadCarouselData();
				
				// 显示成功提示
				uni.showToast({
					title: '刷新成功',
					icon: 'success'
				});
			} catch (error) {
				// 捕获异常
				console.error('刷新失败:', error);
				// 显示失败提示
				uni.showToast({
					title: '刷新失败',
					icon: 'none'
				});
			} finally {
				// 无论成功失败，都重置刷新状态
				this.refreshing = false;
			}
		},
		// 切换标签
		switchTab(tab) {
			// 输出日志
			console.log('切换标签:', tab);
			// 设置当前激活的标签
			this.activeTab = tab;
		},
		// 点击轮播图项
		clickCarouselItem(item) {
			// 输出日志
			console.log('点击轮播项:', item);
		},
		// 点击卡片
		clickCard(card) {
			// 输出日志
			console.log('点击卡片:', card);
			// 跳转到卡片详情页面
			uni.navigateTo({
				url: '/pages/card-detail/card-detail',
				success: (res) => {
					// 通过事件通道传递卡片数据
					res.eventChannel.emit('setCard', card);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/* 页面容器样式 */
.content {
	width: 100%;
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
}

/* 轮播图区域样式 */
.carousel-section {
	width: 100%;
	height: 250px;
	background-color: #ffffff;
}

/* 轮播图组件样式 */
.carousel-swiper {
	width: 100%;
	height: 100%;
}

/* 轮播图项样式 */
.carousel-item {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 轮播图卡片样式 */
.carousel-card {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 8px;
	overflow: hidden;
}

/* 轮播图图片样式 */
.carousel-image {
	width: 100%;
	height: 100%;
}

/* 轮播图信息样式 */
.carousel-info {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 15px;
	background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
}

/* 轮播图标题样式 */
.carousel-title {
	color: #ffffff;
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 5px;
	display: block;
}

/* 轮播图作者样式 */
.carousel-author {
	color: rgba(255,255,255,0.8);
	font-size: 13px;
}

/* 卡片区域样式 */
.cards-section {
	flex: 1;
	padding: 10px;
}

/* 导航栏样式 */
.nav-bar {
	display: flex;
	align-items: center;
	height: 44px;
	background-color: #ffffff;
	padding: 0 15px;
	border-bottom: 1px solid #f0f0f0;
}

/* 导航标签样式 */
.nav-item {
	font-size: 15px;
	color: #999999;
	margin-right: 18px;
	cursor: pointer;
	transition: all 0.3s;
}

/* 最后一个导航标签样式（去除右边距） */
.nav-item:last-child {
	margin-right: 0;
}

/* 激活的导航标签样式 */
.nav-item.active {
	font-size: 18px;
	font-weight: bold;
	color: #333333;
}

/* 卡片容器样式 */
.cards-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	padding: 0 2px;
}

/* 卡片项样式 */
.card-item {
	background-color: #ffffff;
	border-radius: 8px;
	overflow: hidden;
	height: 55px;
	display: flex;
	align-items: center;
	padding: 0 12px;
	gap: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 卡片缩略图样式 */
.card-thumb {
	flex-shrink: 0;
	width: 40px;
	height: 40px;
	border-radius: 4px;
	overflow: hidden;
	background-color: #f0f0f0;
}

/* 缩略图图片样式 */
.thumb-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* 卡片信息样式 */
.card-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4px;
	padding: 0;
	background-color: transparent;
}

/* 卡片标题样式 */
.card-title {
	color: #333333;
	font-size: 14px;
	font-weight: 500;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 卡片作者样式 */
.card-author {
	color: #999999;
	font-size: 12px;
}

/* 内容区域样式 */
.content-area {
	flex: 1;
	overflow: hidden;
}

/* 标签内容样式 */
.tab-content {
	width: 100%;
	height: 100%;
}

/* 关注内容样式 */
.follow-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

/* 空状态样式 */
.empty-state {
	text-align: center;
}

/* 空状态文本样式 */
.empty-text {
	color: #999999;
	font-size: 14px;
}
</style>