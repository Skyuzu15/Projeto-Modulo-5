import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Produto } from '../types';

const ProdutosCRUD: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: ''
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const limparFormulario = () => {
    setFormData({ nome: '', descricao: '', preco: '', quantidade: '', categoria: '' });
    setEditandoId(null);
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const dados = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      categoria: formData.categoria
    };

    if (isNaN(dados.preco) || dados.preco <= 0) {
      setErro('Preço deve ser um número maior que zero');
      return;
    }

    if (isNaN(dados.quantidade) || dados.quantidade < 0) {
      setErro('Quantidade deve ser um número não negativo');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, dados);
        setSucesso('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', dados);
        setSucesso('Produto cadastrado com sucesso!');
      }
      limparFormulario();
      carregarProdutos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar produto');
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
    setErro('');
    setSucesso('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        setSucesso('Produto excluído com sucesso!');
        carregarProdutos();
      } catch (error: any) {
        setErro(error.response?.data?.error || 'Erro ao excluir produto');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>📦 CRUD de Produtos</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <input
            type="text"
            placeholder="Nome do Produto *"
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
            placeholder="Descrição do produto"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            style={styles.textarea}
            rows={3}
          />
        </div>
        
        {erro && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>{sucesso}</div>}
        
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.buttonSalvar}>
            {editandoId ? '✏️ Atualizar' : '💾 Cadastrar'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} style={styles.buttonCancelar}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>ID</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.id} style={styles.tableRow}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.categoria}</td>
              <td>R$ {produto.preco.toFixed(2)}</td>
              <td>{produto.quantidade}</td>
              <td>
                <button onClick={() => handleEdit(produto)} style={styles.buttonEdit}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleDelete(produto.id)} style={styles.buttonDelete}>
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '15px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    gridColumn: '1 / -1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  buttonSalvar: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonCancelar: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonEdit: {
    padding: '5px 10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  buttonDelete: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ddd'
  },
  tableRow: {
    borderBottom: '1px solid #ddd'
  },
  erro: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  sucesso: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px'
  }
};

export default ProdutosCRUD;