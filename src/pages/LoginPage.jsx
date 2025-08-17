import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavControls } from "../components/UserNavControls";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");

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
            navigate("/");
          }
        } catch (err) {
          console.error("handleLogin error:", err);
          setError("Ocurrió un error, intentá de nuevo.");
        }
      };
      

    return (
        <>
            <UserNavControls />
            <div style={{ maxWidth: "400px", margin: "3rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", background: "#fff" }}>
            <h2>🔑 Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                        style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" style={{ padding: "0.5rem 1rem", background: "blue", color: "white", border: "none", borderRadius: "4px" }}>
                    Ingresar
                </button>
            </form>
            </div>
        </>
    );
};
