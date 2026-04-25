import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EditarPerfil: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cpf: user?.cpf || '',
    senha: '',
    confirmarSenha: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const validarCPF = (cpf: string) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
  };

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!validarCPF(formData.cpf)) {
      setErro('CPF inválido');
      return;
    }

    if (formData.senha && !validarSenha(formData.senha)) {
      setErro('Senha deve ter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }

    try {
      const dados: any = {
        nome: formData.nome,
        cpf: formData.cpf
      };
      
      if (formData.senha) {
        dados.senha = formData.senha;
      }
      
      const response = await api.put(`/usuarios/${user?.id}`, dados);
      updateUser(response.data);
      setSucesso('Perfil atualizado com sucesso!');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao atualizar');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Nome</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.field}>
          <label>Email (não pode ser alterado)</label>
          <input
            type="email"
            value={user?.email}
            disabled
            style={{ ...styles.input, backgroundColor: '#f0f0f0' }}
          />
        </div>
        
        <div style={styles.field}>
          <label>CPF</label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.field}>
          <label>Nova Senha (opcional)</label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            style={styles.input}
          />
        </div>
        
        <div style={styles.field}>
          <label>Confirmar Nova Senha</label>
          <input
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
            style={styles.input}
          />
        </div>
        
        {erro && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>{sucesso}</div>}
        
        <button type="submit" style={styles.button}>Salvar Alterações</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  erro: {
    color: 'red',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  },
  sucesso: {
    color: 'green',
    padding: '10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px'
  }
};

export default EditarPerfil;