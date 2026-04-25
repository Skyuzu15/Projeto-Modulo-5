import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pedido, Usuario, Produto } from '../types';

const PedidosCRUD: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formData, setFormData] = useState({
    usuarioId: '',
    produtoId: '',
    quantidade: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [pedidosRes, usuariosRes, produtosRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/usuarios'),
        api.get('/produtos')
      ]);
      setPedidos(pedidosRes.data);
      setUsuarios(usuariosRes.data);
      setProdutos(produtosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const dados = {
      usuarioId: parseInt(formData.usuarioId),
      produtoId: parseInt(formData.produtoId),
      quantidade: parseInt(formData.quantidade)
    };

    if (isNaN(dados.quantidade) || dados.quantidade <= 0) {
      setErro('Quantidade deve ser maior que zero');
      return;
    }

    try {
      await api.post('/pedidos', dados);
      setSucesso('Pedido criado com sucesso!');
      setFormData({ usuarioId: '', produtoId: '', quantidade: '' });
      carregarDados();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao criar pedido');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/pedidos/${id}/status`, { status });
      setSucesso('Status atualizado com sucesso!');
      carregarDados();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        setSucesso('Pedido excluído com sucesso!');
        carregarDados();
      } catch (error: any) {
        setErro(error.response?.data?.error || 'Erro ao excluir pedido');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: '#ff9800',
      aprovado: '#2196F3',
      enviado: '#9c27b0',
      entregue: '#4CAF50',
      cancelado: '#f44336'
    };
    return colors[status as keyof typeof colors] || '#666';
  };

  return (
    <div style={styles.container}>
      <h2>🛒 CRUD de Pedidos</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <select
            value={formData.usuarioId}
            onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
            style={styles.select}
            required
          >
            <option value="">Selecione o Usuário</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome} - {usuario.email}
              </option>
            ))}
          </select>

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
            placeholder="Quantidade *"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            style={styles.input}
            required
          />
        </div>
        
        {erro && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>{sucesso}</div>}
        
        <button type="submit" style={styles.buttonSalvar}>
          💾 Criar Pedido
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>ID</th>
            <th>Usuário</th>
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
              <td>{pedido.usuario?.nome || '-'}<br/>
                <small>{pedido.usuario?.email}</small>
              </td>
              <td>{pedido.produto?.nome || '-'}<br/>
                <small>R$ {pedido.produto?.preco.toFixed(2)}</small>
              </td>
              <td>{pedido.quantidade}</td>
              <td>R$ {pedido.valorTotal.toFixed(2)}</td>
              <td>
                <select
                  value={pedido.status}
                  onChange={(e) => handleUpdateStatus(pedido.id, e.target.value)}
                  style={{ ...styles.statusSelect, backgroundColor: getStatusColor(pedido.status) }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</td>
              <td>
                <button onClick={() => handleDelete(pedido.id)} style={styles.buttonDelete}>
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
  formGroup: {
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
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  buttonSalvar: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonDelete: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  statusSelect: {
    padding: '5px',
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px'
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

export default PedidosCRUD;