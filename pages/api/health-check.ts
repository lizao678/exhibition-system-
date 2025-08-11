import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Health check API 被调用`);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 模拟真实用户的健康检查请求
    const startTime = Date.now();
    
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;
    
    // 检查各个表的状态
    const [formCount, adminCount, configCount] = await Promise.all([
      prisma.formData.count(),
      prisma.admin.count(),
      prisma.config.count(),
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`[${timestamp}] 健康检查完成，响应时间: ${responseTime}ms`);

    res.status(200).json({
      status: 'healthy',
      timestamp,
      responseTime: `${responseTime}ms`,
      database: {
        connected: true,
        tables: {
          formData: formCount,
          admin: adminCount,
          config: configCount,
        }
      },
      version: '1.0.0'
    });
  } catch (error) {
    console.error(`[${timestamp}] 健康检查失败:`, error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
}
