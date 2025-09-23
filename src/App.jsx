import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Adminpage } from './pages/Adminpage.jsx';
import Home from './pagesUser/Home.jsx';
import { AgregarProductos } from './pages/AgregarProductos.jsx';
import { DetalleProducto } from './pagesUser/DetalleProducto.jsx';
import { ListaProductos } from './pages/ListaProductos.jsx';
import { AgregarCategoria } from './pages/AgregarCategoria.jsx';
import { AdministrarCaracteristicas } from './pages/AdministrarCaracteristicas.jsx';
import { EditarProducto } from './pages/EditarProducto.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pagesUser/RegisterPage.jsx';
import { ProfilePage } from './pagesUser/ProfilePage.jsx';
import { FavoritosPage } from './pagesUser/FavoritosPage.jsx';
import { MisReservasPage } from './pagesUser/MisReservasPage.jsx';
import { PrivateRoute } from './pages/PrivateRoute.jsx';
import { AdministrarPermisos } from './pages/AdministrarPermisos.jsx';

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/favoritos" element={<PrivateRoute><FavoritosPage /></PrivateRoute>} />
        <Route path="/mis-reservas" element={<PrivateRoute><MisReservasPage /></PrivateRoute>} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/EditarProducto/:id" element={<EditarProducto />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRoles={["ADMIN", "USER"]}>
              <Adminpage />
            </PrivateRoute>
          }
        />
        <Route
          path="/AgregarProductos"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AgregarProductos />
            </PrivateRoute>
          }
        />
        <Route
          path="/ListaProductos"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <ListaProductos />
            </PrivateRoute>
          }
        />
        <Route
          path="/AgregarCategoria"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AgregarCategoria />
            </PrivateRoute>
          }
        />
        <Route
          path="/AdministrarCaracteristicas"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdministrarCaracteristicas />
            </PrivateRoute>
          }
        />
        <Route
          path="/AdministrarPermisos"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdministrarPermisos />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
