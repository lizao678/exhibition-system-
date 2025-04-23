import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form as AntdForm,
  Input,
  TextArea,
  Radio,
  Button,
  Toast,
  DatePicker,
  Space,
} from 'antd-mobile';
import { 
  UserOutline, 
  TeamOutline, 
  CalendarOutline, 
  ClockCircleOutline 
} from 'antd-mobile-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 配置 dayjs
dayjs.locale('zh-cn');

// 表单数据类型
interface FormData {
  xingming: string;
  bumen: string;
  shiyou: string;
  jieyongYangyi: boolean;
  yangyiBianhao?: string;
}

export default function Form() {
  // 表单状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jinruRiqi, setJinruRiqi] = useState<Date>(new Date());
  const [jinruVisible, setJinruVisible] = useState(false);
  const [yujiGuihuanRiqi, setYujiGuihuanRiqi] = useState<Date | null>(null);
  const [guihuanVisible, setGuihuanVisible] = useState(false);

  // 表单处理
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      jieyongYangyi: false,
    },
  });

  // 监听是否借用样衣
  const jieyongYangyi = watch('jieyongYangyi');

  // 提交处理
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // 检查必填项
      if (!data.xingming || !data.bumen || !data.shiyou) {
        Toast.show({
          icon: 'fail',
          content: '请填写所有必填字段',
        });
        setIsSubmitting(false);
        return;
      }

      // 检查样衣相关项
      if (data.jieyongYangyi && (!data.yangyiBianhao || !yujiGuihuanRiqi)) {
        Toast.show({
          icon: 'fail',
          content: '借用样衣时，样衣编号和预计归还时间不能为空',
        });
        setIsSubmitting(false);
        return;
      }

      // 发送表单数据
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          jinruRiqi,
          yujiGuihuanRiqi: data.jieyongYangyi ? yujiGuihuanRiqi : null,
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      const result = await response.json();
      
      Toast.show({
        icon: 'success',
        content: '提交成功',
      });

      // 跳转到信息页面
      setTimeout(() => {
        window.location.href = `/info?id=${result.id}`;
      }, 1500);
    } catch (error) {
      console.error('提交失败:', error);
      Toast.show({
        icon: 'fail',
        content: '提交失败，请稍后重试',
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">展厅进出登记</h1>

      <AntdForm
        layout='horizontal'
        footer={
          <Button 
            block 
            color='primary' 
            size='large' 
            loading={isSubmitting}
            onClick={() => handleSubmit(onSubmit)()}
          >
            提交
          </Button>
        }
      >
        {/* 姓名 */}
        <AntdForm.Item label='姓名' required>
          <Input 
            placeholder='请输入姓名' 
            onChange={(val) => setValue('xingming', val)}
          />
          {errors.xingming && <div className="error-text">请输入姓名</div>}
        </AntdForm.Item>

        {/* 部门 */}
        <AntdForm.Item label='部门' required>
          <Input 
            placeholder='请输入部门' 
            onChange={(val) => setValue('bumen', val)}
          />
          {errors.bumen && <div className="error-text">请输入部门</div>}
        </AntdForm.Item>

        {/* 进入日期 */}
        <AntdForm.Item label='进入日期' required>
          <Space align='center' block onClick={() => setJinruVisible(true)}>
            <CalendarOutline />
            <span style={{ color: jinruRiqi ? 'inherit' : '#ccc' }}>
              {jinruRiqi ? dayjs(jinruRiqi).format('YYYY年MM月DD日') : '请选择进入日期'}
            </span>
          </Space>
          <DatePicker
            visible={jinruVisible}
            onClose={() => setJinruVisible(false)}
            precision='day'
            defaultValue={jinruRiqi}
            onConfirm={(val) => {
              setJinruRiqi(val);
              setJinruVisible(false);
            }}
            min={new Date('2023-01-01')}
            max={new Date('2025-12-31')}
          />
        </AntdForm.Item>

        {/* 事由 */}
        <AntdForm.Item label='事由' required>
          <TextArea 
            placeholder='请输入事由' 
            rows={3}
            onChange={(val) => setValue('shiyou', val)}
          />
          {errors.shiyou && <div className="error-text">请输入事由</div>}
        </AntdForm.Item>

        {/* 是否借用样衣 */}
        <AntdForm.Item label='是否借用样衣'>
          <Radio.Group
            onChange={(val) => setValue('jieyongYangyi', val === 'true')}
            defaultValue={getValues('jieyongYangyi') ? 'true' : 'false'}
          >
            <Space>
              <Radio value='false'>否</Radio>
              <Radio value='true'>是</Radio>
            </Space>
          </Radio.Group>
        </AntdForm.Item>

        {/* 样衣相关字段 */}
        {jieyongYangyi && (
          <>
            {/* 样衣编号 */}
            <AntdForm.Item label='样衣编号' required>
              <Input 
                placeholder='请输入样衣编号' 
                onChange={(val) => setValue('yangyiBianhao', val)}
              />
              {errors.yangyiBianhao && <div className="error-text">请输入样衣编号</div>}
            </AntdForm.Item>

            {/* 预计归还时间 */}
            <AntdForm.Item label='归还时间' required>
              <Space align='center' block onClick={() => setGuihuanVisible(true)}>
                <ClockCircleOutline />
                <span style={{ color: yujiGuihuanRiqi ? 'inherit' : '#ccc' }}>
                  {yujiGuihuanRiqi 
                    ? dayjs(yujiGuihuanRiqi).format('YYYY年MM月DD日') 
                    : '请选择预计归还时间'}
                </span>
              </Space>
              <DatePicker
                visible={guihuanVisible}
                onClose={() => setGuihuanVisible(false)}
                precision='day'
                defaultValue={yujiGuihuanRiqi || new Date()}
                onConfirm={(val) => {
                  setYujiGuihuanRiqi(val);
                  setGuihuanVisible(false);
                }}
                min={new Date()}
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              />
            </AntdForm.Item>
          </>
        )}
      </AntdForm>

      {/* 底部说明 */}
      <div className="mt-8 text-xs text-gray-500 text-center px-4">
        <p>提交后，系统将自动发送邮件通知管理员</p>
        <p>© {new Date().getFullYear()} 展厅进出登记系统</p>
      </div>
    </div>
  );
} 