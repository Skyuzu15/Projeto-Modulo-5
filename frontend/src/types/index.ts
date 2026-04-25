export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoria: string;
  usuarioId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  status: 'pendente' | 'aprovado' | 'enviado' | 'entregue' | 'cancelado';
  createdAt?: string;
  updatedAt?: string;
  usuario?: Usuario;
  produto?: Produto;
}

export interface LoginResponse {
  token: string;
  usuario: Omit<Usuario, 'senha'>;
}