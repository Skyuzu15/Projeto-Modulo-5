import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: ''
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

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

    if (!validarCPF(formData.cpf)) {
      setErro('CPF inválido. Use formato: 000.000.000-00');
      return;
    }

    if (!validarSenha(formData.senha)) {
      setErro('Senha deve ter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('Senhas não conferem');
      return;
    }

    try {
      await api.post('/usuarios', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf
      });
      navigate('/login');
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="CPF (000.000.000-00)"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={formData.confirmarSenha}
            onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
            style={styles.input}
            required
          />
          {erro && <div style={styles.erro}>{erro}</div>}
          <button type="submit" style={styles.button}>Cadastrar</button>
        </form>
        <button onClick={() => navigate('/login')} style={styles.linkButton}>
          Já tem conta? Faça login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '350px'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  linkButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#2196F3',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px'
  },
  erro: {
    color: 'red',
    margin: '10px 0',
    textAlign: 'center' as const
  }
};

export default Cadastro;