import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  status: string;
  createdAt: string;
  produto?: Produto;
}

const PedidosList: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    produtoId: '',
    quantidade: ''
  });
  const [erro, setErro] = useState('');

  const carregarPedidos = async () => {
    try {
      const response = await api.get(`/pedidos?page=${page}&limit=5`);
      setPedidos(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos?limit=100');
      setProdutos(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    carregarPedidos();
    carregarProdutos();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.produtoId || !formData.quantidade) {
      setErro('Produto e quantidade são obrigatórios');
      return;
    }

    const quantidadeNum = parseInt(formData.quantidade);
    if (quantidadeNum <= 0) {
      setErro('Quantidade deve ser maior que zero');
      return;
    }

    try {
      await api.post('/pedidos', {
        produtoId: parseInt(formData.produtoId),
        quantidade: quantidadeNum
      });
      setShowForm(false);
      setFormData({ produtoId: '', quantidade: '' });
      carregarPedidos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao criar pedido');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/pedidos/${id}/status`, { status });
      carregarPedidos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        carregarPedidos();
      } catch (error: any) {
        setErro(error.response?.data?.error || 'Erro ao excluir pedido');
      }
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pendente: '#ff9800',
      aprovado: '#2196F3',
      enviado: '#9c27b0',
      entregue: '#4CAF50',
      cancelado: '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🛒 Meus Pedidos</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.buttonNovo}>
          {showForm ? '❌ Cancelar' : '+ Novo Pedido'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            value={formData.produtoId}
            onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
            style={styles.select}
            required
          >
            <option value="">Selecione o Produto</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} - R$ {produto.preco.toFixed(2)} (Estoque: {produto.quantidade})
              </option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Quantidade"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            style={styles.input}
            required
          />
          
          {erro && <div style={styles.erro}>{erro}</div>}
          
          <button type="submit" style={styles.buttonSalvar}>
            💾 Criar Pedido
          </button>
        </form>
      )}

      {pedidos.length === 0 ? (
        <div style={styles.vazio}>
          <p>Nenhum pedido encontrado.</p>
          <p>Clique em "Novo Pedido" para criar seu primeiro pedido!</p>
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>ID</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id} style={styles.tableRow}>
                  <td>{pedido.id}</td>
                  <td>
                    {pedido.produto?.nome || '-'}<br/>
                    <small>R$ {pedido.produto?.preco.toFixed(2)}</small>
                  </td>
                  <td>{pedido.quantidade}</td>
                  <td>R$ {pedido.valorTotal.toFixed(2)}</td>
                  <td>
                    <select
                      value={pedido.status}
                      onChange={(e) => handleUpdateStatus(pedido.id, e.target.value)}
                      style={{
                        ...styles.statusSelect,
                        backgroundColor: getStatusColor(pedido.status)
                      }}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button onClick={() => handleDelete(pedido.id)} style={styles.buttonDelete}>
                      🗑️ Excluir
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
              ◀ Anterior
            </button>
            <span style={styles.pageInfo}>Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={styles.pageButton}
            >
              Próxima ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  buttonNovo: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  form: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    flexDirection: 'column' as const
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  buttonSalvar: {
    padding: '10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  buttonDelete: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  statusSelect: {
    padding: '5px',
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '12px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left' as const
  },
  tableRow: {
    borderBottom: '1px solid #ddd'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
    alignItems: 'center'
  },
  pageButton: {
    padding: '5px 10px',
    backgroundColor: '#ddd',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  pageInfo: {
    fontSize: '14px'
  },
  erro: {
    color: 'red',
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  },
  vazio: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666'
  }
};

export default PedidosList;