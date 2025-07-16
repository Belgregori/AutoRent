import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Adminpage } from './pages/Adminpage.jsx';
import Home from './pages/Home.jsx';
import { AgregarProductos } from './pages/AgregarProductos.jsx';
import { DetalleProducto } from './pages/DetalleProducto.jsx';
import { ListaProductos } from './pages/ListaProductos.jsx';
import { AgregarCategoria } from './pages/AgregarCategoria.jsx';
import { AdministrarCaracteristicas } from './pages/AdministrarCaracteristicas.jsx';
import { EditarProducto } from './pages/EditarProducto.jsx';
import { LoginPage } from './pages/LoginPage.jsx';

import { PrivateRoute } from './pages/PrivateRoute.jsx';

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/EditarProducto/:id" element={<EditarProducto />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Adminpage />
            </PrivateRoute>
          }
        />
        <Route
          path="/AgregarProductos"
          element={
            <PrivateRoute>
              <AgregarProductos />
            </PrivateRoute>
          }
        />
        <Route
          path="/ListaProductos"
          element={
            <PrivateRoute>
              <ListaProductos />
            </PrivateRoute>
          }
        />
        <Route
          path="/AgregarCategoria"
          element={
            <PrivateRoute>
              <AgregarCategoria />
            </PrivateRoute>
          }
        />
        <Route
          path="/AdministrarCaracteristicas"
          element={
            <PrivateRoute>
              <AdministrarCaracteristicas />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;