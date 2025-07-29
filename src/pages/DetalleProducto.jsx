import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './detalle.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetch(`/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        const imagenesFinal = data.imagenesData?.map(img => `data:image/jpeg;base64,${img}`) || [];
        setImagenes(imagenesFinal);
        setImagenPrincipal(imagenesFinal[0]);
      });
  }, [id]);

  if (!producto) {
    return (
      <div className={styles.container}>
        <h2>Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.nombre}>{producto.nombre.toUpperCase()}</h1>
        <p className={styles.descripcion}>{producto.descripcion}</p>
        <p className={styles.precio}>${producto.precio.toFixed(2)}</p>

        <div className={styles.galeria}>

          <div className={styles.imagenPrincipal}>
            <img src={imagenPrincipal} alt={`Imagen principal de ${producto.nombre}`} />
          </div>
          <div className={styles.imagenesSecundarias}>
            {imagenes.slice(1, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Imagen ${idx + 2} de ${producto.nombre}`}
                onClick={() => setImagenPrincipal(img)}
                className={img === imagenPrincipal ? styles.selected : ''}
              />
            ))}
          </div>
        </div>
        <div className={styles.flechaVolver} onClick={() => navigate(-1)}>← Volver</div>
        <div className={styles.verMas}>
          <button onClick={() => setModalAbierto(true)}>Ver Más Imágenes</button>
        </div>
        {modalAbierto && (
          <div className={styles.modalOverlay} onClick={() => setModalAbierto(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>Galería completa</h2>
              <div className={styles.modalGaleria}>
                {imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Imagen ${idx + 1} de ${producto.nombre}`}
                    onClick={() => setImagenPrincipal(img)}
                    className={img === imagenPrincipal ? styles.selected : ''}
                  />
                ))}
              </div>
              <button className={styles.cerrarModal} onClick={() => setModalAbierto(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

