import nodemailer from 'nodemailer';
import { FormData } from '@prisma/client';

// 验证环境变量
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('缺少邮箱配置环境变量');
}

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qiye.aliyun.com', // 使用 阿里 邮箱的 SMTP 服务器
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 邮箱授权码
  },
});

// 发送表单提交邮件
export async function sendFormEmail(formData: FormData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: '展厅进出登记通知',
    html: `
      <h2>展厅进出登记通知</h2>
      <p>姓名：${formData.xingming}</p>
      <p>部门：${formData.bumen}</p>
      <p>进入日期：${formData.jinruRiqi.toLocaleString()}</p>
      <p>事由：${formData.shiyou}</p>
      ${formData.jieyongYangyi ? `
        <p>借用样衣：是</p>
        <p>样衣编号：${formData.yangyiBianhao}</p>
        <p>预计归还时间：${formData.yujiGuihuanRiqi?.toLocaleString()}</p>
      ` : '<p>借用样衣：否</p>'}
      <p>提交时间：${formData.tijiaoRiqi.toLocaleString()}</p>
      ${formData.shijiGuihuanRiqi ? `<p>实际归还时间：${formData.shijiGuihuanRiqi.toLocaleString()}</p>` : ''}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送邮件失败:', error);
    throw new Error('发送邮件失败');
  }
} 