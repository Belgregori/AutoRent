import styles from './Header.module.css';

function Header() { //componente
  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={goHome}>
        <img src="/logo.png" alt="AutoRent logo" className={styles.logo} />
        <span className={styles.slogan}>Kilómetros de confianza</span>
      </div>
      <nav className={styles.navBar}>
        <button  className={styles.Button}>Crear cuenta</button>
        <button  className={styles.Button}>Iniciar sesión</button>
        
      </nav>
    </header>
  );
}

export default Header;


