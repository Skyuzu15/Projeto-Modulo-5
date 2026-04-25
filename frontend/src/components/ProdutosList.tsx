import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoria: string;
}

const ProdutosList: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: ''
  });
  const [erro, setErro] = useState('');

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/produtos?page=${page}&limit=5`);
      setProdutos(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarProdutos();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const dados = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      categoria: formData.categoria
    };

    if (isNaN(dados.preco) || dados.preco <= 0) {
      setErro('Preço deve ser maior que zero');
      return;
    }

    if (isNaN(dados.quantidade) || dados.quantidade < 0) {
      setErro('Quantidade não pode ser negativa');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, dados);
      } else {
        await api.post('/produtos', dados);
      }
      setShowForm(false);
      setEditandoId(null);
      setFormData({ nome: '', descricao: '', preco: '', quantidade: '', categoria: '' });
      carregarProdutos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleEdit = (produto: Produto) => {
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      quantidade: produto.quantidade.toString(),
      categoria: produto.categoria
    });
    setEditandoId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza?')) {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Produtos</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.buttonNovo}>
          {showForm ? 'Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nome *"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Preço *"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
            style={styles.input}
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Quantidade *"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            style={styles.textarea}
          />
          {erro && <div style={styles.erro}>{erro}</div>}
          <button type="submit" style={styles.buttonSalvar}>
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td>{produto.quantidade}</td>
                  <td>
                    <button onClick={() => handleEdit(produto)} style={styles.buttonEdit}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(produto.id)} style={styles.buttonDelete}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={styles.pageButton}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={styles.pageButton}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  buttonNovo: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  input: { padding: '10px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px', width: '100%' },
  textarea: { padding: '10px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px', width: '100%' },
  buttonSalvar: { padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  buttonEdit: { padding: '5px 10px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  buttonDelete: { padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  pagination: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', alignItems: 'center' },
  pageButton: { padding: '5px 10px', backgroundColor: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  erro: { color: 'red', margin: '10px 0' }
};

export default ProdutosList;