import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Modal from './Modal';
import { useRouter } from 'next/router';

// 数据类型
interface TableData {
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

// 筛选条件类型
interface FilterConditions {
  search: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
    key: string;
  }[];
}

export default function AdminTable() {
  const router = useRouter();
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterConditions>({
    search: '',
    dateRange: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ],
  });

  // 删除确认弹窗状态
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: 0,
  });

  // 归还确认弹窗状态
  const [returnModal, setReturnModal] = useState({
    isOpen: false,
    id: 0,
  });

  // 加载数据
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // 获取 token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      // 构建查询参数
      const params = new URLSearchParams();
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.dateRange[0].startDate) {
        params.append('startDate', filters.dateRange[0].startDate.toISOString());
      }
      if (filters.dateRange[0].endDate) {
        params.append('endDate', filters.dateRange[0].endDate.toISOString());
      }

      // 发送请求
      const response = await fetch(`/api/admin/data?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取数据失败');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError('加载数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除数据
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/admin/data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 重新加载数据
      loadData();
    } catch (error) {
      setError('删除失败，请稍后重试');
    }
  };

  // 归还样衣
  const handleReturn = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      const response = await fetch('/api/admin/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          shijiGuihuanRiqi: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      // 重新加载数据
      loadData();
    } catch (error) {
      setError('更新失败，请稍后重试');
    }
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin');
        return;
      }

      // 构建查询参数
      const params = new URLSearchParams();
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.dateRange[0].startDate) {
        params.append('startDate', filters.dateRange[0].startDate.toISOString());
      }
      if (filters.dateRange[0].endDate) {
        params.append('endDate', filters.dateRange[0].endDate.toISOString());
      }

      // 发送请求
      const response = await fetch(`/api/admin/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('导出失败');
      }

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `展厅进出记录_${format(new Date(), 'yyyyMMdd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('导出失败，请稍后重试');
    }
  };

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索和筛选 */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索姓名/部门/样衣编号"
            className="input flex-1"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
          <DateRange
            onChange={(item) =>
              setFilters({
                ...filters,
                dateRange: [item.selection],
              })
            }
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={filters.dateRange}
            direction="horizontal"
            locale={zhCN}
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && <p className="error text-center mb-4">{error}</p>}

      {/* 数据表格 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                部门
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                进入日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                事由
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                样衣信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                提交时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  加载中...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.xingming}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.bumen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.jinruRiqi)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.shiyou}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.jieyongYangyi ? (
                      <>
                        <div>编号：{item.yangyiBianhao}</div>
                        <div>
                          预计归还：
                          {item.yujiGuihuanRiqi
                            ? formatDate(item.yujiGuihuanRiqi)
                            : '未设置'}
                        </div>
                        {item.shijiGuihuanRiqi && (
                          <div>
                            实际归还：
                            {formatDate(item.shijiGuihuanRiqi)}
                          </div>
                        )}
                      </>
                    ) : (
                      '未借用'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.tijiaoRiqi)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() =>
                          setDeleteModal({ isOpen: true, id: item.id })
                        }
                      >
                        删除
                      </button>
                      {item.jieyongYangyi && !item.shijiGuihuanRiqi && (
                        <button
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() =>
                            setReturnModal({ isOpen: true, id: item.id })
                          }
                        >
                          归还
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 导出按钮 */}
      <div className="fixed bottom-8 right-8">
        <button
          className="btn btn-primary"
          onClick={handleExport}
          disabled={isLoading}
        >
          导出为 Excel
        </button>
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: 0 })}
        title="确认删除"
        confirmText="删除"
        onConfirm={() => handleDelete(deleteModal.id)}
        isDestructive
      >
        确定要删除这条记录吗？此操作不可恢复。
      </Modal>

      {/* 归还确认弹窗 */}
      <Modal
        isOpen={returnModal.isOpen}
        onClose={() => setReturnModal({ isOpen: false, id: 0 })}
        title="确认归还"
        confirmText="确认"
        onConfirm={() => handleReturn(returnModal.id)}
      >
        确定要将这件样衣标记为已归还吗？
      </Modal>
    </div>
  );
} 