"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Đăng nhập thất bại");
      }

      login(data.access_token, data.user);

      toast({
        title: "Đăng nhập thành công! 🎉",
        description: `Chào mừng ${data.user.full_name || 'bạn'} quay trở lại!`,
      });

      router.push("/");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại ❌",
        description: err.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { auth: clientAuth, googleProvider, signInWithPopup } = await import("@/lib/firebase");
      const result = await signInWithPopup(clientAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Đồng bộ tài khoản với backend thất bại");
      }

      login(data.access_token, data.user);

      toast({
        title: "Đăng nhập Google thành công! 🚀",
        description: `Chào mừng ${data.user.full_name || 'bạn'} đã tham gia cộng đồng!`,
      });

      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Đăng nhập Google thất bại ❌",
        description: err.message || "Đã xảy ra lỗi trong quá trình xác thực tài khoản Google.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    isLoading,
    handleSubmit,
    handleGoogleLogin,
  };
}
