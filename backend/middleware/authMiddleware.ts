import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthReq } from "../typings";

export const checkAuth = (req: Request, res: Response, next: NextFunction): Response | void => {

  const token = req.cookies.token;
  console.log(token)
  
  if (!token) {
    return res.status(401).json({ status: "fail", message: 'Unauthorized access. Token not provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY as jwt.Secret);

    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
      return res.status(401).json({ status: "fail", message: "Invalid token format" });
    }

    const { id } = decodedToken;
    ((req as unknown) as AuthReq).user = id;
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: "fail", message: 'Unauthorized access.' }) as Response;
  }
};

export const checkAdminAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: "fail", message: 'Unauthorized access. Token not provided.' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN_KEY as jwt.Secret);

    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
      return res.status(401).json({ status: "fail", message: "Invalid token format" });
    }

    const { id } = decodedToken;
    ((req as unknown) as AuthReq).user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: "fail", message: 'Unauthorized access.' }) as Response;
  }
};

export const checkMixedAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
  // console.log("COOKIES: ",req.cookies)
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: "fail", message: 'Unauthorized access. Token not provided.' });
  }
  try {
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY as jwt.Secret);
    } catch (error){
      decodedToken = jwt.verify(token, process.env.JWT_ADMIN_KEY as jwt.Secret);
    }
    console.log(decodedToken)
    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
      return res.status(401).json({ status: "fail", message: "Invalid token format" });
    }

    const { id } = decodedToken;
    ((req as unknown) as AuthReq).user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: "fail", message: 'Unauthorized access.' }) as Response;
  }
};
