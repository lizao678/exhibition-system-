import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { 
  List, 
  SwipeAction, 
  Dialog, 
  Toast, 
  Button, 
  SearchBar, 
  Card,
  InfiniteScroll,
  Space,
  Tag,
  Empty,
  DatePicker,
  Grid
} from 'antd-mobile';
import { CalendarOutline } from 'antd-mobile-icons';

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

// 分页数据类型
interface PaginatedData {
  list: TableData[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminTable() {
  const router = useRouter();
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const pageRef = useRef(1);
  const PAGE_SIZE = 10;

  // 加载数据
  const loadData = useCallback(async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 构建查询参数
      const params = new URLSearchParams({
        page: pageRef.current.toString(),
        pageSize: PAGE_SIZE.toString(),
      });
      
      if (searchText) {
        params.append('search', searchText);
      }

      // 添加日期范围参数
      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate.toISOString());
      }
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate.toISOString());
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

      const result: PaginatedData = await response.json();
      
      if (isLoadMore) {
        setData(prev => [...prev, ...result.list]);
      } else {
        setData(result.list);
      }
      
      setHasMore(result.list.length === PAGE_SIZE);
      
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '加载数据失败',
      });
      setError('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  }, [searchText, dateRange, router]);

  // 删除数据
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const result = await Dialog.confirm({
        content: '确定要删除这条记录吗？',
      });

      if (!result) return;

      const response = await fetch('/api/form/delete', {
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

      Toast.show({
        icon: 'success',
        content: '删除成功',
      });

      // 重置数据
      pageRef.current = 1;
      await loadData();
      
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '删除失败',
      });
    }
  };

  // 归还样衣
  const handleReturn = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 显示日期选择器
      const result = await DatePicker.prompt({
        title: '选择归还日期',
        defaultValue: new Date(),
        precision: 'day',
        onConfirm: async (date) => {
          try {
            Toast.show({
              icon: 'loading',
              content: '正在处理...',
              duration: 0,
            });

            const response = await fetch('/api/form/update', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id,
                shijiGuihuanRiqi: date.toISOString(),
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || '更新失败');
            }

            Toast.clear();
            Toast.show({
              icon: 'success',
              content: '归还成功',
            });

            // 重置数据
            pageRef.current = 1;
            await loadData();
          } catch (error) {
            Toast.clear();
            Toast.show({
              icon: 'fail',
              content: error instanceof Error ? error.message : '归还失败',
            });
          }
        },
      });

      if (!result) return;
      
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: error instanceof Error ? error.message : '归还失败',
      });
    }
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 构建查询参数
      const params = new URLSearchParams();
      if (searchText) {
        params.append('search', searchText);
      }
      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate.toISOString());
      }
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate.toISOString());
      }

      Toast.show({
        icon: 'loading',
        content: '正在导出...',
        duration: 0,
      });

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

      Toast.clear();
      Toast.show({
        icon: 'success',
        content: '导出成功',
      });
    } catch (error) {
      Toast.clear();
      Toast.show({
        icon: 'fail',
        content: '导出失败',
      });
    }
  };

  // 清除日期筛选
  const handleClearDateFilter = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    pageRef.current = 1;
    loadData();
  };

  // 搜索和日期筛选防抖
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        pageRef.current = 1;
        loadData();
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchText, dateRange, loadData]);

  // 加载更多
  const loadMore = async () => {
    if (isLoading) return;
    pageRef.current += 1;
    await loadData(true);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
  };

  return (
    <div className="pb-safe">
      {/* 搜索栏和筛选区域 */}
      <div className="sticky top-0 z-10 bg-white">
        <SearchBar
          placeholder="搜索姓名/部门/样衣编号"
          value={searchText}
          onChange={setSearchText}
          style={{ '--background': '#f5f5f5' }}
        />
        
        {/* 时间筛选 */}
        <div className="px-2 py-3">
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <div
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                onClick={() => setShowStartPicker(true)}
              >
                <div className="text-sm text-gray-600">
                  {dateRange.startDate
                    ? format(dateRange.startDate, 'yyyy-MM-dd')
                    : '开始日期'}
                </div>
                <CalendarOutline />
              </div>
            </Grid.Item>
            <Grid.Item>
              <div
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                onClick={() => setShowEndPicker(true)}
              >
                <div className="text-sm text-gray-600">
                  {dateRange.endDate
                    ? format(dateRange.endDate, 'yyyy-MM-dd')
                    : '结束日期'}
                </div>
                <CalendarOutline />
              </div>
            </Grid.Item>
          </Grid>
          
          {(dateRange.startDate || dateRange.endDate) && (
            <Button
              block
              fill="none"
              className="mt-2"
              onClick={handleClearDateFilter}
            >
              清除日期筛选
            </Button>
          )}
          
          <Button 
            block 
            color="primary" 
            className="mt-2"
            onClick={handleExport}
          >
            导出数据
          </Button>
        </div>
      </div>

      {/* 日期选择器 */}
      <DatePicker
        visible={showStartPicker}
        onClose={() => setShowStartPicker(false)}
        precision="day"
        onConfirm={(val) => {
          setDateRange(prev => ({
            ...prev,
            startDate: val,
          }));
        }}
        max={dateRange.endDate || undefined}
      />
      <DatePicker
        visible={showEndPicker}
        onClose={() => setShowEndPicker(false)}
        precision="day"
        onConfirm={(val) => {
          setDateRange(prev => ({
            ...prev,
            endDate: val,
          }));
        }}
        min={dateRange.startDate || undefined}
      />

      {/* 数据列表 */}
      {data.length > 0 ? (
        <List>
          {data.map((item) => (
            <SwipeAction
              key={item.id}
              rightActions={[
                {
                  key: 'delete',
                  text: '删除',
                  color: 'danger',
                  onClick: () => handleDelete(item.id),
                },
                ...(item.jieyongYangyi && !item.shijiGuihuanRiqi
                  ? [
                      {
                        key: 'return',
                        text: '归还',
                        color: 'primary',
                        onClick: () => handleReturn(item.id),
                      },
                    ]
                  : []),
              ]}
            >
              <List.Item>
                <Card>
                  <Space direction="vertical" block>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">{item.xingming}</span>
                      <span className="text-gray-500">{item.bumen}</span>
                    </div>
                    <div>
                      进入时间：{formatDate(item.jinruRiqi)}
                    </div>
                    <div>事由：{item.shiyou}</div>
                    {item.jieyongYangyi && (
                      <>
                        <div>样衣编号：{item.yangyiBianhao}</div>
                        <div>
                          预计归还：
                          {item.yujiGuihuanRiqi
                            ? formatDate(item.yujiGuihuanRiqi)
                            : '未设置'}
                        </div>
                        <div>
                          实际归还：
                          {item.shijiGuihuanRiqi ? (
                            <Tag color="success">
                              {formatDate(item.shijiGuihuanRiqi)}
                            </Tag>
                          ) : (
                            <Tag color="warning">未归还</Tag>
                          )}
                        </div>
                      </>
                    )}
                    <div className="text-gray-400 text-sm">
                      提交时间：{formatDate(item.tijiaoRiqi)}
                    </div>
                  </Space>
                </Card>
              </List.Item>
            </SwipeAction>
          ))}
        </List>
      ) : (
        !isLoading && <Empty description="暂无数据" />
      )}

      {/* 无限滚动 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
} 