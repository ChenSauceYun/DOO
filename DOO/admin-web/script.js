const API_BASE_URL = '/DOO/server/api';

let currentMenu = 'video';
let currentData = [];
let editingItem = null;

const menuItems = document.querySelectorAll('.menu-item');
const menuTitle = document.getElementById('menuTitle');
const tableBody = document.getElementById('tableBody');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const adminName = document.getElementById('adminName');
const logoutBtn = document.getElementById('logoutBtn');

function checkAuth() {
	const adminInfo = localStorage.getItem('adminInfo');
	if (!adminInfo) {
		window.location.href = 'login.html';
		return false;
	}
	return JSON.parse(adminInfo);
}

async function init() {
	const adminInfo = checkAuth();
	if (!adminInfo) return;

	adminName.textContent = adminInfo.nickname || adminInfo.username || '管理员';
	bindEvents();
	await loadData();
}

function bindEvents() {
	menuItems.forEach(item => {
		item.addEventListener('click', () => {
			switchMenu(item.dataset.menu);
		});
	});

	addBtn.addEventListener('click', handleAdd);
	modalClose.addEventListener('click', closeModal);
	modalCancel.addEventListener('click', closeModal);
	modalConfirm.addEventListener('click', handleModalConfirm);
	logoutBtn.addEventListener('click', handleLogout);

	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeModal();
		}
	});
}

async function switchMenu(menu) {
	currentMenu = menu;
	menuItems.forEach(item => {
		item.classList.remove('active');
		if (item.dataset.menu === menu) {
			item.classList.add('active');
		}
	});

	const titles = {
		video: '视频管理',
		user: '用户管理',
		carousel: '轮播图管理'
	};
	menuTitle.textContent = titles[menu];

	await loadData();
}

async function loadData() {
	console.log('loadData被调用，currentMenu:', currentMenu);
	try {
		let endpoint = '';
		switch (currentMenu) {
			case 'video':
				endpoint = '/admin_videos.php';
				break;
			case 'user':
				endpoint = '/admin_users.php';
				break;
			case 'carousel':
				endpoint = '/admin_carousels.php';
				break;
		}

		console.log('请求URL:', `${API_BASE_URL}${endpoint}`);
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'GET',
			credentials: 'include'
		});

		const result = await response.json();
		console.log('API响应:', result);

		if (result.code === 200) {
			currentData = result.data || [];
			console.log('currentData已更新:', currentData);
			renderTable();
		} else {
			showToast(result.message || '加载数据失败');
		}
	} catch (error) {
		console.error('加载数据错误:', error);
		showToast('网络错误，请稍后重试');
	}
}

function renderTable() {
	let html = '';

	if (currentMenu === 'video') {
		html = currentData.map(item => `
			<div class="table-row">
				<div class="table-cell cell-id">${item.id}</div>
				<div class="table-cell cell-title">${item.title}</div>
				<div class="table-cell cell-author">${item.author || '-'}</div>
				<div class="table-cell cell-views">${item.views || 0}</div>
				<div class="table-cell cell-status">
					<span class="status-badge status-success">已发布</span>
				</div>
				<div class="table-cell cell-actions">
					<button class="btn btn-sm btn-edit" data-id="${item.id}">编辑</button>
					<button class="btn btn-sm btn-delete" data-id="${item.id}">删除</button>
				</div>
			</div>
		`).join('');
	} else if (currentMenu === 'user') {
		html = currentData.map(item => `
			<div class="table-row">
				<div class="table-cell cell-id">${item.id}</div>
				<div class="table-cell cell-username">${item.username}</div>
				<div class="table-cell cell-email">${item.email || '-'}</div>
				<div class="table-cell cell-role">
					<span class="role-badge ${item.role === 'admin' ? 'role-admin' : 'role-user'}">
						${item.role === 'admin' ? '管理员' : '普通用户'}
					</span>
				</div>
				<div class="table-cell cell-time">${item.created_at ? item.created_at.split(' ')[0] : '-'}</div>
				<div class="table-cell cell-actions">
					<button class="btn btn-sm btn-edit" data-id="${item.id}">编辑</button>
					<button class="btn btn-sm btn-delete" data-id="${item.id}">删除</button>
				</div>
			</div>
		`).join('');
	} else if (currentMenu === 'carousel') {
		html = currentData.map(item => `
			<div class="table-row">
				<div class="table-cell cell-id">${item.id}</div>
				<div class="table-cell cell-title">${item.title}</div>
				<div class="table-cell cell-author">${item.author || '-'}</div>
				<div class="table-cell cell-image">
					<img class="carousel-thumb" src="${item.image_url}" alt="${item.title}">
				</div>
				<div class="table-cell cell-sort">${item.sort_order}</div>
				<div class="table-cell cell-actions">
					<button class="btn btn-sm btn-edit" data-id="${item.id}">编辑</button>
					<button class="btn btn-sm btn-delete" data-id="${item.id}">删除</button>
				</div>
			</div>
		`).join('');
	}

	tableBody.innerHTML = html;
	bindTableEvents();
}

function bindTableEvents() {
	const editButtons = document.querySelectorAll('.btn-edit');
	const deleteButtons = document.querySelectorAll('.btn-delete');

	console.log('找到编辑按钮数量:', editButtons.length);
	console.log('找到删除按钮数量:', deleteButtons.length);

	editButtons.forEach((btn, index) => {
		console.log('绑定编辑按钮:', index, btn.dataset.id);
		btn.addEventListener('click', (e) => {
			console.log('点击编辑按钮:', e.target.dataset.id);
			const id = parseInt(e.target.dataset.id);
			handleEdit(id);
		});
	});

	deleteButtons.forEach((btn, index) => {
		console.log('绑定删除按钮:', index, btn.dataset.id);
		btn.addEventListener('click', (e) => {
			console.log('点击删除按钮:', e.target.dataset.id);
			const id = parseInt(e.target.dataset.id);
			handleDelete(id);
		});
	});
}

function handleAdd() {
	console.log('handleAdd被调用');
	editingItem = null;
	modalTitle.textContent = '添加项目';
	showModal();
}

function handleEdit(id) {
	console.log('handleEdit被调用，ID:', id, '类型:', typeof id);
	console.log('currentData:', currentData);
	console.log('currentData长度:', currentData.length);

	if (currentData.length === 0) {
		console.log('currentData为空数组！');
		return;
	}

	const item = currentData.find(d => {
		console.log('比较:', d.id, '===', id, '结果:', d.id == id);
		return d.id == id;
	});

	if (!item) {
		console.log('未找到项目，ID:', id);
		console.log('尝试查找所有ID:', currentData.map(d => d.id));
		return;
	}

	console.log('找到项目:', item);
	editingItem = item;
	modalTitle.textContent = '编辑项目';
	showModal();
}

async function handleDelete(id) {
	if (!confirm('确定要删除该项目吗？')) return;

	try {
		let endpoint = '';
		switch (currentMenu) {
			case 'video':
				endpoint = `/admin_videos.php?id=${id}`;
				break;
			case 'user':
				endpoint = `/admin_users.php?id=${id}`;
				break;
			case 'carousel':
				endpoint = `/admin_carousels.php?id=${id}`;
				break;
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		const result = await response.json();

		if (result.code === 200) {
			showToast('删除成功', 'success');
			await loadData();
		} else {
			showToast(result.message || '删除失败');
		}
	} catch (error) {
		console.error('删除错误:', error);
		showToast('网络错误，请稍后重试');
	}
}

function showModal() {
	let formHtml = '';

	if (currentMenu === 'video') {
		formHtml = `
			<div class="form-group">
				<label>标题</label>
				<input type="text" id="formTitle" value="${editingItem ? editingItem.title : ''}">
			</div>
			<div class="form-group">
				<label>描述</label>
				<textarea id="formDescription" rows="3">${editingItem ? editingItem.description || '' : ''}</textarea>
			</div>
			<div class="form-group">
				<label>视频URL</label>
				<input type="text" id="formVideoUrl" value="${editingItem ? editingItem.video_url : ''}">
			</div>
			<div class="form-group">
				<label>封面URL</label>
				<input type="text" id="formCoverUrl" value="${editingItem ? editingItem.cover_url || '' : ''}">
			</div>
		`;
	} else if (currentMenu === 'user') {
		formHtml = `
			<div class="form-group">
				<label>用户名</label>
				<input type="text" id="formUsername" value="${editingItem ? editingItem.username : ''}" ${editingItem ? 'readonly' : ''}>
			</div>
			<div class="form-group">
				<label>昵称</label>
				<input type="text" id="formNickname" value="${editingItem ? editingItem.nickname || '' : ''}">
			</div>
			${!editingItem ? `
			<div class="form-group">
				<label>密码</label>
				<input type="password" id="formPassword" placeholder="请输入密码">
			</div>
			` : ''}
			<div class="form-group">
				<label>角色</label>
				<select id="formRole">
					<option value="admin" ${editingItem && editingItem.role === 'admin' ? 'selected' : ''}>管理员</option>
					<option value="user" ${editingItem && editingItem.role === 'user' ? 'selected' : ''}>普通用户</option>
				</select>
			</div>
		`;
	} else if (currentMenu === 'carousel') {
		formHtml = `
			<div class="form-group">
				<label>标题</label>
				<input type="text" id="formTitle" value="${editingItem ? editingItem.title : ''}">
			</div>
			<div class="form-group">
				<label>作者</label>
				<input type="text" id="formAuthor" value="${editingItem ? editingItem.author || '' : ''}">
			</div>
			<div class="form-group">
				<label>图片URL</label>
				<input type="text" id="formImageUrl" value="${editingItem ? editingItem.image_url : ''}">
			</div>
			<div class="form-group">
				<label>排序</label>
				<input type="number" id="formSortOrder" value="${editingItem ? editingItem.sort_order : ''}">
			</div>
			<div class="form-group">
				<label>状态</label>
				<select id="formIsActive">
					<option value="1" ${editingItem && editingItem.is_active == 1 ? 'selected' : ''}>启用</option>
					<option value="0" ${editingItem && editingItem.is_active == 0 ? 'selected' : ''}>禁用</option>
				</select>
			</div>
		`;
	}

	console.log('formHtml:', formHtml);
	modalBody.innerHTML = formHtml;
	modal.classList.add('show');
	console.log('modal已显示');
}

function closeModal() {
	modal.classList.remove('show');
	editingItem = null;
}

async function handleModalConfirm() {
	let data = {};
	let endpoint = '';
	let method = 'POST';

	if (currentMenu === 'video') {
		data = {
			title: document.getElementById('formTitle').value,
			description: document.getElementById('formDescription').value,
			video_url: document.getElementById('formVideoUrl').value,
			cover_url: document.getElementById('formCoverUrl').value
		};

		if (!data.title || !data.video_url) {
			showToast('请填写完整信息');
			return;
		}

		if (editingItem) {
			data.id = editingItem.id;
			method = 'PUT';
			endpoint = '/admin_videos.php';
		} else {
			endpoint = '/admin_videos.php';
		}
	} else if (currentMenu === 'user') {
		data = {
			username: document.getElementById('formUsername').value,
			nickname: document.getElementById('formNickname').value,
			role: document.getElementById('formRole').value
		};

		if (!data.username || (!editingItem && !document.getElementById('formPassword').value)) {
			showToast('请填写完整信息');
			return;
		}

		if (!editingItem) {
			data.password = document.getElementById('formPassword').value;
		}

		if (editingItem) {
			data.id = editingItem.id;
			method = 'PUT';
			endpoint = '/admin_users.php';
		} else {
			endpoint = '/admin_users.php';
		}
	} else if (currentMenu === 'carousel') {
		data = {
			title: document.getElementById('formTitle').value,
			author: document.getElementById('formAuthor').value,
			image_url: document.getElementById('formImageUrl').value,
			sort_order: parseInt(document.getElementById('formSortOrder').value),
			is_active: parseInt(document.getElementById('formIsActive').value)
		};

		if (!data.title || !data.image_url || !data.sort_order) {
			showToast('请填写完整信息');
			return;
		}

		if (editingItem) {
			data.id = editingItem.id;
			method = 'PUT';
			endpoint = '/admin_carousels.php';
		} else {
			endpoint = '/admin_carousels.php';
		}
	}

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (result.code === 200 || result.code === 201) {
			showToast('保存成功', 'success');
			closeModal();
			await loadData();
		} else {
			showToast(result.message || '保存失败');
		}
	} catch (error) {
		console.error('保存错误:', error);
		showToast('网络错误，请稍后重试');
	}
}

async function handleLogout() {
	if (!confirm('确定要退出登录吗？')) return;

	try {
		await fetch(`${API_BASE_URL}/admin_logout.php`, {
			method: 'POST',
			credentials: 'include'
		});

		localStorage.removeItem('adminInfo');
		window.location.href = 'login.html';
	} catch (error) {
		console.error('登出错误:', error);
		localStorage.removeItem('adminInfo');
		window.location.href = 'login.html';
	}
}

function showToast(message, type = 'error') {
	const toast = document.createElement('div');
	toast.className = 'toast';
	toast.textContent = message;
	toast.style.backgroundColor = type === 'success' ? '#67c23a' : '#f56c6c';
	toast.style.position = 'fixed';
	toast.style.top = '20px';
	toast.style.left = '50%';
	toast.style.transform = 'translateX(-50%)';
	toast.style.padding = '12px 24px';
	toast.style.backgroundColor = type === 'success' ? '#67c23a' : '#f56c6c';
	toast.style.color = '#ffffff';
	toast.style.borderRadius = '4px';
	toast.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
	toast.style.zIndex = '9999';
	toast.style.animation = 'slideDown 0.3s ease';

	document.body.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, 3000);
}

document.addEventListener('DOMContentLoaded', init);