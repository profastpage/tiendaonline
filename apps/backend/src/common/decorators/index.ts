import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para obtener el tenant actual del contexto
 * Se usa junto con el TenantGuard
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant;
  },
);

/**
 * Decorador para obtener el usuario actual del contexto
 * Se usa junto con el AuthGuard
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
