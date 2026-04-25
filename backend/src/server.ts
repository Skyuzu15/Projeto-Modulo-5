import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UsuarioService } from './services/UsuarioService';
import { AuthService } from './services/AuthService';
import { ProdutoModel } from './models/ProdutoModel';
import { PedidoModel } from './models/PedidoModel';
import { UsuarioModel } from './models/UsuarioModel';
import { authMiddleware, AuthRequest } from './middlewares/authMiddleware';
import { createUsuarioSchema, updateUsuarioSchema, loginSchema } from './validations/usuarioValidation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ==================== ROTAS PÚBLICAS ====================

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);
    const result = await AuthService.login(email, senha);
    
    if (!result) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.errors?.[0]?.message || error.message });
  }
});

// Cadastro de usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const dados = createUsuarioSchema.parse(req.body);
    const usuario = await UsuarioService.create(dados);
    res.status(201).json(usuario);
  } catch (error: any) {
    res.status(400).json({ error: error.errors?.[0]?.message || error.message });
  }
});

// ==================== ROTAS AUTENTICADAS ====================

// Perfil do usuário
app.get('/api/me', authMiddleware, (req: AuthRequest, res) => {
  const usuario = UsuarioService.getProfile(req.userId!);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json(usuario);
});

// Editar usuário (apenas o próprio)
app.put('/api/usuarios/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const dados = updateUsuarioSchema.parse(req.body);
    const usuario = await UsuarioService.update(id, dados, req.userId!);
    res.json(usuario);
  } catch (error: any) {
    res.status(400).json({ error: error.errors?.[0]?.message || error.message });
  }
});

// ==================== CRUD PRODUTOS ====================
app.get('/api/produtos', authMiddleware, (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = ProdutoModel.paginate(page, limit, req.userId);
  res.json(result);
});

app.post('/api/produtos', authMiddleware, (req: AuthRequest, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  
  if (!nome || !preco || quantidade === undefined) {
    return res.status(400).json({ error: 'Nome, preço e quantidade são obrigatórios' });
  }
  
  if (preco <= 0) {
    return res.status(400).json({ error: 'Preço deve ser maior que zero' });
  }
  
  if (quantidade < 0) {
    return res.status(400).json({ error: 'Quantidade não pode ser negativa' });
  }
  
  const produto = ProdutoModel.create({
    nome,
    descricao: descricao || '',
    preco,
    quantidade,
    categoria: categoria || 'Sem categoria',
    usuarioId: req.userId!
  });
  
  res.status(201).json(produto);
});

app.put('/api/produtos/:id', authMiddleware, (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const produto = ProdutoModel.findById(id);
  
  if (!produto) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  if (produto.usuarioId !== req.userId) {
    return res.status(403).json({ error: 'Você só pode editar seus próprios produtos' });
  }
  
  const { nome, descricao, preco, quantidade, categoria } = req.body;
  const updated = ProdutoModel.update(id, { nome, descricao, preco, quantidade, categoria });
  
  res.json(updated);
});

app.delete('/api/produtos/:id', authMiddleware, (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const produto = ProdutoModel.findById(id);
  
  if (!produto) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  if (produto.usuarioId !== req.userId) {
    return res.status(403).json({ error: 'Você só pode deletar seus próprios produtos' });
  }
  
  ProdutoModel.delete(id);
  res.status(204).send();
});

// ==================== CRUD PEDIDOS ====================
app.get('/api/pedidos', authMiddleware, (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = PedidoModel.paginate(page, limit, req.userId);
  
  const pedidosCompletos = result.data.map(pedido => {
    const produto = ProdutoModel.findById(pedido.produtoId);
    return { ...pedido, produto };
  });
  
  res.json({ ...result, data: pedidosCompletos });
});

app.post('/api/pedidos', authMiddleware, (req: AuthRequest, res) => {
  const { produtoId, quantidade } = req.body;
  
  if (!produtoId || !quantidade || quantidade <= 0) {
    return res.status(400).json({ error: 'Produto e quantidade são obrigatórios' });
  }
  
  const produto = ProdutoModel.findById(produtoId);
  if (!produto) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  if (produto.quantidade < quantidade) {
    return res.status(400).json({ error: 'Estoque insuficiente' });
  }
  
  const valorTotal = produto.preco * quantidade;
  
  const pedido = PedidoModel.create({
    usuarioId: req.userId!,
    produtoId,
    quantidade,
    valorTotal,
    status: 'pendente'
  });
  
  // Atualiza estoque
  ProdutoModel.update(produtoId, { quantidade: produto.quantidade - quantidade });
  
  res.status(201).json({ ...pedido, produto: ProdutoModel.findById(produtoId) });
});

app.put('/api/pedidos/:id/status', authMiddleware, (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const pedido = PedidoModel.findById(id);
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  
  if (pedido.usuarioId !== req.userId) {
    return res.status(403).json({ error: 'Você só pode alterar seus próprios pedidos' });
  }
  
  const statusValidos = ['pendente', 'aprovado', 'enviado', 'entregue', 'cancelado'];
  if (!statusValidos.includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  
  const updated = PedidoModel.update(id, { status });
  res.json(updated);
});

app.delete('/api/pedidos/:id', authMiddleware, (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const pedido = PedidoModel.findById(id);
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  
  if (pedido.usuarioId !== req.userId) {
    return res.status(403).json({ error: 'Você só pode deletar seus próprios pedidos' });
  }
  
  if (pedido.status !== 'entregue') {
    const produto = ProdutoModel.findById(pedido.produtoId);
    if (produto) {
      ProdutoModel.update(produto.id, { quantidade: produto.quantidade + pedido.quantidade });
    }
  }
  
  PedidoModel.delete(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// Rota de login - deve retornar o usuario com createdAt
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);
    const result = await AuthService.login(email, senha);
    
    if (!result) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    // Garantir que o usuário tenha createdAt
    const usuarioCompleto = UsuarioModel.findByEmail(email);
    const usuarioSemSenha = {
      id: result.usuario.id,
      nome: result.usuario.nome,
      email: result.usuario.email,
      cpf: result.usuario.cpf,
      createdAt: usuarioCompleto?.createdAt
    };
    
    res.json({ token: result.token, usuario: usuarioSemSenha });
  } catch (error: any) {
    res.status(400).json({ error: error.errors?.[0]?.message || error.message });
  }
});