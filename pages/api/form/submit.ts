import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { sendFormEmail } from '../../../lib/nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const {
      xingming,
      bumen,
      jinruRiqi,
      shiyou,
      jieyongYangyi,
      yangyiBianhao,
      yujiGuihuanRiqi,
    } = req.body;

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

    // 保存表单数据
    const formData = await prisma.formData.create({
      data: {
        xingming,
        bumen,
        jinruRiqi: new Date(jinruRiqi),
        shiyou,
        jieyongYangyi,
        yangyiBianhao: jieyongYangyi ? yangyiBianhao : null,
        yujiGuihuanRiqi: jieyongYangyi ? new Date(yujiGuihuanRiqi) : null,
      },
    });

    // 获取抄送邮箱
    let cc: string[] = [];
    try {
      const config = await prisma.config.findUnique({ where: { key: 'ccmail' } });
      if (config && config.value) {
        cc = JSON.parse(config.value);
      }
    } catch {}

    // 发送邮件通知
    try {
      await sendFormEmail(formData, cc);
    } catch (error) {
      console.error('发送邮件失败:', error);
      // 邮件发送失败不影响表单提交
    }

    // 返回表单 ID
    res.status(200).json({ id: formData.id });
  } catch (error) {
    console.error('提交表单失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 