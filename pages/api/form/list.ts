import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { page = '1', pageSize = '10', search = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    // 构建查询条件
    const where = search
      ? {
          OR: [
            { xingming: { contains: search as string } },
            { bumen: { contains: search as string } },
            { zhanting: { contains: search as string } },
            { shiyou: { contains: search as string } },
          ],
        }
      : {};

    // 获取总数
    const total = await prisma.formData.count({ where });

    // 获取列表数据
    const list = await prisma.formData.findMany({
      where,
      orderBy: { tijiaoRiqi: 'desc' },
      skip,
      take: parseInt(pageSize as string),
    });

    res.status(200).json({
      list,
      total,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    });
  } catch (error) {
    console.error('获取列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 