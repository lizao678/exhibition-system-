# 展厅进出登记系统

一个基于 Next.js 和 Supabase 的展厅进出登记系统。

## 功能特点

- 展厅进出登记
- 样衣借用管理
- 管理员后台
- 邮件通知
- 响应式设计

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (数据库)
- Prisma (ORM)
- Nodemailer (邮件服务)

## 环境要求

- Node.js 18+
- npm 或 yarn
- QQ 邮箱（用于发送邮件通知）

## 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/exhibition-system.git
cd exhibition-system
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 配置环境变量
复制 `.env.example` 文件为 `.env.local`，并填写以下配置：
```env
# Supabase 配置
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT 配置
JWT_SECRET=your-jwt-secret

# 管理员配置
NEXT_PUBLIC_ADMIN_URL=/admin

# 数据库配置
DATABASE_URL=your-database-url

# 邮箱配置
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-email-authorization-code
ADMIN_EMAIL=admin@example.com
```

4. 初始化数据库
```bash
npx prisma db push
```

5. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

## 使用说明

1. 访问首页 `/` 进行展厅进出登记
2. 访问管理员后台 `/admin` 管理数据
3. 查看登记详情 `/info?id=xxx`

## 邮件通知

系统使用 QQ 邮箱发送通知邮件，需要：
1. 开启 QQ 邮箱的 SMTP 服务
2. 获取邮箱授权码
3. 在 `.env.local` 中配置邮箱信息

## 部署

1. 构建项目
```bash
npm run build
# 或
yarn build
```

2. 启动生产服务器
```bash
npm start
# 或
yarn start
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
