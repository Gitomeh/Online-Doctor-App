"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateUserId, getUserByEmail, saveUser, setCurrentUser } from "@/utils/data/user-management";
import { useToast } from "@/components/ui/toast";
import { FormField, ErrorAlert } from "@/components/forms/form-components";
import { isValidEmail, isValidPassword, isRequired, hasMinLength, VALIDATION_ERRORS } from "@/utils/validation";
import { sendWelcomeEmail } from "@/utils/common/email-service";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};
    setGeneralError(null);

    // First name validation
    if (!isRequired(formData.firstName)) {
      newErrors.firstName = VALIDATION_ERRORS.REQUIRED("First name");
    } else if (!hasMinLength(formData.firstName, 2)) {
      newErrors.firstName = VALIDATION_ERRORS.MIN_LENGTH("First name", 2);
    }

    // Last name validation
    if (!isRequired(formData.lastName)) {
      newErrors.lastName = VALIDATION_ERRORS.REQUIRED("Last name");
    } else if (!hasMinLength(formData.lastName, 2)) {
      newErrors.lastName = VALIDATION_ERRORS.MIN_LENGTH("Last name", 2);
    }

    // Email validation
    if (!isRequired(formData.email)) {
      newErrors.email = VALIDATION_ERRORS.REQUIRED("Email");
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_ERRORS.EMAIL_INVALID;
    } else {
      // Check if email already exists
      const existingUser = getUserByEmail(formData.email);
      if (existingUser) {
        newErrors.email = VALIDATION_ERRORS.EMAIL_EXISTS;
        setGeneralError("Please use a different email address or log in to your existing account.");
      }
    }

    // Password validation
    if (!isRequired(formData.password)) {
      newErrors.password = VALIDATION_ERRORS.REQUIRED("Password");
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = VALIDATION_ERRORS.PASSWORD_WEAK;
    }

    // Confirm password validation
    if (!isRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = VALIDATION_ERRORS.REQUIRED("Please confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_ERRORS.PASSWORD_MISMATCH;
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
      // Create new user
      const newUser = {
        id: generateUserId(),
        email: formData.email.toLowerCase(),
        password: formData.password, // In production, this should be hashed
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      saveUser(newUser);

      // Set current user
      setCurrentUser(newUser.id);

      // Send welcome email
      try {
        await sendWelcomeEmail({
          firstName: newUser.firstName,
          email: newUser.email
        });
        showToast("Welcome email sent!", "info");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Continue anyway as email sending is not critical
      }

      // Show success toast
      showToast("Account created successfully! You are now logged in.", "success");

      // Redirect to booking page (instead of home)
      router.push("/booking");
    } catch (error) {
      console.error("Error during sign up:", error);
      setGeneralError("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof SignUpFormData]) {
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
            Create Account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join DocBook to book appointments with doctors
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
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />

              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}