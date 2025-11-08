import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type TabKey = "login" | "signup";

interface AuthProps {
  defaultTab?: TabKey;
  onAuthenticated?: () => void;
}

export function Auth({ defaultTab = "signup", onAuthenticated }: AuthProps) {
  const [active, setActive] = useState<TabKey>(defaultTab);

  // shared state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // login state
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] =
    useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="grid grid-cols-1 md:grid-cols-2 min-h-screen overflow-hidden rounded-none border-0 shadow-none md:divide-x md:divide-gray-200">
      {/* Left: Logo + Form (aligned similar to reference) */}
      <div className="py-6 px-6 md:py-16 md:px-16 flex flex-col min-h-screen md:min-h-0">
        {/* Logo */}
        <div className="mb-24">
          <img src="/logo.png" alt="Aroha Logo" className="h-8 w-auto" />
        </div>

        <div className="flex-1">
          <div className="max-w-md w-full mx-auto">
            {/* Segmented tabs (fixed at top within left column) */}
            <div className="mb-8 sticky top-6 z-10 w-max flex items-center gap-2 rounded-full bg-indigo-50/80 ring-2 ring-indigo-100 shadow-lg p-1 backdrop-blur supports-[backdrop-filter]:bg-indigo-50/60">
              <Button
                variant="ghost"
                onClick={() => setActive("login")}
                className={
                  (active === "login"
                    ? "bg-indigo-100 text-gray-900 shadow-sm "
                    : "text-gray-700 hover:text-gray-900 ") +
                  "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                }
                aria-selected={active === "login"}
                role="tab"
              >
                <span className="material-symbols-outlined mr-2" aria-hidden>
                  login
                </span>{" "}
                Login
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActive("signup")}
                className={
                  (active === "signup"
                    ? "bg-indigo-100 text-gray-900 shadow-sm "
                    : "text-gray-700 hover:text-gray-900 ") +
                  "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                }
                aria-selected={active === "signup"}
                role="tab"
              >
                <span className="material-symbols-outlined mr-2" aria-hidden>
                  person_add
                </span>{" "}
                Sign up
              </Button>
            </div>

            {active === "login" ? (
              <form
                className="space-y-5"
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoginError("");
                  setIsLoading(true);

                  // Validate inputs
                  if (!email || !loginPassword) {
                    setLoginError("Please enter both email and password");
                    setIsLoading(false);
                    return;
                  }

                  // Check if Supabase is configured
                  if (!isSupabaseConfigured() || !supabase) {
                    setLoginError(
                      "Authentication service not configured. Please contact support."
                    );
                    setIsLoading(false);
                    return;
                  }

                  try {
                    // Sign in with Supabase Auth
                    const { data, error } =
                      await supabase.auth.signInWithPassword({
                        email: email,
                        password: loginPassword,
                      });

                    if (error) {
                      console.error("Login error:", error);
                      if (error.message.includes("Invalid login credentials")) {
                        setLoginError("Invalid email or password");
                      } else if (
                        error.message.includes("Email not confirmed")
                      ) {
                        setLoginError(
                          "Please verify your email before logging in. Check your inbox for the confirmation email."
                        );
                      } else if (
                        error.message.includes(
                          "Email link is invalid or has expired"
                        )
                      ) {
                        setLoginError(
                          "Email verification link expired. Please sign up again."
                        );
                      } else {
                        setLoginError(`Login failed: ${error.message}`);
                      }
                      setIsLoading(false);
                      return;
                    }

                    if (data.user) {
                      // Successful login
                      console.log("Login successful:", data.user.email);
                      onAuthenticated?.();
                    } else {
                      setLoginError("Login failed. No user data returned.");
                      setIsLoading(false);
                    }
                  } catch (err) {
                    console.error("Unexpected login error:", err);
                    setLoginError("Login failed. Please try again.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {signupSuccess && (
                  <Alert variant="success">
                    <CheckCircle2 className="h-5 w-5 mt-0.5" aria-hidden />
                    <div>
                      <AlertTitle>
                        Success! Your account has been created
                      </AlertTitle>
                      <AlertDescription>
                        {emailConfirmationRequired
                          ? "Please verify your email by clicking the link sent to your inbox before logging in."
                          : "You can now log in using your email and password."}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5 mt-0.5" aria-hidden />
                    <div>
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>{loginError}</AlertDescription>
                    </div>
                  </Alert>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                  Welcome back
                </h1>
                <div>
                  <Label htmlFor="login-email" className="mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <span className="material-symbols-outlined" aria-hidden>
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-md"
                  disabled={isLoading || !email || !loginPassword}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            ) : (
              <form
                className="space-y-5"
                noValidate
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!passwordsMatch) return;

                  setIsLoading(true);
                  setLoginError("");

                  // Check if Supabase is configured
                  if (!isSupabaseConfigured() || !supabase) {
                    alert(
                      "Authentication service not configured. Please contact support."
                    );
                    setIsLoading(false);
                    return;
                  }

                  try {
                    // Sign up with Supabase Auth
                    const { data, error } = await supabase.auth.signUp({
                      email: signupEmail,
                      password: password,
                      options: {
                        emailRedirectTo: window.location.origin,
                      },
                    });

                    console.log("Signup response:", { data, error });

                    if (error) {
                      console.error("Signup error:", error);
                      if (error.message.includes("already registered")) {
                        alert(
                          "An account with this email already exists. Please login instead."
                        );
                        setActive("login");
                        setEmail(signupEmail);
                      } else {
                        alert(`Signup failed: ${error.message}`);
                      }
                      setIsLoading(false);
                      return;
                    }

                    if (data.user) {
                      console.log("User created:", data.user);

                      // Check if email confirmation is required
                      if (
                        data.user.identities &&
                        data.user.identities.length === 0
                      ) {
                        // User already exists
                        alert(
                          "An account with this email already exists. Please login instead."
                        );
                        setActive("login");
                        setEmail(signupEmail);
                      } else {
                        // Check if user needs to confirm email
                        const needsEmailConfirmation =
                          data.user.confirmed_at === null;

                        console.log(
                          "Email confirmation required:",
                          needsEmailConfirmation
                        );
                        console.log("confirmed_at:", data.user.confirmed_at);

                        // Set state and switch to login tab
                        setEmailConfirmationRequired(needsEmailConfirmation);
                        setSignupSuccess(true);
                        setEmail(signupEmail);
                        setActive("login");
                      }
                    }
                  } catch (err) {
                    console.error("Unexpected signup error:", err);
                    alert("Signup failed. Please try again.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                  Welcome to Aroha
                </h1>

                <div>
                  <Label htmlFor="signup-email" className="mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="jane@example.com"
                    aria-describedby="signup-email-desc"
                  />
                  <p id="signup-email-desc" className="sr-only">
                    Enter your email address
                  </p>
                </div>
                <div>
                  <Label htmlFor="password" className="mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <span className="material-symbols-outlined" aria-hidden>
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="mb-2 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      aria-invalid={password.length > 0 && !passwordsMatch}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      <span className="material-symbols-outlined" aria-hidden>
                        {showConfirm ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      passwordsMatch ? "text-emerald-600" : "text-gray-400"
                    }
                    aria-hidden
                  >
                    <span className="material-symbols-outlined align-middle">
                      {passwordsMatch
                        ? "check_circle"
                        : "radio_button_unchecked"}
                    </span>
                  </span>
                  <span
                    className={
                      passwordsMatch ? "text-emerald-700" : "text-gray-600"
                    }
                  >
                    {passwordsMatch ? "Looks good!" : "Passwords must match"}
                  </span>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-md"
                  disabled={
                    !passwordsMatch ||
                    signupEmail.trim().length === 0 ||
                    isLoading
                  }
                  aria-disabled={
                    !passwordsMatch ||
                    signupEmail.trim().length === 0 ||
                    isLoading
                  }
                >
                  {isLoading ? "Creating account..." : "Continue"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right: Illustration image */}
      <div className="hidden md:block bg-[#efece7] relative">
        <img
          src="/theme.png"
          alt="Welcome illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0   pt-12 ">
          <h2 className="text-xl uppercase lg:text-6xl md:text-4xl text-[#009490] px-8 text-outline leading-tight ">
            You are not alone
          </h2>
        </div>
      </div>
    </Card>
  );
}
