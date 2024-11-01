"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/zustand/zustand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock } from "lucide-react";
import type { LoginResponse } from "@/app/lib/types/index";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password must be less than 12 characters"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as LoginResponse;

      if (response.ok) {
        setAuth(data.token, data.user);

        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (error) {
      setLoginError("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-600">
            Event Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display login error */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              {loginError}
            </div>
          )}

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                        <Input
                          {...field}
                          placeholder="you@example.com"
                          type="email"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                        <Input
                          {...field}
                          placeholder="Enter your password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Forgot Password & Sign Up Links */}
          <div className="mt-4 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
            <span className="mx-2">|</span>
            <Link href="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
