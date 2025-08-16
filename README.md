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
  - Build Command: `pnpm run vercel-build`
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

4. **数据库初始化（重要：在部署前执行）**

在部署到 Vercel 之前，你需要在本地完成数据库初始化：

1. 确保你的本地 `.env` 文件中包含正确的 Supabase 连接字符串
2. 运行数据库迁移：
   ```bash
   # 确保你的 IP 已添加到 Supabase 的允许列表中
   pnpm prisma db push
   ```
3. 创建管理员账号：
   ```bash
   node scripts/create-admin.js
   ```

注意：如果遇到数据库连接问题，请检查：
- Supabase 项目的 Database Settings 中的 Connection Pooling 设置
- 确保你的 IP 地址已添加到 Supabase 的允许列表中
- 检查数据库连接字符串格式是否正确

5. **验证部署**

- 访问你的 Vercel 部署地址
- 使用管理员账号登录后台
- 测试各项功能是否正常

## 注意事项

1. **环境变量**
- 确保所有必需的环境变量都已正确配置
- 邮箱配置建议使用 QQ 邮箱的 SMTP 服务

2. **Supabase 数据库连接**
- 在 Supabase Dashboard 中配置 Connection Pooling：
  - 进入 Project Settings > Database
  - 找到 Connection Pooling 设置
  - 建议设置 Pool Mode 为 `transaction`
  - 设置 Pool Size 为 5（免费版建议值）
- 在 Database Settings 中添加你的 IP 地址到允许列表
- 使用正确的连接字符串格式：
  ```
  postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
  ```
- 如果使用 Connection Pooling，连接字符串应该是：
  ```
  postgres://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].pooler.supabase.com:6543/postgres
  ```

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

## 数据库活跃
系统采用多重保活策略，确保Supabase项目保持活跃状态：

### 自动保活任务
- **频率**: 每12小时执行一次，每天上午8:30额外执行
- **操作内容**:
  - 访问主页面（模拟用户访问）
  - 执行健康检查API
  - 执行数据库保活操作（多表查询、统计分析）
  - 访问管理页面和信息页面
  - 更新仓库时间戳

### 数据库操作
- 查询表单数据总数和最新记录
- 统计展厅使用情况
- 检查管理员和配置数据
- 执行聚合查询保持连接活跃

最新更新时间：2025-08-16 08:42