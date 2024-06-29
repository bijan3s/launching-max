import { Request, Response, NextFunction } from "express";

// Middleware to add custom methods to the Response object
const customResponseMethods = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = (data?: any) => {
    return res.status(200).json({ success: true, data });
  };

  res.created = (data?: any) => {
    return res
      .status(201)
      .json({ success: true, data, message: "با موفقیت ساخته شد." });
  };

  res.updated = (message?: any) => {
    return res
      .status(201)
      .json({ success: true, message: message || "با موفقیت بروزرسانی شد." });
  };

  res.noContent = () => {
    return res.status(204).send();
  };

  res.validationError = (data?: { [key: string]: string[] }) => {
    return res
      .status(400)
      .json({ message: " ورودی را بررسی کنید", data: data });
  };

  res.badRequest = (message?: string) => {
    return res.status(400).json({ error: message });
  };

  res.unauthorized = (message?: string) => {
    return res.status(401).json({ error: message });
  };

  res.forbidden = (message?: string) => {
    return res.status(403).json({ error: message });
  };

  res.notFound = (message?: string) => {
    return res.status(404).json({ error: message || "پیدا نشد" });
  };

  res.conflict = (message?: string) => {
    return res.status(409).json({ error: message });
  };

  res.internalError = (message?: string) => {
    return res
      .status(500)
      .json({ error: message || "سیستم با مشکل مواجه شده است" });
  };

  next();
};

export default customResponseMethods;
