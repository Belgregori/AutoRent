import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import styles from "./RegisterPage.module.css";

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
      <Header />
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <UserNavControls />
          <h2 className={styles.registerTitle}>📝 Crear cuenta</h2>
          <p className={styles.registerSubtitle}>
            Completá tus datos para registrarte y comenzar a alquilar.
          </p>
          <form onSubmit={handleSubmit} noValidate className={styles.registerForm}>
            <div className={styles.registerGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabelAlt}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => {
                    const res = validaciones.nombre(nombre);
                    setErrors((prev) => ({ ...prev, nombre: res !== true ? res : "" }));
                  }}
                  required
                  className={`${styles.formInput} ${errors.nombre ? styles.formInputError : ""}`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.nombre && (
                  <p className={styles.errorText}>{errors.nombre}</p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  onBlur={() => {
                    const res = validaciones.apellido(apellido);
                    setErrors((prev) => ({ ...prev, apellido: res !== true ? res : "" }));
                  }}
                  required
                  className={`${styles.formInput} ${errors.apellido ? styles.formInputError : ""}`}
                  placeholder="Ingresa tu apellido"
                />
                {errors.apellido && (
                  <p className={styles.errorText}>{errors.apellido}</p>
                )}
              </div>
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  const res = validaciones.email(email);
                  setErrors((prev) => ({ ...prev, email: res !== true ? res : "" }));
                }}
                required
                className={`${styles.formInput} ${errors.email ? styles.formInputError : ""}`}
                placeholder="Ingresa tu correo electrónico"
              />
              {errors.email && (
                <p className={styles.errorTextLarge}>{errors.email}</p>
              )}
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Contraseña</label>
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
                className={`${styles.formInput} ${errors.password ? styles.formInputError : ""}`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <p className={styles.errorTextLarge}>{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <p className={styles.errorGeneral}>
                {errors.general}
              </p>
            )}

            <div className={styles.registerButtons}>
              <button
                type="submit"
                disabled={enviando}
                className={`${styles.registerButton} ${styles.registerButtonPrimary}`}
              >
                {enviando ? "Creando…" : "Crear cuenta"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`${styles.registerButton} ${styles.registerButtonSecondary}`}
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          {ok && (
            <div className={styles.successMessage}>
              <strong>¡Bienvenido!</strong> Enviamos un correo a <strong>{email}</strong>{" "}
              para confirmar tu registro e iniciar sesión.
              <div className={styles.reenvioContainer}>
                Si el correo no llega en 10 minutos, podés solicitar un reenvío.
                <div>
                  <button
                    onClick={reenvioMail}
                    disabled={reenviando}
                    className={styles.reenvioButton}
                  >
                    {reenviando ? "Reenviando…" : "Reenviar correo"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    <Footer />
    </>
  );
};
