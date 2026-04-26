import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Bem-vindo, {user?.nome}!</h1>
        <p style={styles.subtitle}>Este é seu painel de controle</p>
      </div>
      
      <div style={styles.stats}>
        <div style={styles.card}>
          <h3>📊 Total de Produtos</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
        <div style={styles.card}>
          <h3>🛒 Total de Pedidos</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
      </div>

      <div style={styles.infoCard}>
        <h3>📋 Suas Informações</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>📧 Email:</span>
          <span>{user?.email}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>🆔 CPF:</span>
          <span>{user?.cpf}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>📱 Telefone:</span>
          <span>{user?.telefone || 'Não informado'}</span>
        </div>
        {user?.createdAt && (
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📅 Cadastrado em:</span>
            <span>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <div style={styles.quickActions}>
        <h3>⚡ Ações Rápidas</h3>
        <div style={styles.actionButtons}>
          <button onClick={() => window.location.href = '/produtos'} style={styles.actionButton}>
            ➕ Cadastrar Produto
          </button>
          <button onClick={() => window.location.href = '/pedidos'} style={styles.actionButton}>
            🛒 Novo Pedido
          </button>
          <button onClick={() => window.location.href = '/editar-perfil'} style={styles.actionButton}>
            ✏️ Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center' as const
  },
  subtitle: {
    color: '#666',
    marginTop: '10px'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  },
  cardNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: '10px'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  infoRow: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '10px'
  },
  infoLabel: {
    fontWeight: 'bold',
    width: '120px'
  },
  quickActions: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap' as const
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Dashboard;