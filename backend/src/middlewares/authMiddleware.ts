import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  req.userId = decoded.id;
  next();
}