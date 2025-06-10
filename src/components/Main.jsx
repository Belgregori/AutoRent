import React from 'react'
import styles from './Main.module.css'


export const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.welcomeContainer}>
      <div className={styles.buscador}>
        <p>Buscador</p>
        <input type="text" placeholder="Buscar productos..." />
      </div>

      <div className={styles.categorias}>
        <p>Categorias</p>
      </div>

      <div className={styles.recomendaciones}>
        <p>Recomendaciones</p>
      </div>
      </div>

    </main>
  )
}
