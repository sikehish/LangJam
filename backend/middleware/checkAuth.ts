import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthReq extends Request {
  user?: string;
  headers: {
    authorization?: string;
  };
}

export const checkAuth = (req: AuthReq, res: Response, next: NextFunction): Response | void => {
  const { authorization: auth } = req.headers;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ status: "fail", message: 'Unauthorized access. Bearer token not provided.' });
  }

  const token = auth.split(' ')[1]; // Format: Bearer 'token'

  if (!token) {
    return res.status(401).json({ status: "fail", message: 'Unauthorized access. Invalid Bearer token.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY as jwt.Secret);

    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
      return res.status(401).json({ status: "fail", message: "Invalid token format" });
    }

    const { id } = decodedToken;
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: "fail", message: 'Unauthorized access.' }) as Response;
  }
};
