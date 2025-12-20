import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './favoritos.module.css';
import Header from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { UserNavControls } from '../components/UserNavControls.jsx';
import { useFavoritos } from '../hooks/useFavoritos.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { NotificationContainer } from '../components/Notification.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';

export const FavoritosPage = () => {
  const navigate = useNavigate();
  const { 
    favoritos, 
    isLoading, 
    error, 
    eliminarFavorito, 
    setError 
  } = useFavoritos();
  
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  const [eliminandoId, setEliminandoId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    producto: null
  });

  const confirmarEliminacion = (producto) => {
    setConfirmDialog({
      isOpen: true,
      producto
    });
  };

  const handleConfirmarEliminacion = () => {
    if (confirmDialog.producto) {
      handleEliminarFavorito(confirmDialog.producto.favoritoId);
    }
    setConfirmDialog({ isOpen: false, producto: null });
  };

  const handleCancelarEliminacion = () => {
    setConfirmDialog({ isOpen: false, producto: null });
  };

  const handleEliminarFavorito = async (favoritoId) => {
    setEliminandoId(favoritoId);

    try {
      const success = await eliminarFavorito(favoritoId);
      
      if (success) {
        showSuccess('Favorito eliminado correctamente');
      } else {
        showError('Error al eliminar favorito');
      }
    } catch (error) {
      showError('Error de conexión al eliminar favorito');
    } finally {
      setEliminandoId(null);
    }
  };

  const transformProducto = (favorito) => {
    const producto = favorito.producto;
    if (!producto) return null;

    const imagenesData = producto.imagenesData || [];
    let imagenUrl = '';
    
    if (imagenesData.length > 0) {
      imagenUrl = `data:image/jpeg;base64,${imagenesData[0]}`;
    } else if (producto.imagenUrl) {
      imagenUrl = producto.imagenUrl;
    }

    return {
      id: String(producto.id),
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: Number(producto.precio || 0).toFixed(2),
      disponible: Boolean(producto.disponible),
      imagenUrl,
      favoritoId: favorito.id
    };
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando favoritos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Error al cargar favoritos</h2>
            <p className={styles.errorMessage}>{error}</p>
            
            {error.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') && (
              <div className={styles.errorDetails}>
                <p><strong>Problema detectado:</strong> El servidor está cortando la conexión antes de completar la respuesta.</p>
                <p><strong>Solución:</strong> Intenta recargar la página o contacta al administrador.</p>
              </div>
            )}
            
            <div className={styles.errorActions}>
              <button onClick={() => setError(null)} className={styles.retryButton}>
                🔄 Reintentar
              </button>
              <button onClick={() => window.location.reload()} className={styles.reloadButton}>
                🔄 Recargar Página
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productosTransformados = favoritos
    .map(transformProducto)
    .filter(p => p !== null);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Favoritos</h1>
          <p className={styles.subtitle}>
            {productosTransformados.length === 0 
              ? 'No tienes favoritos aún' 
              : `${productosTransformados.length} ${productosTransformados.length === 1 ? 'auto favorito' : 'autos favoritos'}`
            }
          </p>
        </div>

        {productosTransformados.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🤍</div>
            <h2>No tienes favoritos</h2>
            <p>Explora nuestros autos y marca como favoritos los que más te gusten</p>
            <button 
              onClick={() => navigate('/')} 
              className={styles.explorarButton}
            >
              Explorar Autos
            </button>
          </div>
        ) : (
          <div className={styles.favoritosGrid}>
            {productosTransformados.map(producto => (
              <div key={producto.id} className={styles.productoCard}>
                <div className={styles.productoImagen}>
                  {producto.imagenUrl ? (
                    <img 
                      src={producto.imagenUrl} 
                      alt={producto.nombre} 
                      className={styles.productoImagenImg} 
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.productoIconPlaceholder}>
                      <span className={styles.productoIcon}>🚗</span>
                    </div>
                  )}
                  
                  <div className={styles.disponibilidadBadge}>
                    <span className={producto.disponible ? styles.disponible : styles.noDisponible}>
                      {producto.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>

                  <button
                    className={`${styles.eliminarFavoritoButton} ${eliminandoId === producto.favoritoId ? styles.eliminando : ''}`}
                    onClick={() => confirmarEliminacion(producto)}
                    title="Eliminar de favoritos"
                    disabled={eliminandoId === producto.favoritoId}
                  >
                    {eliminandoId === producto.favoritoId ? (
                      <div className={styles.miniSpinner}></div>
                    ) : (
                      '❌'
                    )}
                  </button>
                </div>
                
                <div className={styles.productoInfo}>
                  <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                  <p className={styles.productoCategoria}>
                    {producto.categoria ? producto.categoria.nombre || producto.categoria : 'Sin categoría'}
                  </p>
                  <div className={styles.productoPrecio}>
                    <span className={styles.precio}>${producto.precio}</span>
                    <span className={styles.periodo}>/día</span>
                  </div>
                  <div className={styles.productoAcciones}>
                    <button 
                      className={styles.verDetalleButton} 
                      onClick={() => navigate(`/producto/${producto.id}`)}
                    >
                      Ver Detalle
                    </button>
                    <button 
                      className={styles.reservarButton} 
                      onClick={() => navigate(`/producto/${producto.id}#reservar`)}
                      disabled={!producto.disponible}
                    >
                      {producto.disponible ? 'Reservar' : 'No Disponible'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <UserNavControls />
      <Footer />
      
      {/* Sistema de notificaciones */}
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
      
      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar Favorito"
        message={`¿Estás seguro de que quieres eliminar "${confirmDialog.producto?.nombre}" de tus favoritos?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="warning"
        onConfirm={handleConfirmarEliminacion}
        onCancel={handleCancelarEliminacion}
      />
    </>
  );
};
