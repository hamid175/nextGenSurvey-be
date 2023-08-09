import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomRequest from '../customRequest'; // Import your existing CustomRequest interface





interface TokenPayload {
    userId: string;
  }
  
  export const authMiddleware = (
    req: CustomRequest, // Use the CustomRequest interface here
    res: Response,
    next: NextFunction
  ) => {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };