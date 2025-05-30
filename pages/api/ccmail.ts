import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取抄送邮箱
    const config = await prisma.config.findUnique({ where: { key: 'ccmail' } });
    let emails: string[] = [];
    if (config && config.value) {
      try {
        emails = JSON.parse(config.value);
      } catch {
        emails = [];
      }
    }
    res.status(200).json({ emails });
  } else if (req.method === 'POST') {
    // 保存抄送邮箱
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length > 3) {
      return res.status(400).json({ message: '邮箱格式错误或数量超限' });
    }
    await prisma.config.upsert({
      where: { key: 'ccmail' },
      update: { value: JSON.stringify(emails) },
      create: { key: 'ccmail', value: JSON.stringify(emails) },
    });
    res.status(200).json({ message: '保存成功' });
  } else {
    res.status(405).json({ message: '方法不允许' });
  }
} 