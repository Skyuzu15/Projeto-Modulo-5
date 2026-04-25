import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2>Bem-vindo, {user?.nome}!</h2>
        <div style={styles.navButtons}>
          <button onClick={() => navigate('/produtos')} style={styles.button}>
            📦 Produtos
          </button>
          <button onClick={() => navigate('/pedidos')} style={styles.button}>
            🛒 Pedidos
          </button>
          <button onClick={() => navigate('/editar-perfil')} style={styles.button}>
            👤 Editar Perfil
          </button>
          <button onClick={handleLogout} style={styles.buttonLogout}>
            🚪 Sair
          </button>
        </div>
      </nav>
      
      <div style={styles.content}>
        <h3>📊 Dashboard</h3>
        <div style={styles.infoCard}>
          <p><strong>📧 Email:</strong> {user?.email}</p>
          <p><strong>🆔 CPF:</strong> {user?.cpf}</p>
          <p><strong>📱 Telefone:</strong> {user?.telefone || 'Não informado'}</p>
          {user?.createdAt && (
            <p><strong>📅 Cadastrado em:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  nav: {
    backgroundColor: '#4CAF50',
    padding: '20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '10px'
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    transition: 'transform 0.2s'
  },
  buttonLogout: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    transition: 'transform 0.2s'
  },
  content: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '20px'
  }
};

export default Dashboard;