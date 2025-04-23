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

    const {
      id,
      xingming,
      bumen,
      jinruRiqi,
      shiyou,
      jieyongYangyi,
      yangyiBianhao,
      yujiGuihuanRiqi,
      shijiGuihuanRiqi,
    } = req.body;

    // 验证 ID
    if (!id || typeof id !== 'number') {
      return res.status(400).json({ message: '无效的 ID' });
    }

    // 验证必填字段
    if (!xingming || !bumen || !jinruRiqi || !shiyou) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 验证样衣相关字段
    if (jieyongYangyi) {
      if (!yangyiBianhao || !yujiGuihuanRiqi) {
        return res.status(400).json({
          message: '借用样衣时，样衣编号和预计归还时间不能为空',
        });
      }
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
        xingming,
        bumen,
        jinruRiqi: new Date(jinruRiqi),
        shiyou,
        jieyongYangyi,
        yangyiBianhao: jieyongYangyi ? yangyiBianhao : null,
        yujiGuihuanRiqi: jieyongYangyi ? new Date(yujiGuihuanRiqi) : null,
        shijiGuihuanRiqi: shijiGuihuanRiqi ? new Date(shijiGuihuanRiqi) : null,
      },
    });

    res.status(200).json(updatedFormData);
  } catch (error) {
    console.error('更新记录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 