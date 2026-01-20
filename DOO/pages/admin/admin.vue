<template>
	<view class="admin-container">
		<view class="sidebar">
			<view class="sidebar-header">
				<text class="sidebar-title">后台管理系统</text>
			</view>
			<view class="sidebar-menu">
				<view 
					class="menu-item" 
					:class="{ active: activeMenu === 'video' }"
					@click="switchMenu('video')"
				>
					<text class="menu-icon">📹</text>
					<text class="menu-text">视频管理</text>
				</view>
				<view 
					class="menu-item" 
					:class="{ active: activeMenu === 'user' }"
					@click="switchMenu('user')"
				>
					<text class="menu-icon">👥</text>
					<text class="menu-text">用户管理</text>
				</view>
				<view 
					class="menu-item" 
					:class="{ active: activeMenu === 'carousel' }"
					@click="switchMenu('carousel')"
				>
					<text class="menu-icon">🎠</text>
					<text class="menu-text">轮播图管理</text>
				</view>
			</view>
		</view>
		
		<view class="main-content">
			<view class="content-header">
				<text class="content-title">{{ menuTitle }}</text>
				<view class="header-actions">
					<button class="btn btn-primary" @click="handleAdd">添加</button>
				</view>
			</view>
			
			<view class="content-body">
				<view v-if="activeMenu === 'video'" class="table-container">
					<view class="table-header">
						<view class="table-cell cell-id">ID</view>
						<view class="table-cell cell-title">标题</view>
						<view class="table-cell cell-author">作者</view>
						<view class="table-cell cell-views">播放量</view>
						<view class="table-cell cell-status">状态</view>
						<view class="table-cell cell-actions">操作</view>
					</view>
					<view 
						class="table-row" 
						v-for="(item, index) in videoList" 
						:key="item.id"
					>
						<view class="table-cell cell-id">{{ item.id }}</view>
						<view class="table-cell cell-title">{{ item.title }}</view>
						<view class="table-cell cell-author">{{ item.author }}</view>
						<view class="table-cell cell-views">{{ item.views }}</view>
						<view class="table-cell cell-status">
							<text :class="['status-badge', item.status === '已发布' ? 'status-success' : 'status-warning']">
								{{ item.status }}
							</text>
						</view>
						<view class="table-cell cell-actions">
							<button class="btn btn-sm btn-edit" @click="handleEdit(item)">编辑</button>
							<button class="btn btn-sm btn-delete" @click="handleDelete(item)">删除</button>
						</view>
					</view>
				</view>
				
				<view v-if="activeMenu === 'user'" class="table-container">
					<view class="table-header">
						<view class="table-cell cell-id">ID</view>
						<view class="table-cell cell-username">用户名</view>
						<view class="table-cell cell-email">邮箱</view>
						<view class="table-cell cell-role">角色</view>
						<view class="table-cell cell-time">注册时间</view>
						<view class="table-cell cell-actions">操作</view>
					</view>
					<view 
						class="table-row" 
						v-for="(item, index) in userList" 
						:key="item.id"
					>
						<view class="table-cell cell-id">{{ item.id }}</view>
						<view class="table-cell cell-username">{{ item.username }}</view>
						<view class="table-cell cell-email">{{ item.email }}</view>
						<view class="table-cell cell-role">
							<text :class="['role-badge', item.role === '管理员' ? 'role-admin' : 'role-user']">
								{{ item.role }}
							</text>
						</view>
						<view class="table-cell cell-time">{{ item.createTime }}</view>
						<view class="table-cell cell-actions">
							<button class="btn btn-sm btn-edit" @click="handleEdit(item)">编辑</button>
							<button class="btn btn-sm btn-delete" @click="handleDelete(item)">删除</button>
						</view>
					</view>
				</view>
				
				<view v-if="activeMenu === 'carousel'" class="table-container">
					<view class="table-header">
						<view class="table-cell cell-id">ID</view>
						<view class="table-cell cell-title">标题</view>
						<view class="table-cell cell-author">作者</view>
						<view class="table-cell cell-image">图片</view>
						<view class="table-cell cell-sort">排序</view>
						<view class="table-cell cell-actions">操作</view>
					</view>
					<view 
						class="table-row" 
						v-for="(item, index) in carouselList" 
						:key="item.id"
					>
						<view class="table-cell cell-id">{{ item.id }}</view>
						<view class="table-cell cell-title">{{ item.title }}</view>
						<view class="table-cell cell-author">{{ item.author }}</view>
						<view class="table-cell cell-image">
							<image class="carousel-thumb" :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="table-cell cell-sort">{{ item.sort }}</view>
						<view class="table-cell cell-actions">
							<button class="btn btn-sm btn-edit" @click="handleEdit(item)">编辑</button>
							<button class="btn btn-sm btn-delete" @click="handleDelete(item)">删除</button>
						</view>
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
			activeMenu: 'video',
			videoList: [
				{
					id: 1,
					title: '测试视频1',
					author: '用户A',
					views: '1.2w',
					status: '已发布'
				},
				{
					id: 2,
					title: '测试视频2',
					author: '用户B',
					views: '3.5k',
					status: '已发布'
				},
				{
					id: 3,
					title: '测试视频3',
					author: '用户C',
					views: '2.8k',
					status: '审核中'
				},
				{
					id: 4,
					title: '测试视频4',
					author: '用户D',
					views: '5.6k',
					status: '已发布'
				}
			],
			userList: [
				{
					id: 1,
					username: 'admin',
					email: 'admin@example.com',
					role: '管理员',
					createTime: '2024-01-01'
				},
				{
					id: 2,
					username: 'user1',
					email: 'user1@example.com',
					role: '普通用户',
					createTime: '2024-01-15'
				},
				{
					id: 3,
					username: 'user2',
					email: 'user2@example.com',
					role: '普通用户',
					createTime: '2024-01-20'
				}
			],
			carouselList: [
				{
					id: 1,
					title: '热门推荐',
					author: '官方推荐',
					image: '/static/img/banner1.jpg',
					sort: 1
				},
				{
					id: 2,
					title: '精选内容',
					author: '编辑精选',
					image: '/static/img/banner2.jpg',
					sort: 2
				},
				{
					id: 3,
					title: '最新发布',
					author: '用户发布',
					image: '/static/img/banner3.jpg',
					sort: 3
				},
				{
					id: 4,
					title: '关注推荐',
					author: '好友推荐',
					image: '/static/img/banner4.jpg',
					sort: 4
				}
			]
		};
	},
	computed: {
		menuTitle() {
			const titles = {
				video: '视频管理',
				user: '用户管理',
				carousel: '轮播图管理'
			};
			return titles[this.activeMenu] || '';
		}
	},
	onLoad() {
		console.log('后台管理页面加载');
	},
	methods: {
		switchMenu(menu) {
			console.log('切换菜单:', menu);
			this.activeMenu = menu;
		},
		handleAdd() {
			console.log('添加新项目');
			uni.showToast({
				title: '添加功能开发中',
				icon: 'none'
			});
		},
		handleEdit(item) {
			console.log('编辑项目:', item);
			uni.showToast({
				title: '编辑功能开发中',
				icon: 'none'
			});
		},
		handleDelete(item) {
			console.log('删除项目:', item);
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该项目吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.admin-container {
	display: flex;
	width: 100%;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.sidebar {
	width: 200px;
	background-color: #304156;
	color: #ffffff;
	display: flex;
	flex-direction: column;
}

.sidebar-header {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
	font-size: 18px;
	font-weight: bold;
}

.sidebar-menu {
	flex: 1;
	padding: 10px 0;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 15px 20px;
	cursor: pointer;
	transition: all 0.3s;
}

.menu-item:hover {
	background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
	background-color: #409eff;
}

.menu-icon {
	font-size: 18px;
	margin-right: 10px;
}

.menu-text {
	font-size: 14px;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.content-header {
	height: 60px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	border-bottom: 1px solid #e4e7ed;
}

.content-title {
	font-size: 18px;
	font-weight: bold;
	color: #303133;
}

.header-actions {
	display: flex;
	gap: 10px;
}

.btn {
	padding: 8px 16px;
	border: none;
	border-radius: 4px;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s;
}

.btn-primary {
	background-color: #409eff;
	color: #ffffff;
}

.btn-primary:hover {
	background-color: #66b1ff;
}

.btn-sm {
	padding: 4px 12px;
	font-size: 12px;
	margin-right: 5px;
}

.btn-edit {
	background-color: #67c23a;
	color: #ffffff;
}

.btn-edit:hover {
	background-color: #85ce61;
}

.btn-delete {
	background-color: #f56c6c;
	color: #ffffff;
}

.btn-delete:hover {
	background-color: #f78989;
}

.content-body {
	flex: 1;
	padding: 20px;
	overflow-y: auto;
}

.table-container {
	background-color: #ffffff;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
	display: flex;
	background-color: #f5f7fa;
	border-bottom: 1px solid #e4e7ed;
}

.table-row {
	display: flex;
	border-bottom: 1px solid #e4e7ed;
}

.table-row:last-child {
	border-bottom: none;
}

.table-cell {
	padding: 12px;
	font-size: 14px;
	color: #606266;
	display: flex;
	align-items: center;
}

.cell-id {
	width: 80px;
}

.cell-title {
	flex: 1;
}

.cell-author {
	width: 100px;
}

.cell-views {
	width: 100px;
}

.cell-status {
	width: 100px;
}

.cell-email {
	width: 200px;
}

.cell-username {
	width: 120px;
}

.cell-role {
	width: 100px;
}

.cell-time {
	width: 150px;
}

.cell-image {
	width: 120px;
}

.cell-sort {
	width: 80px;
}

.cell-actions {
	width: 150px;
}

.status-badge {
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
}

.status-success {
	background-color: #f0f9eb;
	color: #67c23a;
}

.status-warning {
	background-color: #fdf6ec;
	color: #e6a23c;
}

.role-badge {
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
}

.role-admin {
	background-color: #ecf5ff;
	color: #409eff;
}

.role-user {
	background-color: #f4f4f5;
	color: #909399;
}

.carousel-thumb {
	width: 60px;
	height: 40px;
	border-radius: 4px;
	object-fit: cover;
}
</style>