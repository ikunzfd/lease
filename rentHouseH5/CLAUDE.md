# rentHouseH5 — 移动端租房平台 H5 前端

## 项目概述

在线租房平台的移动端 H5 前端（租户端），为用户提供找房、预约看房、租约管理等功能。

## 关联项目

| 目录 | 说明 | 端口 |
|------|------|------|
| `d:\lease\lease` | Spring Boot 后端 | 8081 (web-app 模块) |
| `d:\lease\rentHouseAdmin` | 管理员端前端 (Vue 3 + Element Plus) | 不涉及 |

## 技术栈

- **框架**: Vue 3.3+ (Composition API + `<script setup lang="ts">`)
- **语言**: TypeScript 4.9+
- **构建**: Vite 4
- **移动端 UI**: Vant 4
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由**: Vue Router 4 (hash history)
- **HTTP**: Axios
- **CSS**: Less + Tailwind CSS + postcss-px-to-viewport (375px 基准)
- **包管理**: npm

## 目录结构

```
src/
  main.ts                    # 入口：注册 Vant, Pinia, Router, 全局组件/指令
  App.vue                    # 根组件
  config/                    # 全局配置常量
  enums/                     # 枚举定义（HTTP状态码、租约/预约状态等）
  router/
    index.ts                 # 路由实例 + beforeEach 守卫
    routes.ts                # 路由定义（Tab 路由 + 详情页路由）
  store/
    index.ts                 # Pinia 实例（含 persistedstate 插件）
    modules/user.ts          # 用户认证状态（token, userInfo, persist: true）
  api/
    types.ts                 # 通用类型（分页、响应包装）
    user/                    # 登录/用户相关 API
    room/                    # 房间 API
    apartment/               # 公寓 API
    appointment/             # 预约 API
    agreement/               # 租约 API
    history/                 # 浏览历史 API
    region/                  # 省市区级联 API
    payment/                 # 支付方式 API
    term/                    # 租期 API
  utils/
    http/index.ts            # Axios 封装（token 注入、错误处理）
    cache.ts                 # localStorage 工具
    reset.ts                 # 清空 store 工具
  components/                # 公共组件
    Tabbar/                  # 底部导航（找房/圈子/我的房间/消息/个人中心）
    NavBar/                  # 顶部导航栏
    RoomCard/                # 房间卡片
    ApartmentCard/           # 公寓卡片
    EmptyState/              # 空状态
    PageLoading/             # 骨架屏
    SvgIcon/                 # SVG 图标
  views/                     # 页面
    search/                  # 找房（Tab 1）
    group/                   # 圈子（Tab 2，静态内容）
    myRoom/                  # 我的房间（Tab 3）
    message/                 # 消息（Tab 4，占位）
    userCenter/              # 个人中心（Tab 5）
    roomDetail/              # 房间详情
    apartmentDetail/         # 公寓详情
    appointment/             # 预约看房表单
    myAppointment/           # 我的预约列表
    myAgreement/             # 我的租约列表
    agreement/               # 租约详情
    browsingHistory/         # 浏览历史
    login/                   # 短信登录
  styles/                    # 全局样式（Less）
  assets/                    # 静态资源
```

## 后端 API（端口 8081，前缀 `/app/`）

### 认证（无需 token）
- `GET /app/login/getCode?phone=` — 发送短信验证码
- `POST /app/login` — 手机号+验证码登录，返回 JWT token
- `GET /app/info` — 获取用户信息 `{nickname, avatarUrl}`

### 房间
- `GET /app/room/pageItem?current=&size=&...` — 分页搜索（支持省市区/租金范围/支付方式/排序）
- `GET /app/room/getDetailById?id=` — 房间详情（含图片、属性、配套、标签、费用、租期、支付方式）
- `GET /app/room/pageItemByApartmentId?current=&size=&id=` — 按公寓查房间

### 公寓
- `GET /app/apartment/getDetailById?id=` — 公寓详情（含图片、标签、配套、最低租金）

### 预约看房
- `POST /app/appointment/saveOrUpdate` — 提交/修改预约
- `GET /app/appointment/listItem` — 我的预约列表
- `GET /app/appointment/getDetailById?id=` — 预约详情

### 租约
- `GET /app/agreement/listItem` — 我的租约列表
- `GET /app/agreement/getDetailById?id=` — 租约详情
- `POST /app/agreement/updateStatusById?id=&leaseStatus=` — 更新租约状态
- `POST /app/agreement/saveOrUpdate` — 保存/修改租约

### 其他
- `GET /app/history/pageItem?current=&size=` — 浏览历史
- `GET /app/region/province/list` / `city/listByProvinceId?id=` / `district/listByCityId?id=` — 省市区
- `GET /app/payment/list` / `listByRoomId?roomId=` — 支付方式
- `GET /app/term/listByRoomId?roomId=` — 可选租期

### 认证方式
- Token 通过 `access-token` 请求头传递
- `/app/login/**` 路径无需认证
- 响应格式: `{ code: 200, data: T, message: string }`
- Token 过期码: `[305, 601, 602]`

### 枚举值
- **LeaseStatus**: 1=签约待确认, 2=已签约, 3=已取消, 4=已到期, 5=退租待确认, 6=已退租, 7=续约待确认
- **AppointmentStatus**: 1=待看房, 2=已取消, 3=已看房

## 编码规范

1. 所有组件使用 `<script setup lang="ts">` + Composition API
2. API 调用强类型化，每个 domain 有独立的 types.ts
3. 复用 `d:\lease\rentHouseAdmin` 的 HTTP 封装模式（拦截器、token 注入、错误处理）
4. 使用 `@/` 作为 `src/` 的路径别名
5. **不要修改** `d:\lease\lease`（后端）和 `d:\lease\rentHouseAdmin`（管理端）的任何代码
6. Pinia userStore 使用 persist: true 自动持久化到 localStorage
7. 样式开发直接用 px，postcss-px-to-viewport 自动转 vw（375px 基准）

## 开发命令

```bash
cd d:\lease\rentHouseH5
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建
```

## 参考资源
- Vant 4 文档: https://vant-ui.github.io/vant/
- 管理端代码: `d:\lease\rentHouseAdmin\src\`
- 后端 API 文档: `http://localhost:8081/doc.html`（Knife4j Swagger）
