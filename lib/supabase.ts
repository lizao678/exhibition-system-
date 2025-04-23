import { createClient } from '@supabase/supabase-js';

// 检查环境变量是否存在
if (!process.env.SUPABASE_URL) {
  throw new Error('缺少 SUPABASE_URL 环境变量');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('缺少 SUPABASE_ANON_KEY 环境变量');
}

// 创建 Supabase 客户端实例
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // 禁用会话持久化，因为我们使用 JWT
    },
  }
); 