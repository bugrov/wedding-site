"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { useLoginMutation } from "@/lib/hooks/use-login-mutation";

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLoginMutation();

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось войти. Попробуйте ещё раз.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <h1 className="text-lg font-semibold text-neutral-900">Вход в панель оператора</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            {...register("email")}
            aria-invalid={!!errors.email}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 ${
              errors.email ? "border-red-500" : "border-neutral-300"
            }`}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400 ${
              errors.password ? "border-red-500" : "border-neutral-300"
            }`}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSubmitting ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
