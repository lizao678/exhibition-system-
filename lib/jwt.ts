import jwt from 'jsonwebtoken';

// 检查环境变量
if (!process.env.JWT_SECRET) {
  throw new Error('缺少 JWT_SECRET 环境变量');
}

const JWT_SECRET = process.env.JWT_SECRET;

// 生成 JWT token
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h', // token 有效期为 24 小时
  });
}

// 验证 JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('无效的 token');
  }
}

// 从请求头中提取 token
export function getTokenFromHeader(authHeader?: string): string {
  if (!authHeader) {
    throw new Error('未提供认证信息');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('认证格式错误');
  }

  return parts[1];
} 