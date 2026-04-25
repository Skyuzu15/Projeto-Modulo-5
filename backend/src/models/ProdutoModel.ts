import { Produto } from '../types';

export class ProdutoModel {
  private static produtos: Produto[] = [];
  private static nextId = 1;

  static findAll(): Produto[] {
    return this.produtos;
  }

  static findById(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  static findByUsuarioId(usuarioId: number): Produto[] {
    return this.produtos.filter(p => p.usuarioId === usuarioId);
  }

  static create(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Produto {
    const novoProduto: Produto = {
      id: this.nextId++,
      ...produto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.produtos.push(novoProduto);
    return novoProduto;
  }

  static update(id: number, dados: Partial<Produto>): Produto | undefined {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.produtos[index] = {
      ...this.produtos[index],
      ...dados,
      updatedAt: new Date()
    };
    return this.produtos[index];
  }

  static delete(id: number): boolean {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.produtos.splice(index, 1);
    return true;
  }

  static paginate(page: number, limit: number, usuarioId?: number): { data: Produto[]; total: number; page: number; totalPages: number } {
    let filtrados = this.produtos;
    if (usuarioId) {
      filtrados = filtrados.filter(p => p.usuarioId === usuarioId);
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtrados.slice(start, end);
    
    return {
      data,
      total: filtrados.length,
      page,
      totalPages: Math.ceil(filtrados.length / limit)
    };
  }
}