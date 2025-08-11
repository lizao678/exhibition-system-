import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Keep-alive API 被调用`);

  if (req.method !== 'GET') {
    console.log(`[${timestamp}] 方法不允许: ${req.method}`);
    return res.status(405).json({ message: '方法不允许' });
  }

  // 验证密钥
  const key = req.query.key;
  console.log(`[${timestamp}] 收到密钥: ${key ? '已提供' : '未提供'}`);
  
  if (key !== process.env.KEEP_ALIVE_KEY) {
    console.log(`[${timestamp}] 密钥验证失败`);
    return res.status(401).json({ message: '未授权' });
  }

  try {
    console.log(`[${timestamp}] 开始执行数据库保活操作`);

    // 1. 查询表单数据总数
    const formCount = await prisma.formData.count();
    console.log(`[${timestamp}] 表单数据总数: ${formCount}`);

    // 2. 查询最近的表单记录
    const recentForm = await prisma.formData.findFirst({
      orderBy: { tijiaoRiqi: 'desc' },
      select: { id: true, xingming: true, tijiaoRiqi: true },
    });
    console.log(`[${timestamp}] 最近表单记录: ${recentForm ? `ID ${recentForm.id}` : '无记录'}`);

    // 3. 查询管理员数量
    const adminCount = await prisma.admin.count();
    console.log(`[${timestamp}] 管理员数量: ${adminCount}`);

    // 4. 查询配置项数量
    const configCount = await prisma.config.count();
    console.log(`[${timestamp}] 配置项数量: ${configCount}`);

    // 5. 执行一个轻量级的聚合查询
    const stats = await prisma.formData.groupBy({
      by: ['zhanting'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
    console.log(`[${timestamp}] 展厅统计: ${stats.length} 个展厅类型`);

    res.status(200).json({
      message: '数据库保活成功',
      timestamp,
      stats: {
        formCount,
        adminCount,
        configCount,
        recentForm: recentForm ? {
          id: recentForm.id,
          submitTime: recentForm.tijiaoRiqi
        } : null,
        zhantingStats: stats
      }
    });
  } catch (error) {
    console.error(`[${timestamp}] 数据库保活失败:`, error);
    res.status(500).json({
      message: '服务器错误',
      timestamp,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
} 