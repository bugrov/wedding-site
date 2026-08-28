import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { LoginInput } from "@/lib/schemas/auth";
import { fetchOrThrow } from "./fetch-or-throw";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await fetchOrThrow("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось войти. Попробуйте ещё раз.");
      }
    },
    onSuccess: () => {
      router.push("/admin/dashboard");
      router.refresh();
    },
  });
}
