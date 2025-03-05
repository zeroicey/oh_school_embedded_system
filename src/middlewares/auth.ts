import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import Responder from "./response";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authorization = c.req.header("Authorization");

    if (!authorization) {
      return Responder.fail("未提供认证令牌")
        .setStatusCode(401)
        .build(c);
    }

    // 检查 Bearer token 格式
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      return Responder.fail("认证令牌格式错误")
        .setStatusCode(401)
        .build(c);
    }

    try {
      // 验证 token
      const decoded = verify(token, JWT_SECRET);
      
      // 将解码后的用户信息存储在上下文中，供后续使用
      c.set("user", decoded);
      
      await next();
    } catch (error) {
      return Responder.fail("认证令牌无效或已过期")
        .setStatusCode(401)
        .build(c);
    }
  } catch (error) {
    return Responder.fail("认证失败")
      .setStatusCode(500)
      .build(c);
  }
};
