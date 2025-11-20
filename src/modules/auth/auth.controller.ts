import { Request, Response, NextFunction } from "express";
import * as AuthService from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.schemas";
import * as TokenService from "./token.service";
import {
  AUTH_COOKIE_OPTIONS,
  CLEAR_AUTH_COOKIE_OPTIONS,
} from "../../config/cookies";
import { ENV } from "../../config/env";
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await AuthService.register(data);
    res.status(201).json({
      message: "User registered successfully",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = LoginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await AuthService.login(data);
    const cookieOptions = {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: data.rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      message: "Login successful",
      data: { user },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) {
      return res.status(400).json({
        message: "Refresh token not provided",
      });
    }

    const { accessToken, refreshToken } =
      await TokenService.validateRefreshToken(oldToken);

    res.cookie("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS);

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not provided",
      });
    }
    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken", CLEAR_AUTH_COOKIE_OPTIONS);
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
}

// Handler for Google OAuth callback. Passport places the user on `req.user`.
export async function googleOAuthCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = ((req as any).user as any) || null;
    if (!user) {
      return res.status(400).json({ message: "No user from OAuth provider" });
    }

    const accessToken = TokenService.generateAccessToken(user);
    const refreshToken = await TokenService.generateRefreshToken(user.id, 7);

    // set refresh token cookie and redirect to frontend
    res.cookie("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS);

    // Redirect to frontend; the frontend can read the access token from the query
    const redirectUrl = `${ENV.CORS_ORIGIN}`;
    // Note: for security, we avoid placing refreshToken in URL; we only put accessToken.
    res.redirect(`${redirectUrl}/oauth-success?accessToken=${accessToken}`);
  } catch (err) {
    next(err);
  }
}
