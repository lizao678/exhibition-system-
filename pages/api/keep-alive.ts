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
    console.log(`[${timestamp}] 开始执行数据库查询`);
    // 执行一个简单的查询来保持数据库连接活跃
    const result = await prisma.formData.findFirst({
      select: { id: true },
    });
    console.log(`[${timestamp}] 数据库查询成功: ${result ? '找到记录' : '未找到记录'}`);

    res.status(200).json({ 
      message: '数据库连接正常',
      timestamp,
      result: result ? '找到记录' : '未找到记录'
    });
  } catch (error) {
    console.error(`[${timestamp}] 保持数据库活跃失败:`, error);
    res.status(500).json({ 
      message: '服务器错误',
      timestamp,
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
} 