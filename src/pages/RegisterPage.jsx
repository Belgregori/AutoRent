import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validarPassword = (value) => typeof value === 'string' && value.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!nombre.trim() || !apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }
    if (!validarEmail(email)) {
      setError("Ingresá un correo electrónico válido.");
      return;
    }
    if (!validarPassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setEnviando(true);
      const resp = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, contraseña: password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "No se pudo registrar.");
        return;
      }
      setOk("Registro exitoso");
    } catch (err) {
      setError("Ocurrió un error. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const reenvioMail = async () => {
    setError("");
    setOk("");
    if (!validarEmail(email)) { setError("Email inválido para reenvío."); return; }
    try {
      setReenviando(true);
      const resp = await fetch("/api/usuarios/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!resp.ok) {
        const data = await resp.json();
        setError(data?.error || "No se pudo reenviar el correo.");
        return;
      }
      setOk("Correo reenviado. Revisá tu bandeja de entrada.");
    } catch (e) {
      setError("Ocurrió un error al reenviar el correo.");
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "3rem auto", padding: "2rem", background: "#fff", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
      <UserNavControls />
      <h2 style={{ marginTop: 0, color: "#0d6efd" }}>Crear cuenta</h2>
      <p style={{ marginTop: 6, color: "#475569" }}>Completá tus datos para registrarte y comenzar a alquilar.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: 16 }}>
          <div>
            <label style={{ color: "#0d6efd", fontWeight: 600 }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ color: "#0d6efd", fontWeight: 600 }}>Apellido</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1" }} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ color: "#0d6efd", fontWeight: 600 }}>Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", width: "100%", padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1" }} />
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ color: "#0d6efd", fontWeight: 600 }}>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{ display: "block", width: "100%", padding: "12px", marginTop: 6, borderRadius: 8, border: "1px solid #cbd5e1" }} />
        </div>
        {error && <p style={{ color: "#dc2626", marginTop: 12, background: "#fee2e2", padding: "8px 12px", borderRadius: 8 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button type="submit" disabled={enviando} style={{ padding: "0.7rem 1.1rem", background: enviando ? "#93c5fd" : "#0d6efd", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: enviando ? 'not-allowed' : 'pointer' }}>
            {enviando ? "Creando…" : "Crear cuenta"}
          </button>
          <button type="button" onClick={() => navigate('/login')} style={{ padding: "0.7rem 1.1rem", background: "#0ea5e9", color: "white", border: "none", borderRadius: 8, fontWeight: 600 }}>
            Iniciar sesión
          </button>
        </div>
      </form>

      {ok && (
        <div style={{ marginTop: 18, padding: "12px 14px", background: "#ecf3ff", border: "1px solid #c7d7ff", color: "#1e3a8a", borderRadius: 10 }}>
          <strong>¡Bienvenido!</strong> Enviamos un correo a <strong>{email}</strong> para confirmar tu registro e iniciar sesión.
          <div style={{ marginTop: 6, color: "#334155" }}>
            Si el correo no llega en 10 minutos, podés solicitar un reenvío.
            <div>
              <button onClick={reenvioMail} disabled={reenviando} style={{ marginTop: 8, background: "transparent", color: "#0d6efd", border: "1px solid #0d6efd", padding: "6px 10px", borderRadius: 8, cursor: reenviando ? 'not-allowed' : 'pointer' }}>
                {reenviando ? "Reenviando…" : "Reenviar correo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

