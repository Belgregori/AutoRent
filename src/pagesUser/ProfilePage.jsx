import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

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
      <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', padding: 20, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
        <UserNavControls />
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Mi perfil</h2>
        <p style={{ color: '#666' }}>Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <UserNavControls />
      <h2 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Mi perfil</h2>
      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1.2rem', fontWeight: '600' }}>📋 Datos actuales</h3>
        <p style={{ color: '#333', margin: '0.5rem 0' }}><strong style={{ color: '#2c3e50' }}>Email:</strong> {email || 'No disponible'}</p>
        <p style={{ color: '#333', margin: '0.5rem 0' }}><strong style={{ color: '#2c3e50' }}>Nombre:</strong> {nombre || 'No disponible'}</p>
        <p style={{ color: '#333', margin: '0.5rem 0' }}><strong style={{ color: '#2c3e50' }}>Apellido:</strong> {apellido || 'No disponible'}</p>
      </div>
      <h3 style={{ margin: '1.5rem 0 1rem 0', color: '#2c3e50', fontSize: '1.2rem', fontWeight: '600' }}>✏️ Editar datos</h3>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ color: '#333', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: 6, border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ color: '#333', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Apellido</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: 6, border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ color: '#333', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
            <input value={contraseña} onChange={(e) => setContraseña(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: 6, border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ color: '#333', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input value={email} disabled style={{ width: '100%', padding: '0.5rem', marginTop: 6, background: '#f7f7f7', border: '1px solid #ddd', borderRadius: '4px', color: '#666' }} />
        </div>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
        {ok && <p style={{ color: 'green', marginTop: 12 }}>{ok}</p>}
        <button type="submit" disabled={guardando} style={{ padding: '0.6rem 1rem', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: 6, marginTop: 16 }}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '0.6rem 1rem', marginLeft: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 6, marginTop: 16 }}>
          Volver al inicio
        </button>
      </form>
    </div>
  );
};

