import { Usuario } from '../types';

export class UsuarioModel {
  private static usuarios: Usuario[] = [];
  private static nextId = 1;

  static findAll(): Usuario[] {
    return this.usuarios;
  }

  static findById(id: number): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }

  static findByEmail(email: string): Usuario | undefined {
    return this.usuarios.find(u => u.email === email);
  }

  static create(usuario: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Usuario {
    const novoUsuario: Usuario = {
      id: this.nextId++,
      ...usuario,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  static update(id: number, dados: Partial<Usuario>): Usuario | undefined {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    this.usuarios[index] = {
      ...this.usuarios[index],
      ...dados,
      updatedAt: new Date()
    };
    return this.usuarios[index];
  }

  static delete(id: number): boolean {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.usuarios.splice(index, 1);
    return true;
  }

  static paginate(page: number, limit: number): { data: Usuario[]; total: number; page: number; totalPages: number } {
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.usuarios.slice(start, end);
    
    return {
      data,
      total: this.usuarios.length,
      page,
      totalPages: Math.ceil(this.usuarios.length / limit)
    };
  }
}