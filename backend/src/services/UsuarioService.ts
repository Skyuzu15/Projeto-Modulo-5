import { UsuarioModel } from '../models/UsuarioModel';
import { AuthService } from './AuthService';
import { Usuario } from '../types';

export class UsuarioService {
  static async create(dados: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
  }): Promise<Omit<Usuario, 'senha'>> {
    const emailExistente = UsuarioModel.findByEmail(dados.email);
    if (emailExistente) {
      throw new Error('Email já cadastrado');
    }
    
    const senhaHash = await AuthService.hashPassword(dados.senha);
    
    const novoUsuario = UsuarioModel.create({
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash,
      cpf: dados.cpf
    });
    
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha;
  }

  static async update(id: number, dados: {
    nome: string;
    senha?: string;
    cpf: string;
  }, usuarioId: number): Promise<Omit<Usuario, 'senha'>> {
    if (id !== usuarioId) {
      throw new Error('Você só pode editar seu próprio perfil');
    }
    
    const usuario = UsuarioModel.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    if (dados.senha) {
      dados.senha = await AuthService.hashPassword(dados.senha);
    }
    
    const updated = UsuarioModel.update(id, dados);
    if (!updated) {
      throw new Error('Erro ao atualizar usuário');
    }
    
    const { senha: _, ...usuarioSemSenha } = updated;
    return usuarioSemSenha;
  }

  static getProfile(id: number): Omit<Usuario, 'senha'> | null {
    const usuario = UsuarioModel.findById(id);
    if (!usuario) return null;
    
    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  static list(page: number = 1, limit: number = 10) {
    return UsuarioModel.paginate(page, limit);
  }
}