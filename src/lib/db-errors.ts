// src/lib/db-errors.ts

/**
 * 将数据库底层错误转换为用户友好的中文提示
 */
export function friendlyDbError(operation: string, error: string): string {
  // 外键约束
  if (error.includes('violates foreign key constraint')) {
    if (error.includes('store_id')) {
      return `${operation}失败：店铺信息无效，请刷新页面后重试`;
    }
    if (error.includes('product_id')) {
      return `${operation}失败：关联的商品不存在`;
    }
    if (error.includes('template_id')) {
      return `${operation}失败：所选模板不存在`;
    }
    return `${operation}失败：关联数据不存在，请检查后重试`;
  }

  // 唯一约束
  if (error.includes('violates unique constraint') || error.includes('duplicate key')) {
    if (error.includes('email')) {
      return `${operation}失败：该邮箱已被注册`;
    }
    if (error.includes('slug')) {
      return `${operation}失败：名称已被使用，请换一个`;
    }
    return `${operation}失败：数据已存在，请勿重复操作`;
  }

  // 非空约束
  if (error.includes('violates not-null constraint')) {
    return `${operation}失败：必填信息缺失，请检查表单`;
  }

  // 行级安全策略
  if (error.includes('new row violates row-level security')) {
    return `${operation}失败：权限不足，请确认您有操作权限`;
  }

  // 连接错误
  if (error.includes('connection') || error.includes('timeout') || error.includes('ECONNREFUSED')) {
    return `${operation}失败：数据库连接异常，请稍后再试`;
  }

  // 默认
  return `${operation}失败，请稍后再试`;
}
