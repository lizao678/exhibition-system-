import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
      search = '',
      startDate,
      endDate
    } = req.query;

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

    // 获取所有数据
    const data = await prisma.formData.findMany({
      where,
      orderBy: { tijiaoRiqi: 'desc' },
    });
    if(data.length === 0) {
      return res.status(404).json({ message: '暂无数据' });
    }
    // 格式化数据
    const formattedData = data.map(item => ({
      '姓名': item.xingming,
      '部门': item.bumen,
      '进入时间': format(new Date(item.jinruRiqi), 'yyyy-MM-dd HH:mm', { locale: zhCN }),
      '事由': item.shiyou,
      '是否借用样衣': item.jieyongYangyi ? '是' : '否',
      '样衣编号': item.yangyiBianhao || '',
      '预计归还时间': item.yujiGuihuanRiqi 
        ? format(new Date(item.yujiGuihuanRiqi), 'yyyy-MM-dd HH:mm', { locale: zhCN })
        : '',
      '实际归还时间': item.shijiGuihuanRiqi
        ? format(new Date(item.shijiGuihuanRiqi), 'yyyy-MM-dd HH:mm', { locale: zhCN })
        : '',
      '提交时间': format(new Date(item.tijiaoRiqi), 'yyyy-MM-dd HH:mm', { locale: zhCN }),
    }));

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // 设置列宽
    const colWidths = [
      { wch: 10 },  // 姓名
      { wch: 15 },  // 部门
      { wch: 20 },  // 进入时间
      { wch: 30 },  // 事由
      { wch: 12 },  // 是否借用样衣
      { wch: 15 },  // 样衣编号
      { wch: 20 },  // 预计归还时间
      { wch: 20 },  // 实际归还时间
      { wch: 20 },  // 提交时间
    ];
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '展厅进出记录');

    // 生成 Excel 文件的 buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 生成文件名
    const fileName = `exhibition-records-${format(new Date(), 'yyyyMMdd')}.xlsx`;
    
    // 设置响应头
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );

    // 发送文件
    res.send(buf);

  } catch (error) {
    console.error('导出失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
} 