import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Adminpage } from './pages/Adminpage.jsx';
import Home from './pages/Home.jsx';
import { AgregarProductos } from './pages/AgregarProductos.jsx';
import { DetalleProducto } from './pages/DetalleProducto.jsx';
import { ListaProductos } from './pages/ListaProductos.jsx';
import { AgregarCategoria } from './pages/AgregarCategoria.jsx';
import { AdministrarCaracteristicas } from './pages/AdministrarCaracteristicas.jsx';


function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Adminpage />} />
        <Route path="/AgregarProductos" element={<AgregarProductos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/ListaProductos" element={<ListaProductos />} />
        <Route path="/AgregarCategoria" element={<AgregarCategoria />} />
        <Route path="/AdministrarCaracteristicas" element={<AdministrarCaracteristicas />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;