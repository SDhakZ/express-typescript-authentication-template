import { Request, Response, NextFunction } from "express";
import * as AuthService from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.schemas";
import {
  AUTH_COOKIE_OPTIONS,
  CLEAR_AUTH_COOKIE_OPTIONS,
} from "../../config/cookies";
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await AuthService.register(data);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
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
      success: true,
      message: "Login successful",
      data: { user },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const oldToken = req.cookies.refreshToken;
    console.log("oldToken:", oldToken);
    console.log("Old Refresh Token:", oldToken);
    if (!oldToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    const { accessToken, refreshToken } = await AuthService.refreshToken(
      oldToken
    );

    res.cookie("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
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
        success: false,
        message: "Refresh token not provided",
      });
    }

    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken", CLEAR_AUTH_COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
}
