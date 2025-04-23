import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 表单数据类型
interface FormData {
  xingming: string;
  bumen: string;
  jinruRiqi: Date;
  shiyou: string;
  jieyongYangyi: boolean;
  yangyiBianhao?: string;
  yujiGuihuanRiqi?: Date;
}

export default function Form() {
  // 表单状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 日期范围状态
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  // 表单处理
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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
      setSubmitError('');

      // 发送表单数据
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          jinruRiqi: dateRange[0].startDate,
          yujiGuihuanRiqi: data.jieyongYangyi ? dateRange[0].endDate : null,
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      const result = await response.json();
      setSubmitSuccess(true);

      // 跳转到信息页面
      window.location.href = `/info?id=${result.id}`;
    } catch (error) {
      setSubmitError('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">展厅进出登记</h1>

      {/* 姓名 */}
      <div>
        <label htmlFor="xingming" className="label">
          姓名
        </label>
        <input
          id="xingming"
          type="text"
          className="input"
          {...register('xingming', { required: '请输入姓名' })}
        />
        {errors.xingming && <p className="error">{errors.xingming.message}</p>}
      </div>

      {/* 部门 */}
      <div>
        <label htmlFor="bumen" className="label">
          部门
        </label>
        <input
          id="bumen"
          type="text"
          className="input"
          {...register('bumen', { required: '请输入部门' })}
        />
        {errors.bumen && <p className="error">{errors.bumen.message}</p>}
      </div>

      {/* 进入日期 */}
      <div>
        <label className="label">进入日期</label>
        <DateRange
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={dateRange}
          direction="horizontal"
          locale={zhCN}
        />
      </div>

      {/* 事由 */}
      <div>
        <label htmlFor="shiyou" className="label">
          事由
        </label>
        <textarea
          id="shiyou"
          className="input"
          rows={3}
          {...register('shiyou', { required: '请输入事由' })}
        />
        {errors.shiyou && <p className="error">{errors.shiyou.message}</p>}
      </div>

      {/* 是否借用样衣 */}
      <div>
        <label className="label">是否借用样衣</label>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              value="false"
              {...register('jieyongYangyi')}
            />
            <span className="ml-2">否</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              value="true"
              {...register('jieyongYangyi')}
            />
            <span className="ml-2">是</span>
          </label>
        </div>
      </div>

      {/* 样衣相关字段 */}
      {jieyongYangyi && (
        <>
          {/* 样衣编号 */}
          <div>
            <label htmlFor="yangyiBianhao" className="label">
              样衣编号
            </label>
            <input
              id="yangyiBianhao"
              type="text"
              className="input"
              {...register('yangyiBianhao')}
            />
          </div>

          {/* 预计归还时间 */}
          <div>
            <label className="label">预计归还时间</label>
            <DateRange
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={dateRange}
              direction="horizontal"
              locale={zhCN}
            />
          </div>
        </>
      )}

      {/* 提交按钮 */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '提交'}
        </button>
      </div>

      {/* 错误提示 */}
      {submitError && <p className="error text-center">{submitError}</p>}

      {/* 成功提示 */}
      {submitSuccess && (
        <p className="text-green-600 text-center">提交成功，正在跳转...</p>
      )}
    </form>
  );
} 