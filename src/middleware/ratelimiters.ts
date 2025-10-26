import rateLimit from "express-rate-limit";

export const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after 10 minutes.",
    code: "TOO_MANY_ATTEMPTS",
  },
});

export const registerlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message:
      "Too many register attempts from this IP, please try again after 10 minutes.",
    code: "TOO_MANY_ATTEMPTS",
  },
});
