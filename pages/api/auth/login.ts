import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { generateToken } from '../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { yonghuming, mima } = req.body;

    // 验证输入
    if (!yonghuming || !mima) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { yonghuming },
    });

    if (!admin) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValid = await bcrypt.compare(mima, admin.mima);
    if (!isValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = generateToken({ id: admin.id, yonghuming: admin.yonghuming });

    // 返回 token
    res.status(200).json({ token });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 