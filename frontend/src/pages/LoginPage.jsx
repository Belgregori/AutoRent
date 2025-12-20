import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");

    // Función para verificar si el usuario tiene permisos
    const verificarPermisosAdmin = async (token, userEmail) => {
      try {
        const response = await fetch('/api/admin/users-with-permissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return false;
        
        const users = await response.json();
        const currentUser = users.find(user => user.email === userEmail);
        
        // Verificar si tiene permisos (array no vacío)
        return currentUser && currentUser.permissions && currentUser.permissions.length > 0;
      } catch {
        return false;
      }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
      
        try {
          const response = await fetch("/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contraseña }), 
          });
      
       
          const text = await response.text();
      
         
          let data = {};
          const contentType = response.headers.get("content-type") || "";
          if (text && contentType.includes("application/json")) {
            try {
              data = JSON.parse(text);
            } catch (parseErr) {
              console.warn("Respuesta no JSON:", text);
              data = {};
            }
          } else if (text) {
            // Si hay texto pero no es JSON, lo deja en data.raw 
            data.raw = text;
          }
      
          if (!response.ok) {
            // manejar caso error 
            setError(data.error || data.message || `Error ${response.status}: ${response.statusText}`);
            return;
          }
      
          
          if (!data || Object.keys(data).length === 0) {
           
            setError("Respuesta vacía del servidor. Verificá el backend.");
            return;
          }
      
          // Guardar datos y redirigir
          if (data?.token) localStorage.setItem("token", data.token);
          if (data?.rol) localStorage.setItem("rol", data.rol);
          if (data?.email) localStorage.setItem("email", data.email);
          if (data?.nombre) localStorage.setItem("nombre", data.nombre);
          if (data?.apellido) localStorage.setItem("apellido", data.apellido);
      
          if (data.rol === "ADMIN") {
            navigate("/admin");
          } else {
            // Verificar si tiene permisos
            const tienePermisos = await verificarPermisosAdmin(data.token, data.email);
            if (tienePermisos) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }
        } catch (err) {
          console.error("handleLogin error:", err);
          setError("Ocurrió un error, intentá de nuevo.");
        }
      };
      

    return (
        <>
            <Header />
            <UserNavControls />
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <h2 className={styles.loginTitle}>🔑 Iniciar sesión</h2>
                    
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={styles.formInput}
                                placeholder="Ingresa tu email"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Contraseña</label>
                            <input
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                                className={styles.formInput}
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>
                        
                        {error && (
                            <p className={styles.errorMessage}>{error}</p>
                        )}
                        
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};
