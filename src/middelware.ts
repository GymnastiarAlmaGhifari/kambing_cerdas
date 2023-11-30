import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "owner" || token?.role === "pekerja",
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/kandang", "/estimate", "/alat", "/pengguna"],
};
