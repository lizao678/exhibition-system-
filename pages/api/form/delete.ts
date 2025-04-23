import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
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

    const { id } = req.body;

    // 验证 ID
    if (!id || typeof id !== 'number') {
      return res.status(400).json({ message: '无效的 ID' });
    }

    // 检查记录是否存在
    const formData = await prisma.formData.findUnique({
      where: { id },
    });

    if (!formData) {
      return res.status(404).json({ message: '记录不存在' });
    }

    // 删除记录
    await prisma.formData.delete({
      where: { id },
    });

    res.status(200).json({ message: '删除成功' });
  } catch (error) {
    console.error('删除记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 