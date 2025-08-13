import styles from './Header.module.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const apellido = localStorage.getItem('apellido');
    const email = localStorage.getItem('email');
    if (token && (nombre || email)) {
      setUser({ nombre, apellido, email });
    } else {
      setUser(null);
    }
  }, []);

  const initials = useMemo(() => {
    if (!user) return '';
    const n = (user.nombre || '').trim();
    const a = (user.apellido || '').trim();
    const first = n ? n[0].toUpperCase() : '';
    const last = a ? a[0].toUpperCase() : '';
    return `${first}${last || (first ? '' : (user.email || 'U')[0].toUpperCase())}`;
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    setUser(null);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={goHome}>
        <img src="/logo.png" alt="AutoRent logo" className={styles.logo} />
        <span className={styles.slogan}>Kilómetros de confianza</span>
      </div>
      <nav className={styles.navBar}>
        {!user && (
          <>
            <button className={styles.Button} onClick={() => navigate('/register')}>Crear cuenta</button>
            <button className={styles.Button} onClick={() => navigate('/login')}>Iniciar sesión</button>
          </>
        )}
        {user && (
          <div className={styles.userArea}>
            <div className={styles.avatar} onClick={() => navigate('/profile')} title={`${user.nombre || ''} ${user.apellido || ''}`}>
              {initials}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.nombre || user.email}</div>
              <button className={styles.logoutButton} onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;


