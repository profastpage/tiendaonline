import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

/**
 * Decorador para especificar roles requeridos
 * @example @Roles('ADMIN', 'GERENTE')
 */
export const Roles = (...roles: string[]) => {
  return (target: any, key?: any, descriptor?: any) => {
    if (descriptor) {
      // Decorador de método
      Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
      return descriptor;
    }
    // Decorador de clase
    Reflect.defineMetadata(ROLES_KEY, roles, target);
    return target;
  };
};

/**
 * Guard para verificar roles de usuario
 * Debe usarse después de AuthGuard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No se requieren roles específicos
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // No hay usuario autenticado
    }

    // Verificar si el rol del usuario está en la lista de roles requeridos
    return requiredRoles.some((role) => user.rol === role);
  }
}
