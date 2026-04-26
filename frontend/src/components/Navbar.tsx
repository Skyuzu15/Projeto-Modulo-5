import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/produtos', label: '📦 Produtos', icon: '📦' },
    { path: '/pedidos', label: '🛒 Pedidos', icon: '🛒' },
    { path: '/editar-perfil', label: '👤 Editar Perfil', icon: '👤' },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/dashboard')}>
        <span style={styles.logoIcon}>🚀</span>
        <span style={styles.logoText}>MeuSistema</span>
      </div>

      <div style={styles.navLinks}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navButton,
              ...(location.pathname === item.path ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.userInfo}>
        <span style={styles.userName}>👋 {user?.nome?.split(' ')[0]}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Sair
        </button>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: '0 20px',
    height: '60px',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '18px'
  },
  navLinks: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
    fontWeight: 'normal'
  },
  navButtonActive: {
    backgroundColor: '#3498db',
    fontWeight: 'bold'
  },
  navIcon: {
    fontSize: '18px'
  },
  navLabel: {
    display: 'none',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userName: {
    fontSize: '14px',
    color: '#ecf0f1'
  },
  logoutButton: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  }
};

// Media query para telas maiores
if (window.innerWidth > 768) {
  styles.navLabel = { ...styles.navLabel, display: 'inline' };
  styles.navButton = { ...styles.navButton, padding: '8px 20px' };
}

export default Navbar;