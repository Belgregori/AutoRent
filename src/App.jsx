import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Adminpage } from './pages/Adminpage.jsx';
import { Home } from './pages/Home.jsx';
import { AgregarProductos } from './pages/AgregarProductos.jsx';




function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Adminpage />} />
        <Route path="/AgregarProductos" element={<AgregarProductos />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;