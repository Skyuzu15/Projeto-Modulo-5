import { Pedido } from '../types';

export class PedidoModel {
  private static pedidos: Pedido[] = [];
  private static nextId = 1;

  static findAll(): Pedido[] {
    return this.pedidos;
  }

  static findById(id: number): Pedido | undefined {
    return this.pedidos.find(p => p.id === id);
  }

  static findByUsuarioId(usuarioId: number): Pedido[] {
    return this.pedidos.filter(p => p.usuarioId === usuarioId);
  }

  static create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Pedido {
    const novoPedido: Pedido = {
      id: this.nextId++,
      ...pedido,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.pedidos.push(novoPedido);
    return novoPedido;
  }

  static update(id: number, dados: Partial<Pedido>): Pedido | undefined {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.pedidos[index] = {
      ...this.pedidos[index],
      ...dados,
      updatedAt: new Date()
    };
    return this.pedidos[index];
  }

  static delete(id: number): boolean {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.pedidos.splice(index, 1);
    return true;
  }

  static paginate(page: number, limit: number, usuarioId?: number): { data: Pedido[]; total: number; page: number; totalPages: number } {
    let filtrados = this.pedidos;
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