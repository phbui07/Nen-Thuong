import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only pages that need an account are protected, so unknown URLs still
// reach the 404 page instead of the sign-in screen.
const isProtectedRoute = createRouteMatcher(["/cart(.*)", "/orders(.*)"]);

export default clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
