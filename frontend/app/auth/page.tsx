"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Mail, Lock, User, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import { authHelpers } from '@/utils/authHelpers';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.signUpWithEmail(email, password, displayName);

      if (result.success) {
        console.log('User created:', result.user);
        console.log('Message:', result.message);

        // Optional delay before navigation
        setTimeout(() => {
          setIsLoading(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        setIsLoading(false);
        console.error('Error:', result.error);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Unexpected error during sign-up:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.signInWithEmail(email, password);

      if (result.success) {
        console.log('User signed in:', result.user);

        setTimeout(() => {
          setIsLoading(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        setIsLoading(false);
        console.error('Error:', result.error);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Unexpected error during sign-in:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await authService.signInWithGoogle();

      if (result.success) {
        console.log('User signed in with Google:', result.user);

        setTimeout(() => {
          setIsLoading(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        setIsLoading(false);
        console.error('Google login error:', result.error);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Unexpected error during Google login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 center-content w-[50%] align-middle justify-center">
      <div className="container max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <PenTool className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ✨ ScriptCraft
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">
            Sign in to continue your writing journey
          </p>
        </div>

        <Card className="hover-lift bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="text-center">🚀 Get Started</CardTitle>
            <CardDescription className="text-center">
              Join thousands of writers enhancing their craft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">🔑 Login</TabsTrigger>
                <TabsTrigger value="signup">📝 Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">📧 Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">🔒 Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full hover-lift bg-gradient-to-r from-primary to-purple-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "🔄 Signing in..." : "🚀 Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">👤 Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">📧 Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">🔒 Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full hover-lift bg-gradient-to-r from-primary to-purple-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "🔄 Creating account..." : "✨ Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 hover-lift bg-transparent"
                onClick={handleGoogleLogin}
              >
                <Github className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
