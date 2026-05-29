"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", met: formData.password.length >= 8 },
    { label: "Chứa chữ hoa", met: /[A-Z]/.test(formData.password) },
    { label: "Chứa chữ số", met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mật khẩu không khớp! ❌",
        description: "Vui lòng kiểm tra lại mật khẩu xác nhận.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.name
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Đăng ký tài khoản thất bại");
      }

      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Tài khoản của bạn đã được khởi tạo. Đang tự động đăng nhập...",
      });

      // Tự động đăng nhập sau khi đăng ký thành công
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        login(loginData.access_token, loginData.user);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại ❌",
        description: err.message || "Email này đã được sử dụng hoặc thông tin không hợp lệ.",
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
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    passwordRequirements,
    handleSubmit,
    handleGoogleLogin,
  };
}
