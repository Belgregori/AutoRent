import React, { useState, useEffect } from 'react'
import styles from './Main.module.css'
import { useNavigate } from 'react-router-dom';


const categorias = [
  { id: 1, name: 'Económicos', count: 15, icon: '🚗' },
  { id: 2, name: 'Lujo', count: 10, icon: '🏎️' },
  { id: 3, name: 'Familiares', count: 8, icon: '🚐' },
  { id: 4, name: 'Deportivos', count: 5, icon: '🏁' },
  { id: 5, name: 'Electricos', count: 3, icon: '⚡' },
  { id: 6, name: 'Camionetas', count: 4, icon: '🚚' },
];

const productosIniciales = [
  {
    id: 1,
    nombre: 'Toyota Corolla',
    imagen: '🚗',
    precio: 35,
    calificacion: 4.5,
    categoria: 'Económico',
    año: 2023,
    disponible: true
  },
  {
    id: 2,
    nombre: 'BMW Serie 3',
    imagen: '🏎️',
    precio: 70,
    calificacion: 4.8,
    categoria: 'Lujo',
    año: 2022,
    disponible: true
  },
  {
    id: 3,
    nombre: 'Ford F-150',
    imagen: '🚚',
    precio: 60,
    calificacion: 4.6,
    categoria: 'Camioneta',
    año: 2021,
    disponible: false
  },
  {
    id: 4,
    nombre: 'Tesla Model 3',
    imagen: '⚡',
    precio: 80,
    calificacion: 4.9,
    categoria: 'Eléctrico',
    año: 2023,
    disponible: true
  },
  {
    id: 5,
    nombre: 'Chevrolet Tahoe',
    imagen: '🚐',
    precio: 90,
    calificacion: 4.7,
    categoria: 'Familiar',
    año: 2022,
    disponible: true
  },
  {
    id: 6,
    nombre: 'Porsche 911',
    imagen: '🏁',
    precio: 150,
    calificacion: 5.0,
    categoria: 'Deportivo',
    año: 2023,
    disponible: true
  },
  {
    id: 7,
    nombre: 'Honda Civic',
    imagen: '🚗',
    precio: 30,
    calificacion: 4.4,
    categoria: 'Económico',
    año: 2020,
    disponible: true
  },
  {
    id: 8,
    nombre: 'Audi A4',
    imagen: '🏎️',
    precio: 75,
    calificacion: 4.7,
    categoria: 'Lujo',
    año: 2021,
    disponible: false
  },
  { id: 9,
    nombre: 'Nissan Leaf',
    imagen: '⚡',
    precio: 55,
    calificacion: 4.5,
    categoria: 'Eléctrico',
    año: 2022,
    disponible: true
  },
  {
    id: 10,
    nombre: 'Toyota RAV4',
    imagen: '🚚',
    precio: 65,
    calificacion: 4.6,
    categoria: 'Camioneta',
    año: 2023,
    disponible: true  
  }
]



export const Main = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {

    const productosAleatorios = [...productosIniciales]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setProductos(productosAleatorios);
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    console.log('Busqueda:', { busqueda, fechaInicio, fechaFin, ubicacion });

  };

  return (
    <main className={styles.main}>
      <div className={styles.welcomeContainer}>
        <div className={styles.buscador}>
          <h1>Encontrá el auto perfecto para vos</h1>
          <p className={styles.Subtitle}>Alquila vehículos de calidad al mejor precio, cuando y donde lo necesites</p>

          <form className={styles.buscadorForm} onSubmit={handleBuscar}>
            <div className={styles.inputGroup}>
              <label htmlFor="busqueda">Que tipo de auto buscas?</label>
              <input
                type="text"
                id="busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej: Sedan, Deportivo..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="fechaInicio">Fecha de inicio</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="fechaFin">Fecha de fin</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                type="text"
                id="ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej: Ciudad, Provincia..."
              />
            </div>

            <button type="submit" className={styles.searchButton}>🔍 Buscar Autos </button>
          </form>
        </div>
      </div >



      <div className={styles.categorias}>

        <p>Categorias</p>
        <p className={styles.sectionSubtitle}>Explora tu tipo de vehículo</p>

        <div className={styles.categoriasGrid}>
          {categorias.map((categoria) => (
            <div key={categoria.id} className={styles.categoriaCard}>
              <span className={styles.categoriaIcon}>{categoria.icon}</span>
              <h3>{categoria.name}</h3>
              <p>{categoria.count} vehículos disponibles</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.recomendaciones}>
        <p>Recomendaciones</p>
        <p className={styles.sectionSubtitle}>Vehículos seleccionados especialmente en tu primera visita</p>
      </div>

      <div className={styles.productosGrid}>
        {productos.map((producto) => (
          <div key={producto.id} className={styles.productoCard}>
            <div className={styles.productoImagen}>
              <span className={styles.productoIcon}>🚗</span>
              <div className={styles.disponibilidadBadge}>
                <span className={producto.disponible ? styles.
                  disponible : styles.noDisponible}>
                  {producto.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>

            <div className={styles.productoInfo}>
              <h3 className={styles.productoNombre}>{producto.name}</h3>
              <p className={styles.productoCategoria}>{producto.category}</p>
              <div className={styles.productoCalificacion}>
                <span className={styles.estrella}>⭐</span>
                <span>{producto.calificacion}</span>
                <span className={styles.reseñas}>(48+ reseñas)</span>
              </div>

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
                  disabled={!producto.disponible}
                >
                  {producto.disponible ? '📅 Reservar' : 'No Disponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.verMasContainer}>
        <button className={styles.verMasButton}>
          Ver Más Vehículos
        </button>
      </div>
   

   </main >
 );
}