export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoria: string;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  status: 'pendente' | 'aprovado' | 'enviado' | 'entregue' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  token: string;
  usuario: Omit<Usuario, 'senha'>;
}