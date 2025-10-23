import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

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
            <UserNavControls />
            <div style={{
                minHeight: "calc(100vh - 64px)",
                background: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                boxSizing: "border-box",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div style={{
                    maxWidth: "400px",
                    width: "100%",
                    margin: "0 auto",
                    padding: "2rem",
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    color: "#333"
                }}>
                    <h2 style={{
                        margin: "0 0 1.5rem 0",
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        textAlign: "center",
                        color: "#0d6efd",
                        borderBottom: "2px solid #0d6efd",
                        paddingBottom: "6px"
                    }}>🔑 Iniciar sesión</h2>
                    
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                color: "#333",
                                fontWeight: "500",
                                fontSize: "0.9rem"
                            }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: "#333",
                                    fontSize: "0.9rem",
                                    transition: "all 0.3s ease",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#0d6efd";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#cbd5e1";
                                    e.target.style.background = "#fff";
                                }}
                                placeholder="Ingresa tu email"
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                color: "#333",
                                fontWeight: "500",
                                fontSize: "0.9rem"
                            }}>Contraseña</label>
                            <input
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: "#333",
                                    fontSize: "0.9rem",
                                    transition: "all 0.3s ease",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#0d6efd";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#cbd5e1";
                                    e.target.style.background = "#fff";
                                }}
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>
                        
                        {error && (
                            <p style={{
                                color: "#dc3545",
                                fontSize: "0.85rem",
                                margin: "0",
                                padding: "0.5rem",
                                background: "#f8d7da",
                                border: "1px solid #f5c6cb",
                                borderRadius: "6px",
                                textAlign: "center"
                            }}>{error}</p>
                        )}
                        
                        <button 
                            type="submit" 
                            style={{
                                padding: "0.75rem 1.5rem",
                                background: "#0d6efd",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                marginTop: "0.5rem"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = "#0b5ed7";
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 12px rgba(13, 110, 253, 0.3)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = "#0d6efd";
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "none";
                            }}
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
