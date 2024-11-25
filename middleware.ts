import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/menu", "/contact"],
  afterAuth: (auth, req) =>
    auth.isPublicRoute ? NextResponse.next() : undefined,
});

// export default clerkMiddleware((auth, request) =>{
//   if(!isPublicRoute(request)){
//     auth().protect();
//   }
// });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
