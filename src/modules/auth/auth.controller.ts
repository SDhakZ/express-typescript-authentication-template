import { Request, Response, NextFunction } from "express";
import * as AuthService from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.schemas";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await AuthService.register(data);
    res
      .status(201)
      .json({
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
    const { user, token } = await AuthService.login(data);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
      token,
    });
  } catch (err) {
    next(err);
  }
}
