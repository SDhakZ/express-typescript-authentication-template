export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: "localhost",
} as const;

export const CLEAR_AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
  path: "/", // must match above
  domain: "localhost",
} as const;
