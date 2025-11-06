import rateLimit from "express-rate-limit";

export const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP, please try again after 10 minutes.",
  },
});

export const registerlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    message:
      "Too many register attempts from this IP, please try again after 10 minutes.",
  },
});
