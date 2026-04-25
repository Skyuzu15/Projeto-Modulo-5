import { UsuarioModel } from '../models/UsuarioModel';

describe('Testes de Usuários', () => {
  beforeEach(() => {
    // Limpa os usuários antes de cada teste
    (UsuarioModel as any).usuarios = [];
    (UsuarioModel as any).nextId = 1;
  });

  test('Deve criar um usuário com dados válidos', () => {
    const dados = {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'Senha123',
      cpf: '123.456.789-00'
    };
    
    const usuario = UsuarioModel.create({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      cpf: dados.cpf
    });
    
    expect(usuario).toHaveProperty('id');
    expect(usuario.nome).toBe('João Silva');
    expect(usuario.email).toBe('joao@email.com');
  });

  test('Deve encontrar usuário por email', () => {
    const dados = {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: 'Senha123',
      cpf: '123.456.789-01'
    };
    
    UsuarioModel.create(dados);
    const encontrado = UsuarioModel.findByEmail('maria@email.com');
    
    expect(encontrado).toBeDefined();
    expect(encontrado?.nome).toBe('Maria Silva');
  });

  test('Deve retornar undefined para email não existente', () => {
    const encontrado = UsuarioModel.findByEmail('naoexiste@email.com');
    expect(encontrado).toBeUndefined();
  });

  test('Deve listar usuários com paginação', () => {
    // Criar 15 usuários
    for (let i = 1; i <= 15; i++) {
      UsuarioModel.create({
        nome: `Usuário ${i}`,
        email: `usuario${i}@email.com`,
        senha: 'Senha123',
        cpf: `123.456.789-${String(i).padStart(2, '0')}`
      });
    }
    
    const pagina1 = UsuarioModel.paginate(1, 10);
    expect(pagina1.data.length).toBe(10);
    expect(pagina1.total).toBe(15);
    expect(pagina1.totalPages).toBe(2);
    
    const pagina2 = UsuarioModel.paginate(2, 10);
    expect(pagina2.data.length).toBe(5);
  });
});