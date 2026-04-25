import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Usuario } from '../types';

const UsuariosCRUD: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: ''
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const limparFormulario = () => {
    setFormData({ nome: '', email: '', cpf: '', telefone: '' });
    setEditandoId(null);
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, formData);
        setSucesso('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', formData);
        setSucesso('Usuário cadastrado com sucesso!');
      }
      limparFormulario();
      carregarUsuarios();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar usuário');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      telefone: usuario.telefone
    });
    setEditandoId(usuario.id);
    setErro('');
    setSucesso('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        setSucesso('Usuário excluído com sucesso!');
        carregarUsuarios();
      } catch (error: any) {
        setErro(error.response?.data?.error || 'Erro ao excluir usuário');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>👥 CRUD de Usuários</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Nome *"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="CPF * (000.000.000-00)"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Telefone (00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            style={styles.input}
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
            <th>Email</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} style={styles.tableRow}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.cpf}</td>
              <td>{usuario.telefone || '-'}</td>
              <td>
                <button onClick={() => handleEdit(usuario)} style={styles.buttonEdit}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleDelete(usuario.id)} style={styles.buttonDelete}>
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
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    marginBottom: '15px'
  },
  input: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
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
    cursor: 'pointer',
    fontSize: '14px'
  },
  buttonCancelar: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
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
    borderCollapse: 'collapse' as const,
    marginTop: '20px'
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ddd'
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
    textAlign: 'left' as const
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

export default UsuariosCRUD;