import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";
import styles from "./profile.module.css";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No hay sesión activa');
          setCargando(false);
          return;
        }

        // Obtener email del token para hacer la petición
        const email = localStorage.getItem('email');
        
        if (!email) {
          setError('No se encontró el email del usuario');
          setCargando(false);
          return;
        }

        // Intentar obtener datos del backend primero
        const response = await fetch(`/usuarios/${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setEmail(userData.email || "");
          setNombre(userData.nombre || "");
          setApellido(userData.apellido || "");
          // No cargar la contraseña por seguridad
          setContraseña("");
        } else {
          // Fallback a localStorage si el backend falla
          const storedEmail = localStorage.getItem('email') || "";
          const storedNombre = localStorage.getItem('nombre') || "";
          const storedApellido = localStorage.getItem('apellido') || "";
          setEmail(storedEmail);
          setNombre(storedNombre);
          setApellido(storedApellido);
          setContraseña("");
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        // Fallback a localStorage
        const storedEmail = localStorage.getItem('email') || "";
        const storedNombre = localStorage.getItem('nombre') || "";
        const storedApellido = localStorage.getItem('apellido') || "";
        setEmail(storedEmail);
        setNombre(storedNombre);
        setApellido(storedApellido);
        setContraseña("");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!email) { setError("Email inválido"); return; }
    try {
      setGuardando(true);
      const body = { nombre, apellido };
      if (contraseña && contraseña.trim() !== "") {
        body.contraseña = contraseña;
      }
      const resp = await fetch(`/usuarios/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify(body)
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.error || 'No se pudieron guardar los cambios');
        return;
      }
      localStorage.setItem('nombre', nombre || '');
      localStorage.setItem('apellido', apellido || '');
      setOk('Datos actualizados');
      localStorage.setItem('contraseña', contraseña || '');
    } catch (e) {
      setError('Error de red');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className={styles.container}>
        <UserNavControls />
        <div className={styles.loadingContainer}>
          <h2>Mi perfil</h2>
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UserNavControls />
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Mi perfil</h2>
        
        <div className={styles.currentData}>
          <h3>📋 Datos actuales</h3>
          <p><strong>Email:</strong> {email || 'No disponible'}</p>
          <p><strong>Nombre:</strong> {nombre || 'No disponible'}</p>
          <p><strong>Apellido:</strong> {apellido || 'No disponible'}</p>
        </div>
        
        <h3 className={styles.editTitle}>✏️ Editar datos</h3>
        
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Nombre</label>
              <input 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                className={styles.input}
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Apellido</label>
              <input 
                value={apellido} 
                onChange={(e) => setApellido(e.target.value)} 
                className={styles.input}
                placeholder="Ingresa tu apellido"
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Contraseña</label>
              <input 
                type="password"
                value={contraseña} 
                onChange={(e) => setContraseña(e.target.value)} 
                className={styles.input}
                placeholder="Nueva contraseña (opcional)"
              />
            </div>
          </div>
          
          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label className={styles.label}>Email</label>
            <input 
              value={email} 
              disabled 
              className={styles.input}
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          {ok && <p className={styles.success}>{ok}</p>}
          
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={guardando} 
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Volver al inicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

