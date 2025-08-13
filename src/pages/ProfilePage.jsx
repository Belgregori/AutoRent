import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email') || "";
    const storedNombre = localStorage.getItem('nombre') || "";
    const storedApellido = localStorage.getItem('apellido') || "";
    setEmail(storedEmail);
    setNombre(storedNombre);
    setApellido(storedApellido);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!email) { setError("Email inválido"); return; }
    try {
      setGuardando(true);
      const resp = await fetch('/api/usuarios/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({ nombre, apellido })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.error || 'No se pudieron guardar los cambios');
        return;
      }
      localStorage.setItem('nombre', nombre || '');
      localStorage.setItem('apellido', apellido || '');
      setOk('Datos actualizados');
    } catch (e) {
      setError('Error de red');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <UserNavControls />
      <h2>Mi perfil</h2>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: 6 }} />
          </div>
          <div>
            <label>Apellido</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: 6 }} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input value={email} disabled style={{ width: '100%', padding: '0.5rem', marginTop: 6, background: '#f7f7f7' }} />
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

