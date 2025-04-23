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
    const id = req.query.id;

    // 验证 ID
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: '无效的 ID' });
    }

    const formId = parseInt(id);
    
    if (isNaN(formId)) {
      return res.status(400).json({ message: '无效的 ID 格式' });
    }

    // 获取表单数据
    const formData = await prisma.formData.findUnique({
      where: { id: formId },
    });

    if (!formData) {
      return res.status(404).json({ message: '记录不存在' });
    }

    res.status(200).json(formData);
  } catch (error) {
    console.error('获取数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 