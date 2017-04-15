import { User } from 'models';
export async function ensureLogin(ctx, next) {
  const token = ctx.headers.authorization;
  if (token) {
    ctx.user = await User.findOne({ token });
  }
  if (ctx.user) {
    return next();
  }

  // 不需要权限的路由
  const excludeUrls = ['/user/create', '/user/login', '/api/v1/comic'];
  for (const excludeUrl of excludeUrls) {
    if (ctx.url.indexOf(excludeUrl) > -1) {
      return next();
    }
  }
  ctx.throw(401, 'not authorized');
}
