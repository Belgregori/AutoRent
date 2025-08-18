import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  // 🔹 Validaciones
  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validarPassword = (value) => typeof value === "string" && value.length >= 6;
  const validarTexto = (value) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value);

  const validaciones = {
    nombre: (value) => {
      if (!value.trim()) return "El nombre es obligatorio.";
      if (!validarTexto(value)) return "El nombre solo puede contener letras.";
      return true;
    },
    apellido: (value) => {
      if (!value.trim()) return "El apellido es obligatorio.";
      if (!validarTexto(value)) return "El apellido solo puede contener letras.";
      return true;
    },
    email: (value) =>
      validarEmail(value) ? true : "Ingresá un correo electrónico válido.",
    password: (value) =>
      validarPassword(value) ? true : "La contraseña debe tener al menos 6 caracteres.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setOk("");

    const nuevosErrores = {};

    const resultadoNombre = validaciones.nombre(nombre);
    if (resultadoNombre !== true) nuevosErrores.nombre = resultadoNombre;

    const resultadoApellido = validaciones.apellido(apellido);
    if (resultadoApellido !== true) nuevosErrores.apellido = resultadoApellido;

    const resultadoEmail = validaciones.email(email);
    if (resultadoEmail !== true) nuevosErrores.email = resultadoEmail;

    const resultadoPassword = validaciones.password(password);
    if (resultadoPassword !== true) nuevosErrores.password = resultadoPassword;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      setEnviando(true);
      const resp = await fetch("/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, contraseña: password }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setErrors({ general: data?.error || "No se pudo registrar." });
        return;
      }

      localStorage.setItem("nombre", nombre);
      localStorage.setItem("apellido", apellido);
      localStorage.setItem("email", email);
      localStorage.setItem("token", data?.token || "");

      setOk("Registro exitoso");
    } catch (err) {
      setErrors({ general: "Ocurrió un error. Intentá nuevamente." });
    } finally {
      setEnviando(false);
    }
  };

  const reenvioMail = async () => {
    setErrors({});
    setOk("");
    if (!validarEmail(email)) {
      setErrors({ email: "Email inválido para reenvío." });
      return;
    }
    try {
      setReenviando(true);
      const resp = await fetch("/usuarios/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        setErrors({ general: data?.error || "No se pudo reenviar el correo." });
        return;
      }
      setOk("Correo reenviado. Revisá tu bandeja de entrada.");
    } catch (e) {
      setErrors({ general: "Ocurrió un error al reenviar el correo." });
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "3rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <UserNavControls />
      <h2 style={{ marginTop: 0, color: "#0d6efd" }}>Crear cuenta</h2>
      <p style={{ marginTop: 6, color: "#475569" }}>
        Completá tus datos para registrarte y comenzar a alquilar.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: 16,
          }}
        >
          <div>
            <label style={{ color: "#0d6efd", fontWeight: 600 }}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => {
                const res = validaciones.nombre(nombre);
                setErrors((prev) => ({ ...prev, nombre: res !== true ? res : "" }));
              }}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 6,
                borderRadius: 8,
                border: errors.nombre
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            />
            {errors.nombre && (
              <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.nombre}</p>
            )}
          </div>
          <div>
            <label style={{ color: "#0d6efd", fontWeight: 600 }}>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              onBlur={() => {
                const res = validaciones.apellido(apellido);
                setErrors((prev) => ({ ...prev, apellido: res !== true ? res : "" }));
              }}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 6,
                borderRadius: 8,
                border: errors.apellido
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            />
            {errors.apellido && (
              <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.apellido}</p>
            )}
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ color: "#0d6efd", fontWeight: 600 }}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              const res = validaciones.email(email);
              setErrors((prev) => ({ ...prev, email: res !== true ? res : "" }));
            }}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: 6,
              borderRadius: 8,
              border: errors.email
                ? "1px solid #dc2626"
                : "1px solid #cbd5e1",
            }}
          />
          {errors.email && (
            <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.email}</p>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ color: "#0d6efd", fontWeight: 600 }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              const res = validaciones.password(password);
              setErrors((prev) => ({ ...prev, password: res !== true ? res : "" }));
            }}
            required
            minLength={6}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: 6,
              borderRadius: 8,
              border: errors.password
                ? "1px solid #dc2626"
                : "1px solid #cbd5e1",
            }}
          />
          {errors.password && (
            <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p
            style={{
              color: "#dc2626",
              marginTop: 12,
              background: "#fee2e2",
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            {errors.general}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            type="submit"
            disabled={enviando}
            style={{
              padding: "0.7rem 1.1rem",
              background: enviando ? "#93c5fd" : "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: enviando ? "not-allowed" : "pointer",
            }}
          >
            {enviando ? "Creando…" : "Crear cuenta"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              padding: "0.7rem 1.1rem",
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </form>

      {ok && (
        <div
          style={{
            marginTop: 18,
            padding: "12px 14px",
            background: "#ecf3ff",
            border: "1px solid #c7d7ff",
            color: "#1e3a8a",
            borderRadius: 10,
          }}
        >
          <strong>¡Bienvenido!</strong> Enviamos un correo a <strong>{email}</strong>{" "}
          para confirmar tu registro e iniciar sesión.
          <div style={{ marginTop: 6, color: "#334155" }}>
            Si el correo no llega en 10 minutos, podés solicitar un reenvío.
            <div>
              <button
                onClick={reenvioMail}
                disabled={reenviando}
                style={{
                  marginTop: 8,
                  background: "transparent",
                  color: "#0d6efd",
                  border: "1px solid #0d6efd",
                  padding: "6px 10px",
                  borderRadius: 8,
                  cursor: reenviando ? "not-allowed" : "pointer",
                }}
              >
                {reenviando ? "Reenviando…" : "Reenviar correo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
