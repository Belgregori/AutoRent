import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Main } from '../components/Main';
import { Footer } from '../components/Footer';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarAleatorios, setMostrarAleatorios] = useState(false);

  useEffect(() => {
    // Solo mostrar productos aleatorios si es la primera visita (no después de login ni regreso)
    const yaMostrado = sessionStorage.getItem('productosAleatoriosMostrados');
    if (!yaMostrado) {
      fetch('/api/productos/random?cantidad=10')
        .then(res => res.json())
        .then(data => {
          setProductos(Array.isArray(data) ? data : []);
          setMostrarAleatorios(true);
          sessionStorage.setItem('productosAleatoriosMostrados', 'true');
        })
        .catch(() => setProductos([]));
    }
  }, []);

  return (
    <>
      <Header />
      <Main>
        {mostrarAleatorios && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto',
              marginTop: '32px'
            }}
          >
            {productos.map(producto => (
              <div
                key={producto.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 200,
                  justifyContent: 'center',
                }}
              >
                <h2>{producto.nombre}</h2>
                <p>{producto.descripcion}</p>
                <p><b>Precio:</b> ${producto.precio}</p>
                <p><b>Categoría:</b> {producto.categoria}</p>
                {producto.imagenData && (
                  <img
                    src={`data:image/jpeg;base64,${producto.imagenData}`}
                    alt={producto.nombre}
                    style={{ width: 120, height: 80, objectFit: 'cover', marginTop: 8 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Main>
      <Footer />
    </>
  );
};


export default Home;