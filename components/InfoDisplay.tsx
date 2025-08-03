import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  Card,
  Space,
  Divider,
  Button,
  List,
  Tag
} from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';

// 配置 dayjs
dayjs.locale('zh-cn');

// 信息数据类型
interface InfoData {
  id: number;
  xingming: string;
  bumen: string;
  zhanting: string;
  jinruRiqi: string;
  shiyou: string;
  jieyongYangyi: boolean;
  yangyiBianhao?: string;
  yujiGuihuanRiqi?: string;
  tijiaoRiqi: string;
  shijiGuihuanRiqi?: string;
}

interface InfoDisplayProps {
  data: InfoData;
}

export default function InfoDisplay({ data }: InfoDisplayProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY年MM月DD日 HH:mm');
  };

  // 处理返回首页
  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <div className="px-4 py-6">
      <h1 className="page-title">展厅进出信息</h1>

      <Card>
        <Space block direction='vertical' style={{ width: '100%' }}>
          {/* 基本信息 */}
          <List header='基本信息'>
            <List.Item extra={data.xingming}>姓名</List.Item>
            <List.Item extra={data.bumen}>部门</List.Item>
            <List.Item extra={data.zhanting}>展厅</List.Item>
            <List.Item extra={formatDate(data.jinruRiqi)}>进入日期</List.Item>
            <List.Item extra={data.shiyou}>事由</List.Item>
          </List>

          {/* 样衣信息 */}
          <List header='样衣信息'>
            <List.Item extra={data.jieyongYangyi ? 
              <Tag color='primary'>是</Tag> : 
              <Tag color='default'>否</Tag>
            }>
              是否借用样衣
            </List.Item>
            
            {data.jieyongYangyi && (
              <>
                <List.Item extra={data.yangyiBianhao || '未填写'}>
                  样衣编号
                </List.Item>
                <List.Item extra={data.yujiGuihuanRiqi ? formatDate(data.yujiGuihuanRiqi) : '未填写'}>
                  预计归还时间
                </List.Item>
                {data.shijiGuihuanRiqi && (
                  <List.Item extra={formatDate(data.shijiGuihuanRiqi)}>
                    实际归还时间
                  </List.Item>
                )}
              </>
            )}
          </List>

          {/* 时间信息 */}
          <List header='时间信息'>
            <List.Item extra={formatDate(data.tijiaoRiqi)}>
              提交时间
            </List.Item>
          </List>
          

          {/* 返回按钮 */}
          <div className="flex justify-center mt-4">
            <Button 
              color='primary' 
              onClick={handleReturn}
              size='middle'
              block
            >
              <Space>
                <LeftOutline />
                <span>返回首页</span>
              </Space>
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
} 