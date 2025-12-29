import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Loader2, Mail, Lock, ArrowRight, UserX, Zap } from "lucide-react";
import { AnimatedTitle } from "@/components/AnimatedTitle";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") {
          fieldErrors.email = issue.message;
        }
        if (issue.path[0] === "password") {
          fieldErrors.password = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("Please check your email and confirm your account");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Welcome back!");
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Account created! You can now sign in.");
        setIsLogin(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestAccess = () => {
    navigate("/?guest=true");
    toast.info("Browsing as guest - history won't be saved");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float animate-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl animate-float-slow stagger-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-neon-blue/3 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float stagger-2" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-neon-blue/10 rounded-full blur-2xl animate-float stagger-4" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 opacity-0 animate-slide-down" style={{ animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-muted-foreground mb-4 animate-border-glow">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>AI-Powered Prompt Generator</span>
              <Zap className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <AnimatedTitle />
            <p className="text-muted-foreground opacity-0 animate-fade-in stagger-2" style={{ animationFillMode: "forwards" }}>
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {/* Form */}
          <div className="glass-panel p-6 md:p-8 space-y-6 opacity-0 animate-scale-bounce stagger-3 hover-glow transition-all duration-500" style={{ animationFillMode: "forwards" }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 opacity-0 animate-slide-up stagger-4" style={{ animationFillMode: "forwards" }}>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 transition-all duration-300 focus:shadow-glow ${errors.email ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive animate-slide-up">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2 opacity-0 animate-slide-up stagger-5" style={{ animationFillMode: "forwards" }}>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 transition-all duration-300 focus:shadow-glow ${errors.password ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive animate-slide-up">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full group relative overflow-hidden opacity-0 animate-slide-up stagger-6"
                style={{ animationFillMode: "forwards" }}
                disabled={isSubmitting}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative opacity-0 animate-fade-in stagger-7" style={{ animationFillMode: "forwards" }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  {isLogin ? "New here?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="space-y-3 opacity-0 animate-slide-up stagger-8" style={{ animationFillMode: "forwards" }}>
              <Button
                variant="outline"
                className="w-full hover:border-primary/50 transition-all duration-300"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                disabled={isSubmitting}
              >
                {isLogin ? "Create an account" : "Sign in instead"}
              </Button>

              <Button
                variant="ghost"
                className="w-full gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
                onClick={handleGuestAccess}
                disabled={isSubmitting}
              >
                <UserX className="w-4 h-4" />
                Continue as Guest
                <span className="text-xs text-muted-foreground/70">(no history)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
