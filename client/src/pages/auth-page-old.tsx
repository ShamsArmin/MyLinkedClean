import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.pick({ username: true, password: true, email: true, name: true });

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Handle URL error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error && message) {
      setErrorMessage(decodeURIComponent(message));
      // Clean up URL
      window.history.replaceState({}, '', '/auth');
    }
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    setErrorMessage(null);
    loginMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/");
      },
      onError: () => {
        setErrorMessage("Invalid username or password");
      },
    });
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    setErrorMessage(null);
    registerMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/");
      },
      onError: () => {
        setErrorMessage("Registration failed. Username might already exist.");
      },
    });
  };

  const handleSocialLogin = (provider: string) => {
    setErrorMessage(null);
    window.location.href = `/api/auth/${provider}`;
  };

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 max-w-md mx-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              MyLinked
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6">
                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                        Google
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('twitter')}
                      >
                        <FaTwitter className="mr-2 h-4 w-4 text-gray-900" />
                        X
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('github')}
                      >
                        <FaGithub className="mr-2 h-4 w-4 text-gray-800" />
                        GitHub
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">Or continue with email</span>
                    </div>
                  </div>

                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your username" 
                                {...field} 
                                autoComplete="username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                {...field} 
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardContent className="pt-6">
                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                        Google
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('twitter')}
                      >
                        <FaTwitter className="mr-2 h-4 w-4 text-gray-900" />
                        X
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium"
                        onClick={() => handleSocialLogin('github')}
                      >
                        <FaGithub className="mr-2 h-4 w-4 text-gray-800" />
                        GitHub
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">Or create account with email</span>
                    </div>
                  </div>

                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                                autoComplete="username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                autoComplete="name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                {...field} 
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Create a password" 
                                {...field} 
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 items-center justify-center p-12 text-white">
        <div className="max-w-lg text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Connect Your Digital World
            </h1>
            <p className="text-xl text-blue-100">
              Create a stunning profile that showcases all your social links and projects in one place. Join thousands building their digital presence.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Easy Setup</h3>
              <p className="text-sm text-blue-100">Get your profile live in minutes with our intuitive builder</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="font-semibold">Professional</h3>
              <p className="text-sm text-blue-100">Beautiful themes that make you stand out from the crowd</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-blue-100">Track clicks and engagement with detailed insights</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-sm text-blue-100">Smart suggestions to optimize your profile for better engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}