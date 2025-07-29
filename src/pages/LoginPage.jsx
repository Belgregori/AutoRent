import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {

            const response = await fetch("http://localhost:65371/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, contraseña }),
            });
            if (!response.ok) {
                const errorData = await response.json(); // leer el JSON de error
                setError(errorData.error || "Credenciales incorrectas.");
                return;
            }


            const data = await response.json();
            // Verifiar el rol del usuario
            if (data.rol === "ADMIN") {
                localStorage.setItem("rol", data.rol);
                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.email);
                navigate("/admin");
            } else {
                setError("No tenés permisos de administrador.");
            }
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error, intentá de nuevo.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "3rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
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
    );
};
