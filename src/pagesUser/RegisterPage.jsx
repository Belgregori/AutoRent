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
    <>
      <style>{`
        @media (max-width: 768px) {
          .register-container {
            padding: 16px !important;
          }
          .register-card {
            padding: 1.5rem !important;
            max-width: 100% !important;
          }
          .register-title {
            font-size: 1.5rem !important;
          }
          .register-subtitle {
            font-size: 0.9rem !important;
          }
          .register-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .register-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .register-button {
            width: 100% !important;
            min-width: auto !important;
          }
        }
        @media (max-width: 480px) {
          .register-container {
            padding: 12px !important;
          }
          .register-card {
            padding: 1rem !important;
          }
          .register-title {
            font-size: 1.3rem !important;
          }
          .register-subtitle {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
      <div
        className="register-container"
        style={{
        minHeight: "calc(100vh - 64px)",
        background: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      >
        <div
          className="register-card"
          style={{
            maxWidth: "720px",
            width: "100%",
            margin: "0 auto",
            padding: "2rem",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.05)",
          color: "#333"
          }}
        >
        <UserNavControls />
        <h2 className="register-title" style={{
          margin: "0 0 0.5rem 0",
          color: "#0d6efd",
          fontSize: "1.8rem",
          fontWeight: "700",
          textAlign: "center",
          borderBottom: "2px solid #0d6efd",
          paddingBottom: "6px"
        }}>📝 Crear cuenta</h2>
        <p className="register-subtitle" style={{
          margin: "0 0 1.5rem 0",
          color: "#6c757d",
          textAlign: "center",
          fontSize: "1rem"
        }}>
          Completá tus datos para registrarte y comenzar a alquilar.
        </p>
      <form onSubmit={handleSubmit} noValidate>
        <div
          className="register-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginTop: 16,
          }}
        >
          <div>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "500",
              fontSize: "0.9rem"
            }}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={(e) => {
                const res = validaciones.nombre(nombre);
                setErrors((prev) => ({ ...prev, nombre: res !== true ? res : "" }));
                e.target.style.borderColor = errors.nombre ? "#dc2626" : "rgba(255, 255, 255, 0.3)";
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: errors.nombre
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#fff",
                color: "#333",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && (
              <p style={{
                color: "#dc3545",
                fontSize: "0.8rem",
                margin: "0.25rem 0 0 0"
              }}>{errors.nombre}</p>
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

        <div className="register-buttons" style={{
          display: "flex",
          gap: "12px",
          marginTop: "1.5rem",
          flexWrap: "wrap"
        }}>
          <button
            type="submit"
            disabled={enviando}
            className="register-button"
            style={{
              flex: "1",
              minWidth: "140px",
              padding: "0.75rem 1.5rem",
              background: enviando ? "#93c5fd" : "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: enviando ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.9rem"
            }}
            onMouseOver={(e) => {
              if (!enviando) {
                e.target.style.background = "#0b5ed7";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
              }
            }}
            onMouseOut={(e) => {
              if (!enviando) {
                e.target.style.background = "#0d6efd";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {enviando ? "Creando…" : "Crear cuenta"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="register-button"
            style={{
              flex: "1",
              minWidth: "140px",
              padding: "0.75rem 1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.9rem"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
              e.target.style.transform = "translateY(0)";
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
    </div>
    </>
  );
};
