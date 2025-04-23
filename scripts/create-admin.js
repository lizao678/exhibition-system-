// 创建默认管理员账户
require('dotenv').config({ path: '.env' });  // 加载环境变量
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // 默认管理员账户信息
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // 默认密码，建议创建后立即修改

    // 检查账户是否已存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { yonghuming: adminUsername },
    });

    if (existingAdmin) {
      console.log('管理员账户已存在。');
      return;
    }

    // 对密码进行加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 创建管理员账户
    const admin = await prisma.admin.create({
      data: {
        yonghuming: adminUsername,
        mima: hashedPassword,
      },
    });

    console.log('管理员账户创建成功!');
    console.log('用户名:', adminUsername);
    console.log('密码:', adminPassword);
    console.log('请记住这些信息，并在登录后修改密码。');
  } catch (error) {
    console.error('创建管理员账户时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 