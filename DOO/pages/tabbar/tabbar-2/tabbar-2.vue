<template>
	<!-- 页面容器 -->
	<view class="content">
		<!-- 标签栏 -->
		<view class="tabs">
			<!-- 全部用户标签（当前激活） -->
			<view 
				class="tab-item active"
			>
				全部用户
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
			<!-- 用户列表 -->
			<view class="user-list">
				<!-- 用户项 -->
				<view 
					class="user-item" 
					v-for="(user, index) in userList" 
					:key="index"
					@click="viewUserDetail(user)"
				>
					<!-- 用户头像 -->
					<view class="user-avatar">
						<!-- 显示用户头像，如果没有头像则显示默认头像 -->
						<image :src="user.avatar || '/static/img/default-avatar.png'" mode="aspectFill"></image>
					</view>
					<!-- 用户信息 -->
					<view class="user-info">
						<!-- 用户昵称或用户名 -->
						<text class="user-name">{{ user.nickname || user.username }}</text>
						<!-- 用户统计信息（粉丝数和关注数） -->
						<text class="user-stats">
							粉丝 {{ user.followers }} · 关注 {{ user.following }}
						</text>
					</view>
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
			// 用户列表
			userList: [],
			// 是否正在刷新
			refreshing: false
		};
	},
	// 页面加载时执行
	onLoad() {
		// 加载用户列表
		this.loadUserList();
	},
	// 组件方法
	methods: {
		// 加载用户列表
		async loadUserList() {
			try {
				// 发送请求到用户列表API
				const response = await uni.request({
					url: 'http://192.168.1.12/DOO/server/api/get_users.php',
					method: 'GET'
				});
				
				// 判断响应状态码
				if (response.statusCode === 200) {
					// 获取响应数据
					const result = response.data;
					// 判断API返回码
					if (result.code === 200) {
						// 设置用户列表
						this.userList = result.data;
						// 输出成功日志
						console.log('用户列表加载成功:', this.userList);
					}
				}
			} catch (error) {
				// 捕获异常
				console.error('加载用户列表失败:', error);
				// 显示错误提示
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			}
		},
		// 查看用户详情
		viewUserDetail(user) {
			// 跳转到用户详情页
			uni.navigateTo({
				url: '/pages/user-detail/user-detail',
				// 成功回调，传递用户数据
				success: (res) => {
					res.eventChannel.emit('setUser', user);
				}
			});
		},
		// 下拉刷新处理
		async onRefresh() {
			// 输出日志
			console.log('下拉刷新...');
			// 设置刷新状态
			this.refreshing = true;
			
			try {
				// 加载用户列表
				await this.loadUserList();
				
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
		}
	}
};
</script>

<style lang="scss" scoped>
/* 页面容器样式 */
.content {
	width: 100%;
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
}

/* 标签栏样式 */
.tabs {
	display: flex;
	background-color: #ffffff;
	padding: 0 20upx;
	border-bottom: 1upx solid #e4e7ed;
}

/* 标签项样式 */
.tab-item {
	flex: 1;
	text-align: center;
	padding: 20upx 40upx;
	font-size: 14px;
	color: #606266;
	position: relative;
}

/* 激活的标签样式 */
.tab-item.active {
	color: #409eff;
	font-weight: bold;
}

/* 激活标签下划线样式 */
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40upx;
	height: 2px;
	background-color: #409eff;
}

/* 内容区域样式 */
.content-area {
	flex: 1;
	overflow: hidden;
}

/* 用户列表样式 */
.user-list {
	padding: 20upx;
}

/* 用户项样式 */
.user-item {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	padding: 20upx;
	margin-bottom: 20upx;
	border-radius: 8upx;
	box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.05);
}

/* 用户头像样式 */
.user-avatar {
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	margin-right: 20upx;
	overflow: hidden;
}

/* 头像图片样式 */
.user-avatar image {
	width: 100%;
	height: 100%;
}

/* 用户信息样式 */
.user-info {
	flex: 1;
}

/* 用户名样式 */
.user-name {
	font-size: 16px;
	font-weight: bold;
	color: #303133;
	margin-bottom: 8upx;
}

/* 用户统计信息样式 */
.user-stats {
	font-size: 12px;
	color: #909399;
}
</style>