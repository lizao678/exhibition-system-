import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 信息数据类型
interface InfoData {
  id: number;
  xingming: string;
  bumen: string;
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
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">展厅进出信息</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">姓名</p>
            <p className="font-medium">{data.xingming}</p>
          </div>
          <div>
            <p className="text-gray-600">部门</p>
            <p className="font-medium">{data.bumen}</p>
          </div>
          <div>
            <p className="text-gray-600">进入日期</p>
            <p className="font-medium">{formatDate(data.jinruRiqi)}</p>
          </div>
          <div>
            <p className="text-gray-600">事由</p>
            <p className="font-medium">{data.shiyou}</p>
          </div>
        </div>

        {/* 样衣信息 */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">样衣信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">是否借用样衣</p>
              <p className="font-medium">{data.jieyongYangyi ? '是' : '否'}</p>
            </div>
            {data.jieyongYangyi && (
              <>
                <div>
                  <p className="text-gray-600">样衣编号</p>
                  <p className="font-medium">{data.yangyiBianhao || '未填写'}</p>
                </div>
                <div>
                  <p className="text-gray-600">预计归还时间</p>
                  <p className="font-medium">
                    {data.yujiGuihuanRiqi ? formatDate(data.yujiGuihuanRiqi) : '未填写'}
                  </p>
                </div>
                {data.shijiGuihuanRiqi && (
                  <div>
                    <p className="text-gray-600">实际归还时间</p>
                    <p className="font-medium">{formatDate(data.shijiGuihuanRiqi)}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 时间信息 */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">时间信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">提交时间</p>
              <p className="font-medium">{formatDate(data.tijiaoRiqi)}</p>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="border-t pt-6 flex justify-center">
          <a
            href="/"
            className="btn btn-secondary"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
} 