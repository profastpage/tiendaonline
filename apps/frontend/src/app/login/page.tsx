'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useTenant } from '@/hooks/useTenant';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { toast } from 'sonner';
import { ShoppingBag, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const { login, isLoading } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);

    try {
      await login({
        ...data,
        tenantSlug: tenantSlug || undefined,
      });

      toast.success('¡Bienvenido!');
      router.push('/admin');
    } catch (error: any) {
      console.error('Error en login:', error);
      toast.error(
        error.response?.data?.message || 'Credenciales inválidas'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-600 to-primary-700">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center text-white">
          <ShoppingBag className="w-6 h-6 mr-2" />
          <span className="font-bold text-lg">Tienda</span>
        </Link>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600 mt-2">
                Ingresa tus credenciales para acceder al panel
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ingresa un email válido',
                  },
                })}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting || isLoading}
              >
                Ingresar
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>¿No tienes una cuenta?</p>
              <p className="text-xs text-gray-500 mt-1">
                Contacta al administrador de tu tienda
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white/60 text-sm">
        <p>&copy; {new Date().getFullYear()} Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
