"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormErrors, LoginFormValues } from "../types";
import { INITIAL_LOGIN_FORM_STATE } from "../lib/mockData";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormValues>(INITIAL_LOGIN_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setIsLoading(false);
  };

  // form validation handler
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit form handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData?.email,
          password: formData?.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      localStorage.setItem("user_token", data.token);
      localStorage.setItem("login", JSON.stringify(data));
      router.push("/timesheets");
      setIsLoading(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setApiError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      {apiError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData?.email}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 text-sm text-black rounded-lg border focus:outline-none focus:ring-2 transition-all ${errors.email
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
            }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={formData?.password}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 text-sm text-black rounded-lg border focus:outline-none focus:ring-2 transition-all ${errors.password
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
            }`}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="remember-me"
          name="rememberMe"
          type="checkbox"
          checked={formData?.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">Remember me</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-[#2563eb] hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;