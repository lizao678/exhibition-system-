import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 验证管理员权限
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      verifyToken(authHeader.split(' ')[1]);
    } catch {
      return res.status(401).json({ message: '无效的认证信息' });
    }

    // 获取查询参数
    const { 
      page = '1', 
      pageSize = '10', 
      search = '',
      startDate,
      endDate
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    // 构建查询条件
    let where: any = {};

    // 添加搜索条件
    if (search) {
      where.OR = [
        { xingming: { contains: search as string } },
        { bumen: { contains: search as string } },
        { yangyiBianhao: { contains: search as string } },
      ];
    }

    // 添加日期范围条件
    if (startDate || endDate) {
      where.jinruRiqi = {};
      if (startDate) {
        where.jinruRiqi.gte = new Date(startDate as string);
      }
      if (endDate) {
        // 将结束日期设置为当天的最后一刻
        const endDateTime = new Date(endDate as string);
        endDateTime.setHours(23, 59, 59, 999);
        where.jinruRiqi.lte = endDateTime;
      }
    }

    // 获取总数
    const total = await prisma.formData.count({ where });

    // 获取数据列表
    const list = await prisma.formData.findMany({
      where,
      orderBy: { tijiaoRiqi: 'desc' },
      skip,
      take,
    });

    // 返回数据
    res.status(200).json({
      list,
      total,
      page: parseInt(page as string),
      pageSize: take,
    });
  } catch (error) {
    console.error('获取数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 