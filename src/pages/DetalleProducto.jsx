import React from 'react'
import styles from './detalle.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import Header from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'


const imagenesTemp = [
  'https://cars.usnews.com/static/images/Auto/izmo/i159828495/2023_toyota_corolla_angularfront.jpg',
  'https://cdn.motor1.com/images/mgl/0ANr0/s1/2022-bmw-3-series-front.jpg',
  'https://cdn.motor1.com/images/mgl/0ANR0/s1/2022-bmw-3-series-rear.jpg',
  'https://cdn.motor1.com/images/mgl/6NZXk/s1/tesla-model-3.jpg',
  'https://cdn.motor1.com/images/mgl/kjP47/s1/ford-f-150-lariat-2021.jpg',
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


export const DetalleProducto = () => {


    const { id } = useParams();
    const navigate = useNavigate();
    const producto = productosIniciales.find(p => p.id === parseInt(id));
    
    const [imagenPrincipal, setImagenPrincipal] = useState(imagenesTemp[0]); 
    
    if(!producto) {
        return (
            <div style={{padding: '2rem', textAlign: 'center'}}>
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/')} className={styles.btnVolver}></button>
        </div>
        );
    }
    
    
    
  return (
    <>
    <Header />
  
    <div className={styles.container}>
      <h1 className={styles.nombre}>{producto.nombre}</h1>
      <p className={styles.descripcion}>{producto.descripcion}</p>

      <div className={styles.galeria}>
        <div className={styles.imagenPrincipal}>
          <img src={imagenPrincipal} alt={`Imagen principal de ${producto.name}`} />
        </div>
        <div className={styles.imagenesSecundarias}>
          {imagenesTemp.slice(1).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Imagen ${idx + 2} de ${producto.name}`}
              onClick={() => setImagenPrincipal(img)}
              className={img === imagenPrincipal ? styles.selected : ''}
            />
          ))}
        </div>
      </div>

      <div className={styles.verMas}>
        <button onClick={() => alert('Mostrar galería completa (por implementar)')}>
          Ver Más Imágenes
        </button>
      </div>
    </div>
     <Footer />
    </>
  );
};


