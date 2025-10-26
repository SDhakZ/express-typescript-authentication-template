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
    const user = await AuthService.registerUser(data);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = LoginSchema.parse(req.body);
    const token = await AuthService.loginUser(data);
    res.status(200).json({ success: true, data: token });
  } catch (err) {
    next(err);
  }
}
