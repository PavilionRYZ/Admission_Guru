export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",

  // Protected Routes
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  UNIVERSITIES: "/universities",
  UNIVERSITY_DETAIL: "/universities/:id",
  SHORTLIST: "/shortlist",
  TASKS: "/tasks",
  AI_COUNSELLOR: "/ai-counsellor",
  PROFILE: "/profile",
};

// Helper functions to generate dynamic routes
export const getUniversityDetailRoute = (id) => `/universities/${id}`;
export const getResetPasswordRoute = (token) => `/reset-password/${token}`;
