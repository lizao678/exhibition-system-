# 展厅进出管理系统

一个基于 Next.js 和 Supabase 的展厅进出管理系统，用于管理人员进出记录和样衣借还。

## 技术栈

- 前端：Next.js 13+
- UI：Ant Design Mobile
- 数据库：Supabase (PostgreSQL)
- ORM：Prisma
- 样式：Tailwind CSS
- 邮件服务：Nodemailer

## 功能特点

- 📝 表单提交：记录进出信息
- 👔 样衣管理：跟踪样衣借还状态
- 📊 数据导出：支持导出 Excel
- 🔍 智能搜索：支持多条件筛选
- 📱 移动适配：完美支持移动端
- 📧 邮件通知：自动发送确认邮件

## 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd exhibition-system
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
编辑 `.env` 文件，填入以下配置：
```env
# Supabase 数据库配置
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# 邮件配置
EMAIL_USER="your-email@qq.com"
EMAIL_PASS="your-email-password"

# JWT 密钥
JWT_SECRET="your-jwt-secret"
```

4. 初始化数据库
```bash
pnpm prisma generate
pnpm prisma db push
```

5. 创建管理员账号
```bash
node scripts/create-admin.js
```

6. 启动开发服务器
```bash
pnpm dev
```

## Vercel + Supabase 部署步骤

1. **准备工作**

- 确保你有一个 [Vercel](https://vercel.com) 账号
- 确保你有一个 [Supabase](https://supabase.com) 账号
- 确保你的项目已经推送到 GitHub

2. **Supabase 数据库配置**

- 登录 [Supabase](https://app.supabase.com)
- 点击 "New Project"
- 填写项目信息：
  - 项目名称
  - 数据库密码（请保存好）
  - 选择区域（建议选择 Southeast Asia (Singapore)）
- 点击 "Create new project"
- 等待项目创建完成
- 在项目设置中找到数据库连接信息：
  - 进入 Project Settings > Database
  - 复制 Connection string (URI format)
  - 将连接字符串中的 `[YOUR-PASSWORD]` 替换为你的数据库密码

3. **Vercel 项目部署**

- 登录 [Vercel](https://vercel.com)
- 点击 "New Project"
- 导入你的 GitHub 仓库
- 配置构建设置：
  - Framework Preset: Next.js
  - Build Command: `pnpm prisma generate && pnpm prisma db push && pnpm build`
  - Install Command: `pnpm install`
  - Output Directory: `.next`
- 配置环境变量：
  ```
  DATABASE_URL=<你的 Supabase 数据库连接字符串>
  EMAIL_USER=<你的邮箱地址>
  EMAIL_PASS=<你的邮箱密码>
  JWT_SECRET=<你的 JWT 密钥>
  ```
- 在 Project Settings > General > Build & Development Settings 中：
  - 确保 "Build Command" 已更新
  - Node.js Version: 18.x（或更高）
- 点击 "Deploy"

4. **数据库初始化**

部署完成后，你需要初始化数据库和创建管理员账号：

- 在本地修改 `.env` 文件，将 `DATABASE_URL` 更新为 Supabase 提供的连接字符串
- 运行数据库迁移：
  ```bash
  pnpm prisma db push
  ```
- 创建管理员账号：
  ```bash
  node scripts/create-admin.js
  ```

5. **验证部署**

- 访问你的 Vercel 部署地址
- 使用管理员账号登录后台
- 测试各项功能是否正常

## 注意事项

1. **环境变量**
- 确保所有必需的环境变量都已正确配置
- 邮箱配置建议使用 QQ 邮箱的 SMTP 服务

2. **Supabase 数据库**
- 免费版每月有 500MB 存储限制
- 注意连接池限制（免费版为 10）
- 建议定期备份数据
- 可以使用 Supabase Dashboard 监控数据库性能

3. **性能优化**
- 使用 Supabase 的连接池管理
- 合理使用数据库索引
- 使用 Vercel Edge Functions
- 合理使用缓存

## 常见问题

1. **部署失败**
- 检查环境变量是否正确配置
- 确认 Supabase 连接字符串格式是否正确
- 查看 Vercel 部署日志

2. **邮件发送失败**
- 确认邮箱配置是否正确
- 检查邮箱服务器是否可用
- 确认邮箱密码是否为授权码

3. **数据库连接问题**
- 确认 Supabase 项目是否在线
- 检查数据库密码是否正确
- 确认是否超出连接池限制
- 检查 IP 限制设置

## 技术支持

如有问题，请提交 Issue 或联系管理员。

## License

MIT
