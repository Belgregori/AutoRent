import React from 'react'
import styles from './footer.module.css'

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.bloqueizq}>
                <p>🚗 AutoRent - "Kilómetros de confianza"</p>
                <small>&copy; {new Date().getFullYear()} AutoRent. Todos los derechos reservados.</small>
            </div>
        </footer>
    )
}


