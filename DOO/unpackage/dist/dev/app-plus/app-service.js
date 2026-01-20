if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _imports_0 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$e = {
    // 组件数据
    data() {
      return {
        // 用户名
        username: "",
        // 密码
        password: "",
        // 确认密码（注册时使用）
        confirmPassword: "",
        // 是否为注册模式（false=登录，true=注册）
        isRegister: false,
        // 背景图片URL
        backgroundUrl: "https://via.placeholder.com/750x800/f33e54/ffffff?text=Background",
        // 状态栏高度（适配不同设备）
        statusBarHeight: 0,
        // API基础地址
        apiBase: "http://192.168.1.12/DOO/server/api/"
      };
    },
    // 页面加载时执行
    onLoad() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 0;
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        uni.switchTab({
          url: "/pages/tabbar/tabbar-5/tabbar-5"
        });
      }
    },
    // 组件方法
    methods: {
      // 切换登录/注册模式
      toggleMode() {
        this.isRegister = !this.isRegister;
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
      },
      // 处理表单提交（登录或注册）
      async handleSubmit() {
        if (!this.username || !this.password) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        if (this.isRegister) {
          if (this.password !== this.confirmPassword) {
            uni.showToast({
              title: "两次密码不一致",
              icon: "none"
            });
            return;
          }
          await this.register();
        } else {
          await this.login();
        }
      },
      // 用户注册
      async register() {
        uni.showLoading({
          title: "注册中..."
        });
        try {
          const res = await uni.request({
            url: this.apiBase + "register.php",
            method: "POST",
            data: {
              username: this.username,
              password: this.password
            },
            header: {
              "Content-Type": "application/json"
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/login/login.vue:160", "注册响应:", res);
          if (res.statusCode === 201) {
            uni.showToast({
              title: "注册成功，请登录",
              icon: "success"
            });
            this.isRegister = false;
          } else {
            uni.showToast({
              title: res.data.message || "注册失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/login/login.vue:182", "注册错误:", error);
          uni.showToast({
            title: "网络错误，请检查后端服务",
            icon: "none"
          });
        }
      },
      // 用户登录
      async login() {
        uni.showLoading({
          title: "登录中..."
        });
        try {
          const res = await uni.request({
            url: this.apiBase + "login.php",
            method: "POST",
            data: {
              username: this.username,
              password: this.password
            },
            header: {
              "Content-Type": "application/json"
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/login/login.vue:216", "登录响应:", res);
          if (res.statusCode === 200) {
            const userInfo = res.data.data;
            uni.setStorageSync("userInfo", userInfo);
            uni.setStorageSync("userId", userInfo.id);
            uni.setStorageSync("isLoggedIn", true);
            uni.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/tabbar/tabbar-5/tabbar-5"
              });
            }, 1500);
          } else {
            uni.showToast({
              title: res.data.message || "登录失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/login/login.vue:250", "登录错误:", error);
          uni.showToast({
            title: "网络错误，请检查后端服务",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "background-banner",
          style: vue.normalizeStyle({ backgroundImage: "url(" + $data.backgroundUrl + ")" })
        },
        [
          vue.createElementVNode("view", { class: "banner-overlay" })
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "login-container" }, [
        vue.createElementVNode("view", { class: "logo-section" }, [
          vue.createElementVNode("image", {
            class: "logo",
            src: _imports_0,
            mode: "aspectFit"
          }),
          vue.createElementVNode("text", { class: "app-name" }, "DOO")
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "用户名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
                placeholder: "请输入用户名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.username]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
                type: "password",
                placeholder: "请输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.password]
            ])
          ]),
          $data.isRegister ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "确认密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
                type: "password",
                placeholder: "请再次输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.confirmPassword]
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "button",
            {
              class: "btn-primary",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
            },
            vue.toDisplayString($data.isRegister ? "注册" : "登录"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "switch-mode" }, [
            vue.createElementVNode(
              "text",
              { class: "switch-text" },
              vue.toDisplayString($data.isRegister ? "已有账号？" : "没有账号？"),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              {
                class: "switch-link",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.toggleMode && $options.toggleMode(...args))
              },
              vue.toDisplayString($data.isRegister ? "立即登录" : "立即注册"),
              1
              /* TEXT */
            )
          ])
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-e4e4508d"], ["__file", "E:/656/f/DOO/DOO/pages/login/login.vue"]]);
  const _sfc_main$d = {
    data() {
      return {
        activeMenu: "video",
        videoList: [
          {
            id: 1,
            title: "测试视频1",
            author: "用户A",
            views: "1.2w",
            status: "已发布"
          },
          {
            id: 2,
            title: "测试视频2",
            author: "用户B",
            views: "3.5k",
            status: "已发布"
          },
          {
            id: 3,
            title: "测试视频3",
            author: "用户C",
            views: "2.8k",
            status: "审核中"
          },
          {
            id: 4,
            title: "测试视频4",
            author: "用户D",
            views: "5.6k",
            status: "已发布"
          }
        ],
        userList: [
          {
            id: 1,
            username: "admin",
            email: "admin@example.com",
            role: "管理员",
            createTime: "2024-01-01"
          },
          {
            id: 2,
            username: "user1",
            email: "user1@example.com",
            role: "普通用户",
            createTime: "2024-01-15"
          },
          {
            id: 3,
            username: "user2",
            email: "user2@example.com",
            role: "普通用户",
            createTime: "2024-01-20"
          }
        ],
        carouselList: [
          {
            id: 1,
            title: "热门推荐",
            author: "官方推荐",
            image: "/static/img/banner1.jpg",
            sort: 1
          },
          {
            id: 2,
            title: "精选内容",
            author: "编辑精选",
            image: "/static/img/banner2.jpg",
            sort: 2
          },
          {
            id: 3,
            title: "最新发布",
            author: "用户发布",
            image: "/static/img/banner3.jpg",
            sort: 3
          },
          {
            id: 4,
            title: "关注推荐",
            author: "好友推荐",
            image: "/static/img/banner4.jpg",
            sort: 4
          }
        ]
      };
    },
    computed: {
      menuTitle() {
        const titles = {
          video: "视频管理",
          user: "用户管理",
          carousel: "轮播图管理"
        };
        return titles[this.activeMenu] || "";
      }
    },
    onLoad() {
      formatAppLog("log", "at pages/admin/admin.vue:237", "后台管理页面加载");
    },
    methods: {
      switchMenu(menu) {
        formatAppLog("log", "at pages/admin/admin.vue:241", "切换菜单:", menu);
        this.activeMenu = menu;
      },
      handleAdd() {
        formatAppLog("log", "at pages/admin/admin.vue:245", "添加新项目");
        uni.showToast({
          title: "添加功能开发中",
          icon: "none"
        });
      },
      handleEdit(item) {
        formatAppLog("log", "at pages/admin/admin.vue:252", "编辑项目:", item);
        uni.showToast({
          title: "编辑功能开发中",
          icon: "none"
        });
      },
      handleDelete(item) {
        formatAppLog("log", "at pages/admin/admin.vue:259", "删除项目:", item);
        uni.showModal({
          title: "确认删除",
          content: "确定要删除该项目吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "删除成功",
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "admin-container" }, [
      vue.createElementVNode("view", { class: "sidebar" }, [
        vue.createElementVNode("view", { class: "sidebar-header" }, [
          vue.createElementVNode("text", { class: "sidebar-title" }, "后台管理系统")
        ]),
        vue.createElementVNode("view", { class: "sidebar-menu" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["menu-item", { active: $data.activeMenu === "video" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.switchMenu("video"))
            },
            [
              vue.createElementVNode("text", { class: "menu-icon" }, "📹"),
              vue.createElementVNode("text", { class: "menu-text" }, "视频管理")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["menu-item", { active: $data.activeMenu === "user" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.switchMenu("user"))
            },
            [
              vue.createElementVNode("text", { class: "menu-icon" }, "👥"),
              vue.createElementVNode("text", { class: "menu-text" }, "用户管理")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["menu-item", { active: $data.activeMenu === "carousel" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.switchMenu("carousel"))
            },
            [
              vue.createElementVNode("text", { class: "menu-icon" }, "🎠"),
              vue.createElementVNode("text", { class: "menu-text" }, "轮播图管理")
            ],
            2
            /* CLASS */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "main-content" }, [
        vue.createElementVNode("view", { class: "content-header" }, [
          vue.createElementVNode(
            "text",
            { class: "content-title" },
            vue.toDisplayString($options.menuTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "header-actions" }, [
            vue.createElementVNode("button", {
              class: "btn btn-primary",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleAdd && $options.handleAdd(...args))
            }, "添加")
          ])
        ]),
        vue.createElementVNode("view", { class: "content-body" }, [
          $data.activeMenu === "video" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "table-container"
          }, [
            vue.createElementVNode("view", { class: "table-header" }, [
              vue.createElementVNode("view", { class: "table-cell cell-id" }, "ID"),
              vue.createElementVNode("view", { class: "table-cell cell-title" }, "标题"),
              vue.createElementVNode("view", { class: "table-cell cell-author" }, "作者"),
              vue.createElementVNode("view", { class: "table-cell cell-views" }, "播放量"),
              vue.createElementVNode("view", { class: "table-cell cell-status" }, "状态"),
              vue.createElementVNode("view", { class: "table-cell cell-actions" }, "操作")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.videoList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "table-row",
                  key: item.id
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-id" },
                    vue.toDisplayString(item.id),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-author" },
                    vue.toDisplayString(item.author),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-views" },
                    vue.toDisplayString(item.views),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell cell-status" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["status-badge", item.status === "已发布" ? "status-success" : "status-warning"])
                      },
                      vue.toDisplayString(item.status),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "table-cell cell-actions" }, [
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-edit",
                      onClick: ($event) => $options.handleEdit(item)
                    }, "编辑", 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-delete",
                      onClick: ($event) => $options.handleDelete(item)
                    }, "删除", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          $data.activeMenu === "user" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "table-container"
          }, [
            vue.createElementVNode("view", { class: "table-header" }, [
              vue.createElementVNode("view", { class: "table-cell cell-id" }, "ID"),
              vue.createElementVNode("view", { class: "table-cell cell-username" }, "用户名"),
              vue.createElementVNode("view", { class: "table-cell cell-email" }, "邮箱"),
              vue.createElementVNode("view", { class: "table-cell cell-role" }, "角色"),
              vue.createElementVNode("view", { class: "table-cell cell-time" }, "注册时间"),
              vue.createElementVNode("view", { class: "table-cell cell-actions" }, "操作")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.userList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "table-row",
                  key: item.id
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-id" },
                    vue.toDisplayString(item.id),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-username" },
                    vue.toDisplayString(item.username),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-email" },
                    vue.toDisplayString(item.email),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell cell-role" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["role-badge", item.role === "管理员" ? "role-admin" : "role-user"])
                      },
                      vue.toDisplayString(item.role),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-time" },
                    vue.toDisplayString(item.createTime),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell cell-actions" }, [
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-edit",
                      onClick: ($event) => $options.handleEdit(item)
                    }, "编辑", 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-delete",
                      onClick: ($event) => $options.handleDelete(item)
                    }, "删除", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          $data.activeMenu === "carousel" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "table-container"
          }, [
            vue.createElementVNode("view", { class: "table-header" }, [
              vue.createElementVNode("view", { class: "table-cell cell-id" }, "ID"),
              vue.createElementVNode("view", { class: "table-cell cell-title" }, "标题"),
              vue.createElementVNode("view", { class: "table-cell cell-author" }, "作者"),
              vue.createElementVNode("view", { class: "table-cell cell-image" }, "图片"),
              vue.createElementVNode("view", { class: "table-cell cell-sort" }, "排序"),
              vue.createElementVNode("view", { class: "table-cell cell-actions" }, "操作")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.carouselList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "table-row",
                  key: item.id
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-id" },
                    vue.toDisplayString(item.id),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-author" },
                    vue.toDisplayString(item.author),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell cell-image" }, [
                    vue.createElementVNode("image", {
                      class: "carousel-thumb",
                      src: item.image,
                      mode: "aspectFill"
                    }, null, 8, ["src"])
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "table-cell cell-sort" },
                    vue.toDisplayString(item.sort),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "table-cell cell-actions" }, [
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-edit",
                      onClick: ($event) => $options.handleEdit(item)
                    }, "编辑", 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "btn btn-sm btn-delete",
                      onClick: ($event) => $options.handleDelete(item)
                    }, "删除", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesAdminAdmin = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-dbc77958"], ["__file", "E:/656/f/DOO/DOO/pages/admin/admin.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        statusBarHeight: 0,
        userInfo: null,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        apiBase: "http://localhost/DOO/server/api/"
      };
    },
    onLoad() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 0;
      this.loadUserInfo();
    },
    methods: {
      loadUserInfo() {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          this.userInfo = userInfo;
        }
      },
      async handleChangePassword() {
        if (!this.oldPassword) {
          uni.showToast({
            title: "请输入原密码",
            icon: "none"
          });
          return;
        }
        if (!this.newPassword) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          });
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          uni.showToast({
            title: "两次密码不一致",
            icon: "none"
          });
          return;
        }
        if (this.newPassword.length < 6) {
          uni.showToast({
            title: "密码长度不能少于6位",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "修改中..."
        });
        try {
          const res = await uni.request({
            url: this.apiBase + "change_password.php",
            method: "POST",
            data: {
              user_id: this.userInfo.id,
              old_password: this.oldPassword,
              new_password: this.newPassword
            },
            header: {
              "Content-Type": "application/json"
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/settings/settings.vue:110", "修改密码响应:", res);
          if (res.statusCode === 200) {
            uni.showToast({
              title: "密码修改成功",
              icon: "success"
            });
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
          } else {
            uni.showToast({
              title: res.data.message || "密码修改失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/settings/settings.vue:129", "修改密码错误:", error);
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      },
      handleLogout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("userInfo");
              uni.removeStorageSync("isLoggedIn");
              uni.showToast({
                title: "已退出登录",
                icon: "success"
              });
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/tabbar/tabbar-5/tabbar-5"
                });
              }, 1e3);
            }
          }
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "settings-container" }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "修改密码"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "原密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.oldPassword = $event),
                type: "password",
                placeholder: "请输入原密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.oldPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "新密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newPassword = $event),
                type: "password",
                placeholder: "请输入新密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "确认密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
                type: "password",
                placeholder: "请再次输入新密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.confirmPassword]
            ])
          ]),
          vue.createElementVNode("button", {
            class: "btn-primary",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleChangePassword && $options.handleChangePassword(...args))
          }, "确认修改")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "账户操作"),
          vue.createElementVNode("button", {
            class: "btn-danger",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.handleLogout && $options.handleLogout(...args))
          }, "退出登录")
        ])
      ])
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-7fad0a1c"], ["__file", "E:/656/f/DOO/DOO/pages/settings/settings.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        statusBarHeight: 0,
        userInfo: null,
        avatarUrl: "https://via.placeholder.com/150",
        nickname: "",
        gender: "secret",
        birthday: "",
        region: "",
        bio: "",
        showUploadModal: false,
        apiBase: "http://192.168.1.12/DOO/server/api/"
      };
    },
    onLoad() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 0;
      this.loadUserInfo();
    },
    methods: {
      loadUserInfo() {
        const userInfo = uni.getStorageSync("userInfo");
        if (userInfo) {
          this.userInfo = userInfo;
          this.avatarUrl = userInfo.avatar || "https://via.placeholder.com/150";
          this.nickname = userInfo.nickname || userInfo.username || "";
          this.gender = userInfo.gender || "secret";
          this.birthday = userInfo.birthday || "";
          this.region = userInfo.region || "";
          this.bio = userInfo.bio || "";
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
          sizeType: ["compressed"],
          sourceType: ["album"],
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
          sizeType: ["compressed"],
          sourceType: ["camera"],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0];
            await this.uploadAvatar(tempFilePath);
            this.showUploadModal = false;
          }
        });
      },
      async uploadAvatar(filePath) {
        uni.showLoading({
          title: "上传中..."
        });
        try {
          const uploadRes = await uni.uploadFile({
            url: this.apiBase + "upload.php",
            filePath,
            name: "file"
          });
          const data = JSON.parse(uploadRes.data);
          if (data.code === 200) {
            this.avatarUrl = data.data.url;
            uni.hideLoading();
            uni.showToast({
              title: "头像上传成功",
              icon: "success"
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: data.message || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/edit-profile/edit-profile.vue:214", "上传错误:", error);
          uni.showToast({
            title: "上传失败",
            icon: "none"
          });
        }
      },
      onBirthdayChange(e) {
        this.birthday = e.detail.value;
      },
      onRegionChange(e) {
        this.region = e.detail.value.join(" ");
      },
      onBioInput(e) {
        if (this.bio.length > 200) {
          this.bio = this.bio.substring(0, 200);
        }
      },
      async saveProfile() {
        if (!this.nickname) {
          uni.showToast({
            title: "请输入昵称",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "保存中..."
        });
        try {
          const res = await uni.request({
            url: this.apiBase + "update_user.php",
            method: "POST",
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
              "Content-Type": "application/json"
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
            uni.setStorageSync("userInfo", updatedUserInfo);
            this.userInfo = updatedUserInfo;
            uni.showToast({
              title: "保存成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1e3);
          } else {
            uni.showToast({
              title: res.data.message || "保存失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/edit-profile/edit-profile.vue:299", "保存错误:", error);
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("text", {
            class: "nav-back",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
          }, "‹"),
          vue.createElementVNode("text", { class: "nav-title" }, "编辑资料"),
          vue.createElementVNode("text", {
            class: "nav-save",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.saveProfile && $options.saveProfile(...args))
          }, "保存")
        ])
      ]),
      vue.createElementVNode("view", { class: "profile-section" }, [
        vue.createElementVNode("view", {
          class: "avatar-section",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.changeAvatar && $options.changeAvatar(...args))
        }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $data.avatarUrl,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "avatar-edit" }, [
            vue.createElementVNode("text", { class: "edit-icon" }, "📷"),
            vue.createElementVNode("text", { class: "edit-text" }, "更换头像")
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "昵称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.nickname = $event),
                placeholder: "请输入昵称",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.nickname]
            ]),
            vue.createElementVNode(
              "text",
              { class: "count" },
              vue.toDisplayString($data.nickname.length) + "/20",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "性别"),
            vue.createElementVNode("view", { class: "gender-options" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["gender-option", { active: $data.gender === "male" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $data.gender = "male")
                },
                [
                  vue.createElementVNode("text", { class: "gender-icon" }, "♂"),
                  vue.createElementVNode("text", { class: "gender-text" }, "男")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["gender-option", { active: $data.gender === "female" }]),
                  onClick: _cache[5] || (_cache[5] = ($event) => $data.gender = "female")
                },
                [
                  vue.createElementVNode("text", { class: "gender-icon" }, "♀"),
                  vue.createElementVNode("text", { class: "gender-text" }, "女")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["gender-option", { active: $data.gender === "secret" }]),
                  onClick: _cache[6] || (_cache[6] = ($event) => $data.gender = "secret")
                },
                [
                  vue.createElementVNode("text", { class: "gender-icon" }, "?"),
                  vue.createElementVNode("text", { class: "gender-text" }, "保密")
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "生日"),
            vue.createElementVNode("picker", {
              mode: "date",
              value: $data.birthday,
              onChange: _cache[7] || (_cache[7] = (...args) => $options.onBirthdayChange && $options.onBirthdayChange(...args))
            }, [
              vue.createElementVNode("view", { class: "picker" }, [
                vue.createElementVNode(
                  "text",
                  { class: "picker-text" },
                  vue.toDisplayString($data.birthday || "请选择生日"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "picker-arrow" }, "›")
              ])
            ], 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "地区"),
            vue.createElementVNode("picker", {
              mode: "region",
              value: $data.region,
              onChange: _cache[8] || (_cache[8] = (...args) => $options.onRegionChange && $options.onRegionChange(...args))
            }, [
              vue.createElementVNode("view", { class: "picker" }, [
                vue.createElementVNode(
                  "text",
                  { class: "picker-text" },
                  vue.toDisplayString($data.region || "请选择地区"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "picker-arrow" }, "›")
              ])
            ], 40, ["value"])
          ]),
          vue.createElementVNode("view", { class: "form-item textarea-item" }, [
            vue.createElementVNode("text", { class: "label" }, "个人简介"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.bio = $event),
                placeholder: "介绍一下自己吧...",
                maxlength: "200",
                onInput: _cache[10] || (_cache[10] = (...args) => $options.onBioInput && $options.onBioInput(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.bio]
            ]),
            vue.createElementVNode(
              "text",
              { class: "count" },
              vue.toDisplayString($data.bio.length) + "/200",
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      $data.showUploadModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "upload-modal",
        onClick: _cache[15] || (_cache[15] = vue.withModifiers(($event) => $data.showUploadModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[14] || (_cache[14] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "选择头像"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[11] || (_cache[11] = ($event) => $data.showUploadModal = false)
            }, "✕")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", {
              class: "upload-option",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.chooseFromAlbum && $options.chooseFromAlbum(...args))
            }, [
              vue.createElementVNode("text", { class: "upload-icon" }, "🖼️"),
              vue.createElementVNode("text", { class: "upload-text" }, "从相册选择")
            ]),
            vue.createElementVNode("view", {
              class: "upload-option",
              onClick: _cache[13] || (_cache[13] = (...args) => $options.takePhoto && $options.takePhoto(...args))
            }, [
              vue.createElementVNode("text", { class: "upload-icon" }, "📷"),
              vue.createElementVNode("text", { class: "upload-text" }, "拍照")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesEditProfileEditProfile = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-c0f45e44"], ["__file", "E:/656/f/DOO/DOO/pages/edit-profile/edit-profile.vue"]]);
  const _sfc_main$a = {
    // 组件数据
    data() {
      return {
        // 当前激活的标签（recommend=推荐，follow=关注）
        activeTab: "recommend",
        // 状态栏高度（适配不同设备）
        statusBarHeight: 0,
        // 轮播图列表
        carouselList: [],
        // 卡片列表
        cardList: [
          {
            id: 1,
            title: "热门视频",
            author: "DOO官方",
            cover: "https://via.placeholder.com/100x100/409eff/ffffff?text=Video1",
            description: "这是热门视频的详细描述内容，包含了视频的主要信息和特色介绍。"
          },
          {
            id: 2,
            title: "精选内容",
            author: "编辑推荐",
            cover: "https://via.placeholder.com/100x100/67c23a/ffffff?text=Video2",
            description: "这是精选内容的详细描述，由编辑团队精心挑选的优质内容。"
          },
          {
            id: 3,
            title: "最新发布",
            author: "用户A",
            cover: "https://via.placeholder.com/100x100/e6a23c/ffffff?text=Video3",
            description: "这是最新发布的内容，包含了最新的动态和资讯。"
          },
          {
            id: 4,
            title: "推荐观看",
            author: "用户B",
            cover: "https://via.placeholder.com/100x100/f56c6c/ffffff?text=Video4",
            description: "这是推荐观看的内容，根据您的喜好智能推荐。"
          }
        ],
        // 是否正在刷新
        refreshing: false
      };
    },
    // 页面加载时执行
    onLoad() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 0;
      formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:155", "首页加载，状态栏高度:", this.statusBarHeight);
      this.loadCarouselData();
    },
    // 组件方法
    methods: {
      // 加载轮播图数据
      async loadCarouselData() {
        formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:164", "开始加载轮播图...");
        try {
          const response = await uni.request({
            url: "http://192.168.1.12/DOO/server/api/get_carousels.php",
            method: "GET"
          });
          formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:173", "轮播图响应状态码:", response.statusCode);
          formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:174", "轮播图响应数据:", response.data);
          formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:175", "轮播图响应数据类型:", typeof response.data);
          if (response.statusCode === 200) {
            let result;
            if (typeof response.data === "string") {
              result = JSON.parse(response.data);
            } else if (typeof response.data === "object") {
              result = response.data;
            } else {
              formatAppLog("error", "at pages/tabbar/tabbar-1/tabbar-1.vue:189", "响应数据类型错误:", typeof response.data);
              return;
            }
            formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:194", "轮播图解析结果:", result);
            if (result.code === 200) {
              this.carouselList = result.data || [];
              formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:200", "轮播图数据加载成功:", this.carouselList);
            } else {
              formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:203", "轮播图API返回错误:", result.message);
            }
          } else {
            formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:207", "轮播图请求失败，状态码:", response.statusCode);
          }
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-1/tabbar-1.vue:211", "加载轮播图失败:", error);
        }
      },
      // 下拉刷新处理
      async onRefresh() {
        formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:217", "下拉刷新...");
        this.refreshing = true;
        try {
          await this.loadCarouselData();
          uni.showToast({
            title: "刷新成功",
            icon: "success"
          });
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-1/tabbar-1.vue:232", "刷新失败:", error);
          uni.showToast({
            title: "刷新失败",
            icon: "none"
          });
        } finally {
          this.refreshing = false;
        }
      },
      // 切换标签
      switchTab(tab) {
        formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:246", "切换标签:", tab);
        this.activeTab = tab;
      },
      // 点击轮播图项
      clickCarouselItem(item) {
        formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:253", "点击轮播项:", item);
      },
      // 点击卡片
      clickCard(card) {
        formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:258", "点击卡片:", card);
        uni.navigateTo({
          url: "/pages/card-detail/card-detail",
          success: (res) => {
            res.eventChannel.emit("setCard", card);
          }
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "nav-bar",
          style: vue.normalizeStyle({ paddingTop: $data.statusBarHeight + "px" })
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["nav-item", { active: $data.activeTab === "recommend" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.switchTab("recommend"))
            },
            " 推荐 ",
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["nav-item", { active: $data.activeTab === "follow" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab("follow"))
            },
            " 关注 ",
            2
            /* CLASS */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("scroll-view", {
        class: "content-area",
        "scroll-y": "true",
        "refresher-enabled": true,
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[2] || (_cache[2] = (...args) => $options.onRefresh && $options.onRefresh(...args))
      }, [
        $data.activeTab === "recommend" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "tab-content"
        }, [
          vue.createElementVNode("view", { class: "carousel-section" }, [
            vue.createElementVNode("swiper", {
              class: "carousel-swiper",
              "indicator-dots": true,
              autoplay: true,
              interval: 3e3,
              circular: true
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.carouselList, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    class: "carousel-item",
                    key: index,
                    onClick: ($event) => $options.clickCarouselItem(item)
                  }, [
                    vue.createElementVNode("view", { class: "carousel-card" }, [
                      vue.createElementVNode("image", {
                        class: "carousel-image",
                        src: item.image,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "carousel-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "carousel-title" },
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "carousel-author" },
                          vue.toDisplayString(item.author),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "cards-section" }, [
            vue.createElementVNode("view", { class: "cards-container" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.cardList, (card, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "card-item",
                    key: index,
                    onClick: ($event) => $options.clickCard(card)
                  }, [
                    vue.createElementVNode("view", { class: "card-thumb" }, [
                      vue.createElementVNode("image", {
                        class: "thumb-image",
                        src: card.cover,
                        mode: "aspectFill"
                      }, null, 8, ["src"])
                    ]),
                    vue.createElementVNode("view", { class: "card-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "card-title" },
                        vue.toDisplayString(card.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "card-author" },
                        vue.toDisplayString(card.author),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.activeTab === "follow" ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "tab-content follow-content"
        }, [
          vue.createElementVNode("view", { class: "empty-state" }, [
            vue.createElementVNode("text", { class: "empty-text" }, "暂无关注内容")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ], 40, ["refresher-triggered"])
    ]);
  }
  const PagesTabbarTabbar1Tabbar1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-02c5fac1"], ["__file", "E:/656/f/DOO/DOO/pages/tabbar/tabbar-1/tabbar-1.vue"]]);
  const _sfc_main$9 = {
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
      this.loadUserList();
    },
    // 组件方法
    methods: {
      // 加载用户列表
      async loadUserList() {
        try {
          const response = await uni.request({
            url: "http://192.168.1.12/DOO/server/api/get_users.php",
            method: "GET"
          });
          if (response.statusCode === 200) {
            const result = response.data;
            if (result.code === 200) {
              this.userList = result.data;
              formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:88", "用户列表加载成功:", this.userList);
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-2/tabbar-2.vue:93", "加载用户列表失败:", error);
          uni.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      },
      // 查看用户详情
      viewUserDetail(user) {
        uni.navigateTo({
          url: "/pages/user-detail/user-detail",
          // 成功回调，传递用户数据
          success: (res) => {
            res.eventChannel.emit("setUser", user);
          }
        });
      },
      // 下拉刷新处理
      async onRefresh() {
        formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:115", "下拉刷新...");
        this.refreshing = true;
        try {
          await this.loadUserList();
          uni.showToast({
            title: "刷新成功",
            icon: "success"
          });
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-2/tabbar-2.vue:130", "刷新失败:", error);
          uni.showToast({
            title: "刷新失败",
            icon: "none"
          });
        } finally {
          this.refreshing = false;
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "tabs" }, [
        vue.createElementVNode("view", { class: "tab-item active" }, " 全部用户 ")
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-area",
        "scroll-y": "true",
        "refresher-enabled": true,
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[0] || (_cache[0] = (...args) => $options.onRefresh && $options.onRefresh(...args))
      }, [
        vue.createElementVNode("view", { class: "user-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.userList, (user, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "user-item",
                key: index,
                onClick: ($event) => $options.viewUserDetail(user)
              }, [
                vue.createElementVNode("view", { class: "user-avatar" }, [
                  vue.createElementVNode("image", {
                    src: user.avatar || "/static/img/default-avatar.png",
                    mode: "aspectFill"
                  }, null, 8, ["src"])
                ]),
                vue.createElementVNode("view", { class: "user-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString(user.nickname || user.username),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "user-stats" },
                    " 粉丝 " + vue.toDisplayString(user.followers) + " · 关注 " + vue.toDisplayString(user.following),
                    1
                    /* TEXT */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ], 40, ["refresher-triggered"])
    ]);
  }
  const PagesTabbarTabbar2Tabbar2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-f8aa9678"], ["__file", "E:/656/f/DOO/DOO/pages/tabbar/tabbar-2/tabbar-2.vue"]]);
  const _imports_1 = "/static/img/release.png";
  const _imports_2 = "/static/img/video.png";
  const _imports_3 = "/static/img/qa.png";
  const _sfc_main$8 = {
    data() {
      return {
        active: false
      };
    },
    onLoad() {
    },
    onShow() {
      this.active = true;
    },
    onHide() {
      this.active = false;
    },
    methods: {
      goToPage(url) {
        if (!url)
          return;
        uni.navigateTo({
          url
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["content", { "active": $data.active }])
      },
      [
        vue.createElementVNode(
          "image",
          {
            class: vue.normalizeClass(["logo", { "active": $data.active }]),
            src: _imports_0,
            mode: "aspectFit"
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode("view", { class: "tabbar-box-wrap" }, [
          vue.createElementVNode("view", { class: "tabbar-box" }, [
            vue.createElementVNode("view", {
              class: "tabbar-box-item",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.goToPage("/pages/tabbar-3-detial/tabbar-3-release/tabbar-3-release"))
            }, [
              vue.createElementVNode("image", {
                class: "box-image",
                src: _imports_1,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "explain" }, "发图文")
            ]),
            vue.createElementVNode("view", {
              class: "tabbar-box-item",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.goToPage("/pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video"))
            }, [
              vue.createElementVNode("image", {
                class: "box-image",
                src: _imports_2,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "explain" }, "发视频")
            ]),
            vue.createElementVNode("view", {
              class: "tabbar-box-item",
              onClick: _cache[2] || (_cache[2] = ($event) => $options.goToPage("/pages/tabbar-3-detial/tabbar-3-qa/tabbar-3-qa"))
            }, [
              vue.createElementVNode("image", {
                class: "box-image",
                src: _imports_3,
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "explain" }, "提问")
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesTabbarTabbar3Tabbar3 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-afdd7fb7"], ["__file", "E:/656/f/DOO/DOO/pages/tabbar/tabbar-3/tabbar-3.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, " 页面 - 4 ");
  }
  const PagesTabbarTabbar4Tabbar4 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "E:/656/f/DOO/DOO/pages/tabbar/tabbar-4/tabbar-4.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        avatarUrl: "https://via.placeholder.com/150",
        nickname: "未登录",
        isLoggedIn: false,
        backgroundUrl: "https://via.placeholder.com/750x450/f33e54/ffffff?text=Background",
        statusBarHeight: 0,
        userInfo: null,
        apiBase: "http://192.168.1.12/DOO/server/api/",
        showPasswordModal: false,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        passwordStrength: { score: 0, text: "", class: "" },
        passwordMatch: false
      };
    },
    computed: {
      canSubmit() {
        return this.oldPassword && this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword && this.newPassword.length >= 6;
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
        const userInfo = uni.getStorageSync("userInfo");
        const isLoggedIn = uni.getStorageSync("isLoggedIn");
        formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:203", "loadUserInfo - 从存储读取:", userInfo);
        formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:204", "loadUserInfo - 登录状态:", isLoggedIn);
        if (isLoggedIn && userInfo) {
          this.isLoggedIn = true;
          this.userInfo = userInfo;
          this.nickname = userInfo.nickname || userInfo.username;
          this.avatarUrl = userInfo.avatar || "https://via.placeholder.com/150";
          this.backgroundUrl = userInfo.background_image || "https://via.placeholder.com/750x450/f33e54/ffffff?text=Background";
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:212", "loadUserInfo - 头像URL:", this.avatarUrl);
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:213", "loadUserInfo - 背景URL:", this.backgroundUrl);
        } else {
          this.isLoggedIn = false;
          this.userInfo = null;
          this.nickname = "未登录";
          this.avatarUrl = "https://via.placeholder.com/150";
          this.backgroundUrl = "https://via.placeholder.com/750x450/f33e54/ffffff?text=Background";
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:220", "loadUserInfo - 未登录，使用默认值");
        }
      },
      handleLogin() {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      },
      handleRegister() {
        uni.navigateTo({
          url: "/pages/login/login?mode=register"
        });
      },
      handleEdit() {
        uni.showToast({
          title: "编辑资料功能开发中",
          icon: "none"
        });
      },
      goToEditProfile() {
        if (!this.isLoggedIn) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        uni.navigateTo({
          url: "/pages/edit-profile/edit-profile"
        });
      },
      changeAvatar() {
        if (!this.isLoggedIn) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0];
            await this.uploadImage(tempFilePath, "avatar");
          }
        });
      },
      changeBackground() {
        if (!this.isLoggedIn) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0];
            await this.uploadImage(tempFilePath, "background");
          }
        });
      },
      async uploadImage(filePath, type) {
        uni.showLoading({
          title: "上传中..."
        });
        try {
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:303", "开始上传图片:", filePath, type);
          const uploadRes = await uni.uploadFile({
            url: this.apiBase + "upload.php",
            filePath,
            name: "file"
          });
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:311", "上传响应:", uploadRes);
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:312", "响应状态码:", uploadRes.statusCode);
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:313", "响应数据:", uploadRes.data);
          if (!uploadRes.data) {
            uni.hideLoading();
            uni.showToast({
              title: "上传失败，服务器未返回数据",
              icon: "none"
            });
            return;
          }
          let data;
          try {
            data = JSON.parse(uploadRes.data);
          } catch (e) {
            uni.hideLoading();
            formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:329", "JSON解析失败:", e, uploadRes.data);
            uni.showToast({
              title: "服务器返回数据格式错误",
              icon: "none"
            });
            return;
          }
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:337", "解析后的数据:", data);
          if (data.code === 200) {
            const imageUrl = data.data.url;
            formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:341", "获取到的图片URL:", imageUrl);
            if (type === "avatar") {
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:344", "更新头像:", imageUrl);
              this.avatarUrl = imageUrl;
              await this.updateUserInfo({ avatar: imageUrl });
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:347", "头像已设置:", this.avatarUrl);
            } else if (type === "background") {
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:349", "更新背景:", imageUrl);
              this.backgroundUrl = imageUrl;
              await this.updateUserInfo({ background_image: imageUrl });
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:352", "背景已设置:", this.backgroundUrl);
            }
            uni.hideLoading();
            uni.showToast({
              title: "上传成功",
              icon: "success"
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: data.message || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:369", "上传错误:", error);
          uni.showToast({
            title: "上传失败，请检查网络连接",
            icon: "none"
          });
        }
      },
      async updateUserInfo(data) {
        try {
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:379", "更新用户信息:", data);
          const res = await uni.request({
            url: this.apiBase + "update_user.php",
            method: "POST",
            data: {
              user_id: this.userInfo.id,
              ...data
            },
            header: {
              "Content-Type": "application/json"
            }
          });
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:393", "更新响应:", res);
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:394", "响应状态码:", res.statusCode);
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:395", "响应数据:", res.data);
          if (res.statusCode === 200) {
            const updatedUserInfo = { ...this.userInfo, ...data };
            this.userInfo = updatedUserInfo;
            uni.setStorageSync("userInfo", updatedUserInfo);
            formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:401", "用户信息已更新:", updatedUserInfo);
            if (data.avatar) {
              this.avatarUrl = data.avatar;
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:405", "头像已更新到视图:", this.avatarUrl);
            }
            if (data.background_image) {
              this.backgroundUrl = data.background_image;
              formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:409", "背景已更新到视图:", this.backgroundUrl);
            }
            this.$forceUpdate();
          } else {
            formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:414", "更新失败:", res.data);
          }
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:417", "更新用户信息失败:", error);
        }
      },
      checkPasswordStrength() {
        if (!this.newPassword) {
          this.passwordStrength = { score: 0, text: "", class: "" };
          return;
        }
        let score = 0;
        const password = this.newPassword;
        if (password.length >= 6)
          score++;
        if (password.length >= 10)
          score++;
        if (password.length >= 12)
          score++;
        if (/[a-z]/.test(password))
          score++;
        if (/[A-Z]/.test(password))
          score++;
        if (/[0-9]/.test(password))
          score++;
        if (/[^a-zA-Z0-9]/.test(password))
          score++;
        if (score <= 2) {
          this.passwordStrength = { score, text: "弱", class: "weak" };
        } else if (score <= 4) {
          this.passwordStrength = { score, text: "中", class: "medium" };
        } else {
          this.passwordStrength = { score, text: "强", class: "strong" };
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
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        this.showPasswordModal = true;
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      },
      async confirmChangePassword() {
        if (!this.canSubmit) {
          return;
        }
        uni.showLoading({
          title: "修改中..."
        });
        try {
          const res = await uni.request({
            url: this.apiBase + "change_password.php",
            method: "POST",
            data: {
              user_id: this.userInfo.id,
              old_password: this.oldPassword,
              new_password: this.newPassword
            },
            header: {
              "Content-Type": "application/json"
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/tabbar/tabbar-5/tabbar-5.vue:496", "修改密码响应:", res);
          if (res.statusCode === 200) {
            uni.showToast({
              title: "密码修改成功",
              icon: "success"
            });
            this.showPasswordModal = false;
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
            this.passwordStrength = { score: 0, text: "", class: "" };
            this.passwordMatch = false;
          } else {
            uni.showToast({
              title: res.data.message || "密码修改失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:518", "修改密码错误:", error);
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      },
      handleLogout() {
        if (!this.isLoggedIn) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("userInfo");
              uni.removeStorageSync("isLoggedIn");
              this.isLoggedIn = false;
              this.userInfo = null;
              this.nickname = "未登录";
              this.avatarUrl = "https://via.placeholder.com/150";
              this.backgroundUrl = "https://via.placeholder.com/750x450/f33e54/ffffff?text=Background";
              uni.showToast({
                title: "已退出登录",
                icon: "success"
              });
            }
          }
        });
      },
      handleMenuClick(type) {
        const menuMap = {
          myPosts: "我的帖子",
          myVideos: "我的视频",
          myQuestions: "我的提问",
          favorites: "我的收藏",
          aboutUs: "关于我们"
        };
        uni.showToast({
          title: menuMap[type],
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "background-banner",
          style: vue.normalizeStyle({ backgroundImage: "url(" + $data.backgroundUrl + ")" }),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.changeBackground && $options.changeBackground(...args))
        },
        [
          vue.createElementVNode("view", { class: "banner-overlay" })
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "user-card" }, [
        vue.createElementVNode("view", {
          class: "avatar-wrapper",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.changeAvatar && $options.changeAvatar(...args))
        }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $data.avatarUrl,
            mode: "aspectFill"
          }, null, 8, ["src"])
        ]),
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode(
            "text",
            { class: "nickname" },
            vue.toDisplayString($data.nickname),
            1
            /* TEXT */
          ),
          $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "user-stats"
          }, [
            vue.createElementVNode("text", { class: "stat-item" }, "粉丝 0"),
            vue.createElementVNode("text", { class: "stat-divider" }, "|"),
            vue.createElementVNode("text", { class: "stat-item" }, "关注 0"),
            vue.createElementVNode("text", { class: "stat-divider" }, "|"),
            vue.createElementVNode("text", { class: "stat-item" }, "获赞 0")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        !$data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "button-group"
        }, [
          vue.createElementVNode("button", {
            class: "btn btn-login",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleLogin && $options.handleLogin(...args))
          }, "登录"),
          vue.createElementVNode("button", {
            class: "btn btn-register",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleRegister && $options.handleRegister(...args))
          }, "注册")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "edit-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.goToEditProfile && $options.goToEditProfile(...args))
        }, [
          vue.createElementVNode("text", { class: "edit-text" }, "编辑资料")
        ]))
      ]),
      vue.createElementVNode("view", { class: "menu-list" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = ($event) => $options.handleMenuClick("myPosts"))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "📝")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "我的帖子"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[6] || (_cache[6] = ($event) => $options.handleMenuClick("myVideos"))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "🎬")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "我的视频"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[7] || (_cache[7] = ($event) => $options.handleMenuClick("myQuestions"))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "❓")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "我的提问"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[8] || (_cache[8] = ($event) => $options.handleMenuClick("favorites"))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "⭐")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "我的收藏"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[9] || (_cache[9] = ($event) => $options.handleMenuClick("aboutUs"))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "ℹ️")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "关于我们"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[10] || (_cache[10] = (...args) => $options.handleChangePassword && $options.handleChangePassword(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "🔑")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "修改密码"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, [
          vue.createElementVNode("view", { class: "menu-icon" }, [
            vue.createElementVNode("text", { class: "icon-text" }, "🚪")
          ]),
          vue.createElementVNode("text", { class: "menu-text" }, "退出登录"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ])
      ]),
      $data.showPasswordModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "password-modal",
        onClick: _cache[24] || (_cache[24] = vue.withModifiers(($event) => $data.showPasswordModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[23] || (_cache[23] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "修改密码"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[12] || (_cache[12] = ($event) => $data.showPasswordModal = false)
            }, "✕")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "原密码"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input",
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.oldPassword = $event),
                  type: $data.showOldPassword ? "text" : "password",
                  placeholder: "请输入原密码",
                  "placeholder-style": { color: "#999999" }
                }, null, 8, ["type"]), [
                  [vue.vModelDynamic, $data.oldPassword]
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "toggle-password",
                    onClick: _cache[14] || (_cache[14] = ($event) => $data.showOldPassword = !$data.showOldPassword)
                  },
                  vue.toDisplayString($data.showOldPassword ? "隐藏" : "显示"),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "新密码"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input",
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.newPassword = $event),
                  type: $data.showNewPassword ? "text" : "password",
                  placeholder: "请输入新密码（6-20位）",
                  "placeholder-style": { color: "#999999" },
                  maxlength: "20",
                  onInput: _cache[16] || (_cache[16] = (...args) => $options.checkPasswordStrength && $options.checkPasswordStrength(...args))
                }, null, 40, ["type"]), [
                  [vue.vModelDynamic, $data.newPassword]
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "toggle-password",
                    onClick: _cache[17] || (_cache[17] = ($event) => $data.showNewPassword = !$data.showNewPassword)
                  },
                  vue.toDisplayString($data.showNewPassword ? "隐藏" : "显示"),
                  1
                  /* TEXT */
                )
              ]),
              $data.newPassword ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "password-strength"
              }, [
                vue.createElementVNode("text", { class: "strength-label" }, "密码强度:"),
                vue.createElementVNode("view", { class: "strength-bar" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["strength-fill", $data.passwordStrength.class])
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["strength-text", $data.passwordStrength.class])
                  },
                  vue.toDisplayString($data.passwordStrength.text),
                  3
                  /* TEXT, CLASS */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "确认密码"),
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "input",
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.confirmPassword = $event),
                  type: $data.showConfirmPassword ? "text" : "password",
                  placeholder: "请再次输入新密码",
                  "placeholder-style": { color: "#999999" },
                  onInput: _cache[19] || (_cache[19] = (...args) => $options.checkPasswordMatch && $options.checkPasswordMatch(...args))
                }, null, 40, ["type"]), [
                  [vue.vModelDynamic, $data.confirmPassword]
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "toggle-password",
                    onClick: _cache[20] || (_cache[20] = ($event) => $data.showConfirmPassword = !$data.showConfirmPassword)
                  },
                  vue.toDisplayString($data.showConfirmPassword ? "隐藏" : "显示"),
                  1
                  /* TEXT */
                )
              ]),
              $data.confirmPassword ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "match-hint"
              }, [
                $data.passwordMatch ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "match-success"
                }, "✓ 密码一致")) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "match-error"
                }, "✗ 密码不一致"))
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "btn-cancel",
              onClick: _cache[21] || (_cache[21] = ($event) => $data.showPasswordModal = false)
            }, "取消"),
            vue.createElementVNode("button", {
              class: "btn-confirm",
              onClick: _cache[22] || (_cache[22] = (...args) => $options.confirmChangePassword && $options.confirmChangePassword(...args)),
              disabled: !$options.canSubmit
            }, "确认", 8, ["disabled"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTabbarTabbar5Tabbar5 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-4fdee20d"], ["__file", "E:/656/f/DOO/DOO/pages/tabbar/tabbar-5/tabbar-5.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, " 页面 - 发图文 ");
  }
  const PagesTabbar3DetialTabbar3ReleaseTabbar3Release = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "E:/656/f/DOO/DOO/pages/tabbar-3-detial/tabbar-3-release/tabbar-3-release.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        videoUrl: "",
        title: "",
        description: "",
        tags: [],
        tagInput: "",
        showUploadModal: false,
        apiBase: "http://192.168.1.12/DOO/server/api/"
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
          sourceType: ["album"],
          maxDuration: 60,
          success: (res) => {
            this.videoUrl = res.tempFilePath;
            this.showUploadModal = false;
          }
        });
      },
      recordVideo() {
        uni.chooseVideo({
          sourceType: ["camera"],
          maxDuration: 60,
          success: (res) => {
            this.videoUrl = res.tempFilePath;
            this.showUploadModal = false;
          }
        });
      },
      removeVideo() {
        uni.showModal({
          title: "提示",
          content: "确定要删除这个视频吗？",
          success: (res) => {
            if (res.confirm) {
              this.videoUrl = "";
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
              title: "最多添加5个话题",
              icon: "none"
            });
            return;
          }
          if (!this.tags.includes(this.tagInput.trim())) {
            this.tags.push(this.tagInput.trim());
          }
          this.tagInput = "";
        }
      },
      removeTag(index) {
        this.tags.splice(index, 1);
      },
      async publishVideo() {
        if (!this.videoUrl) {
          uni.showToast({
            title: "请先上传视频",
            icon: "none"
          });
          return;
        }
        if (!this.title.trim()) {
          uni.showToast({
            title: "请输入视频标题",
            icon: "none"
          });
          return;
        }
        const userId = uni.getStorageSync("userId") || uni.getStorageSync("user_id") || 0;
        formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:188", "当前用户ID:", userId);
        formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:189", "视频标题:", this.title);
        formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:190", "视频描述:", this.description);
        uni.showLoading({
          title: "发布中..."
        });
        try {
          const uploadRes = await uni.uploadFile({
            url: this.apiBase + "upload.php",
            filePath: this.videoUrl,
            name: "file"
          });
          formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:203", "上传响应:", uploadRes);
          formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:204", "上传响应数据:", uploadRes.data);
          let data;
          try {
            data = JSON.parse(uploadRes.data);
          } catch (e) {
            formatAppLog("error", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:210", "JSON解析错误:", e);
            formatAppLog("error", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:211", "原始数据:", uploadRes.data);
            uni.hideLoading();
            uni.showToast({
              title: "上传失败，请重试",
              icon: "none"
            });
            return;
          }
          if (data.code === 200) {
            const videoData = {
              user_id: userId,
              title: this.title,
              description: this.description,
              video_url: data.data.url,
              tags: this.tags.join(",")
            };
            const res = await uni.request({
              url: this.apiBase + "publish_video.php",
              method: "POST",
              data: videoData,
              header: {
                "Content-Type": "application/json"
              }
            });
            formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:238", "发布视频响应:", res);
            formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:239", "发布响应状态码:", res.statusCode);
            formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:240", "发布响应数据:", res.data);
            uni.hideLoading();
            if (res.statusCode === 200 && res.data.code === 200) {
              formatAppLog("log", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:245", "视频发布成功");
              uni.showToast({
                title: "发布成功",
                icon: "success"
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              uni.showToast({
                title: res.data.message || "发布失败",
                icon: "none"
              });
            }
          } else {
            uni.hideLoading();
            uni.showToast({
              title: data.message || "上传失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue:269", "发布视频错误:", error);
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("text", {
            class: "nav-back",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
          }, "‹"),
          vue.createElementVNode("text", { class: "nav-title" }, "发视频"),
          vue.createElementVNode("text", {
            class: "nav-publish",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.publishVideo && $options.publishVideo(...args))
          }, "发布")
        ])
      ]),
      vue.createElementVNode("view", { class: "form-section" }, [
        vue.createElementVNode("view", {
          class: "video-upload",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.chooseVideo && $options.chooseVideo(...args))
        }, [
          !$data.videoUrl ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "upload-placeholder"
          }, [
            vue.createElementVNode("text", { class: "upload-icon" }, "📹"),
            vue.createElementVNode("text", { class: "upload-text" }, "点击上传视频")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "video-preview"
          }, [
            vue.createElementVNode("video", {
              class: "preview-video",
              src: $data.videoUrl,
              "object-fit": "contain"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", {
              class: "remove-video",
              onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.removeVideo && $options.removeVideo(...args), ["stop"]))
            }, "✕")
          ]))
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "视频标题"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.title = $event),
              placeholder: "请输入视频标题",
              maxlength: "50"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.title]
          ]),
          vue.createElementVNode(
            "text",
            { class: "count" },
            vue.toDisplayString($data.title.length) + "/50",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "视频描述"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "textarea",
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.description = $event),
              placeholder: "介绍一下你的视频...",
              maxlength: "200",
              onInput: _cache[6] || (_cache[6] = (...args) => $options.onDescriptionInput && $options.onDescriptionInput(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.description]
          ]),
          vue.createElementVNode(
            "text",
            { class: "count" },
            vue.toDisplayString($data.description.length) + "/200",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "添加话题"),
          vue.createElementVNode("view", { class: "tags-input" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.tags, (tag, index) => {
                return vue.openBlock(), vue.createElementBlock("text", {
                  class: "tag",
                  key: index,
                  onClick: ($event) => $options.removeTag(index)
                }, " #" + vue.toDisplayString(tag), 9, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "tag-input-field",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.tagInput = $event),
                placeholder: "输入话题标签",
                onConfirm: _cache[8] || (_cache[8] = (...args) => $options.addTag && $options.addTag(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.tagInput]
            ])
          ])
        ])
      ]),
      $data.showUploadModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "upload-modal",
        onClick: _cache[13] || (_cache[13] = vue.withModifiers(($event) => $data.showUploadModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[12] || (_cache[12] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "选择视频来源"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[9] || (_cache[9] = ($event) => $data.showUploadModal = false)
            }, "✕")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", {
              class: "upload-option",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.chooseFromAlbum && $options.chooseFromAlbum(...args))
            }, [
              vue.createElementVNode("text", { class: "upload-icon" }, "🖼️"),
              vue.createElementVNode("text", { class: "upload-text" }, "从相册选择")
            ]),
            vue.createElementVNode("view", {
              class: "upload-option",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.recordVideo && $options.recordVideo(...args))
            }, [
              vue.createElementVNode("text", { class: "upload-icon" }, "📷"),
              vue.createElementVNode("text", { class: "upload-text" }, "拍摄视频")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTabbar3DetialTabbar3VideoTabbar3Video = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-431653e1"], ["__file", "E:/656/f/DOO/DOO/pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {};
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, " 页面 - 提问 ");
  }
  const PagesTabbar3DetialTabbar3QaTabbar3Qa = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "E:/656/f/DOO/DOO/pages/tabbar-3-detial/tabbar-3-qa/tabbar-3-qa.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        statusBarHeight: 0,
        pageTitle: "详情",
        cardData: {
          id: 0,
          title: "",
          author: "",
          cover: "",
          description: ""
        }
      };
    },
    onLoad(options) {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight || 0;
      const eventChannel = this.$scope.eventChannel;
      if (eventChannel) {
        eventChannel.on("setCard", (data) => {
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "view",
        {
          class: "nav-bar",
          style: vue.normalizeStyle({ paddingTop: $data.statusBarHeight + "px" })
        },
        [
          vue.createElementVNode("view", {
            class: "nav-back",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
          }, [
            vue.createElementVNode("text", { class: "back-icon" }, "←")
          ]),
          vue.createElementVNode(
            "text",
            { class: "nav-title" },
            vue.toDisplayString($data.pageTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "nav-placeholder" })
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("scroll-view", {
        class: "content-area",
        "scroll-y": "true"
      }, [
        vue.createElementVNode("view", { class: "card-detail" }, [
          vue.createElementVNode("view", { class: "detail-cover" }, [
            vue.createElementVNode("image", {
              class: "cover-image",
              src: $data.cardData.cover,
              mode: "aspectFill"
            }, null, 8, ["src"])
          ]),
          vue.createElementVNode(
            "text",
            { class: "detail-title" },
            vue.toDisplayString($data.cardData.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "detail-author" }, [
            vue.createElementVNode("text", { class: "author-label" }, "作者："),
            vue.createElementVNode(
              "text",
              { class: "author-name" },
              vue.toDisplayString($data.cardData.author),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-description" }, [
            vue.createElementVNode("text", { class: "description-title" }, "内容描述"),
            vue.createElementVNode(
              "text",
              { class: "description-text" },
              vue.toDisplayString($data.cardData.description || "暂无描述"),
              1
              /* TEXT */
            )
          ])
        ])
      ])
    ]);
  }
  const PagesCardDetailCardDetail = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-ca7809bb"], ["__file", "E:/656/f/DOO/DOO/pages/card-detail/card-detail.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        videoUrl: "",
        title: "",
        author: "",
        views: "",
        poster: ""
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
        formatAppLog("error", "at pages/video-player/video-player.vue:62", "视频播放错误:", e);
        uni.showToast({
          title: "视频加载失败",
          icon: "none"
        });
      },
      onVideoPlay() {
        formatAppLog("log", "at pages/video-player/video-player.vue:69", "视频开始播放");
      },
      onVideoPause() {
        formatAppLog("log", "at pages/video-player/video-player.vue:72", "视频暂停");
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "video-container" }, [
        vue.createElementVNode("video", {
          class: "video-player",
          src: $data.videoUrl,
          poster: $data.poster,
          controls: "",
          autoplay: "",
          "show-center-play-btn": "",
          onError: _cache[0] || (_cache[0] = (...args) => $options.onVideoError && $options.onVideoError(...args)),
          onPlay: _cache[1] || (_cache[1] = (...args) => $options.onVideoPlay && $options.onVideoPlay(...args)),
          onPause: _cache[2] || (_cache[2] = (...args) => $options.onVideoPause && $options.onVideoPause(...args))
        }, null, 40, ["src", "poster"])
      ]),
      vue.createElementVNode("view", { class: "video-info" }, [
        vue.createElementVNode(
          "text",
          { class: "video-title" },
          vue.toDisplayString($data.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "video-meta" }, [
          vue.createElementVNode(
            "text",
            { class: "author" },
            vue.toDisplayString($data.author),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "views" },
            vue.toDisplayString($data.views),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", {
        class: "back-button",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.goBack && $options.goBack(...args))
      }, [
        vue.createElementVNode("text", { class: "back-icon" }, "‹"),
        vue.createElementVNode("text", { class: "back-text" }, "返回")
      ])
    ]);
  }
  const PagesVideoPlayerVideoPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-94a129d6"], ["__file", "E:/656/f/DOO/DOO/pages/video-player/video-player.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/admin/admin", PagesAdminAdmin);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("pages/edit-profile/edit-profile", PagesEditProfileEditProfile);
  __definePage("pages/tabbar/tabbar-1/tabbar-1", PagesTabbarTabbar1Tabbar1);
  __definePage("pages/tabbar/tabbar-2/tabbar-2", PagesTabbarTabbar2Tabbar2);
  __definePage("pages/tabbar/tabbar-3/tabbar-3", PagesTabbarTabbar3Tabbar3);
  __definePage("pages/tabbar/tabbar-4/tabbar-4", PagesTabbarTabbar4Tabbar4);
  __definePage("pages/tabbar/tabbar-5/tabbar-5", PagesTabbarTabbar5Tabbar5);
  __definePage("pages/tabbar-3-detial/tabbar-3-release/tabbar-3-release", PagesTabbar3DetialTabbar3ReleaseTabbar3Release);
  __definePage("pages/tabbar-3-detial/tabbar-3-video/tabbar-3-video", PagesTabbar3DetialTabbar3VideoTabbar3Video);
  __definePage("pages/tabbar-3-detial/tabbar-3-qa/tabbar-3-qa", PagesTabbar3DetialTabbar3QaTabbar3Qa);
  __definePage("pages/card-detail/card-detail", PagesCardDetailCardDetail);
  __definePage("pages/video-player/video-player", PagesVideoPlayerVideoPlayer);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
      setTimeout(() => {
        uni.setTabBarBadge({
          index: 1,
          text: "31"
        });
        uni.showTabBarRedDot({
          index: 3
        });
      }, 1e3);
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:17", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:20", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/656/f/DOO/DOO/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
