import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/UsuarioModel';
import { Usuario } from '../types';

export class AuthService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'meu-secret-jwt-muito-seguro-2024';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  static async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, this.SALT_ROUNDS);
  }

  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  static generateToken(usuario: Usuario): string {
    return jwt.sign(
      { id: usuario.id, email: usuario.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async login(email: string, senha: string): Promise<{ token: string; usuario: Omit<Usuario, 'senha'> } | null> {
    const usuario = UsuarioModel.findByEmail(email);
    if (!usuario) return null;
    
    const senhaValida = await this.comparePassword(senha, usuario.senha);
    if (!senhaValida) return null;
    
    const token = this.generateToken(usuario);
    const { senha: _, ...usuarioSemSenha } = usuario;
    
    return { token, usuario: usuarioSemSenha };
  }
}