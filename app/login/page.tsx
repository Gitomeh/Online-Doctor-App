"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getUserByEmail, setCurrentUser } from "@/utils/data/user-management";
import { useToast } from "@/components/ui/toast";
import { FormField, ErrorAlert } from "@/components/forms/form-components";
import { isValidEmail, isRequired, VALIDATION_ERRORS } from "@/utils/validation";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    setGeneralError(null);

    // Email validation
    if (!isRequired(formData.email)) {
      newErrors.email = VALIDATION_ERRORS.REQUIRED("Email");
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_ERRORS.EMAIL_INVALID;
    }

    // Password validation
    if (!isRequired(formData.password)) {
      newErrors.password = VALIDATION_ERRORS.REQUIRED("Password");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Check if user exists
      const user = getUserByEmail(formData.email);
      
      if (!user) {
        setGeneralError("No account found with this email address. Please sign up.");
        return;
      }

      // Check password (in production, this should use hashed passwords)
      if (user.password !== formData.password) {
        setGeneralError("Incorrect password. Please try again.");
        return;
      }

      // Set current user
      setCurrentUser(user.id);

      // Show success toast
      showToast("Login successful! Welcome back.", "success");

      // Refresh the page to update UI state
      window.location.reload();
    } catch (error) {
      console.error("Error during login:", error);
      setGeneralError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Log in to your DocBook account
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <ErrorAlert 
            message={generalError} 
            onDismiss={() => setGeneralError(null)}
          />
        )}

        <Card className="p-6 dark:bg-neutral-800">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <FormField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            {/* Password Field */}
            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="#" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}