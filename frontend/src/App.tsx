import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Dashboard from './components/Dashboard';
import EditarPerfil from './components/EditarPerfil';
import ProdutosList from './components/ProdutosList';
import PedidosList from './components/PedidosList';
import Navbar from './components/Navbar';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/editar-perfil" element={
        <PrivateRoute>
          <EditarPerfil />
        </PrivateRoute>
      } />
      <Route path="/produtos" element={
        <PrivateRoute>
          <ProdutosList />
        </PrivateRoute>
      } />
      <Route path="/pedidos" element={
        <PrivateRoute>
          <PedidosList />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;