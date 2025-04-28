import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
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

    const { id, shijiGuihuanRiqi } = req.body;

    // 验证 ID
    if (!id || typeof id !== 'number') {
      return res.status(400).json({ message: '无效的 ID' });
    }

    // 验证归还时间
    if (!shijiGuihuanRiqi) {
      return res.status(400).json({ message: '请选择归还时间' });
    }

    // 检查记录是否存在
    const formData = await prisma.formData.findUnique({
      where: { id },
    });

    if (!formData) {
      return res.status(404).json({ message: '记录不存在' });
    }

    // 更新记录
    const updatedFormData = await prisma.formData.update({
      where: { id },
      data: {
        shijiGuihuanRiqi: new Date(shijiGuihuanRiqi),
      },
    });

    res.status(200).json(updatedFormData);
  } catch (error) {
    console.error('更新记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 