package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.service.EmailService;
import com.autoRent.autoRent.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public UsuarioController(UsuarioService service, JwtUtil jwtUtil, EmailService emailService) {
        this.service = service;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return service.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario u) {
        try {
            Usuario nuevoUsuario = service.registrar(u);

            // 🟢 Asunto
            String subject = "¡Bienvenido a AutoRent, " + nuevoUsuario.getNombre() + "!";

            // 🟢 Contenido HTML mejorado
            String htmlContent = "<!DOCTYPE html>"
                    + "<html>"
                    + "<head>"
                    + "<meta charset='UTF-8'>"
                    + "<title>Bienvenido a AutoRent</title>"
                    + "</head>"
                    + "<body style='font-family:Arial,sans-serif;background-color:#f8f9fa;padding:20px;margin:0;'>"
                    + "<div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.1);padding:30px;'>"
                    + "<h2 style='color:#0d6efd;text-align:center;'>¡Bienvenido, " + nuevoUsuario.getNombre() + "!</h2>"
                    + "<p style='font-size:16px;color:#555;'>Gracias por registrarte en <strong>AutoRent</strong>. Estamos encantados de que formes parte de nuestra comunidad y queremos asegurarnos de que tengas la mejor experiencia alquilando autos.</p>"
                    + "<hr style='border:none;border-top:1px solid #e0e0e0;margin:20px 0;'>"
                    + "<p style='font-size:16px;color:#555;'>Para iniciar sesión, utilizá tu correo electrónico y tu clave:</p>"
                    + "<p style='font-size:16px;color:#333;'><strong>Email:</strong> " + nuevoUsuario.getEmail() + "<br>"
                    + "<strong>Contraseña:</strong> la que elegiste al registrarte</p>"
                    + "<p style='font-size:16px;color:#555;'>Hacé click en el siguiente botón para acceder a tu cuenta y comenzar a explorar nuestras opciones de alquiler:</p>"
                    + "<div style='text-align:center;margin:20px 0;'>"
                    + "<a href='https://tusitio.com/login' style='display:inline-block;padding:12px 25px;background:#0d6efd;color:#fff;text-decoration:none;font-weight:bold;border-radius:5px;font-size:16px;'>Iniciar Sesión</a>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#555;'>Si tenés alguna duda o necesitás asistencia, no dudes en contactarnos. ¡Estamos aquí para ayudarte!</p>"
                    + "<p style='font-size:16px;color:#555;'>Saludos cordiales,<br><strong>Equipo AutoRent</strong></p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";


            // 🟢 Enviar correo HTML
            emailService.sendHtmlEmail(nuevoUsuario.getEmail(), subject, htmlContent);

            return ResponseEntity.ok(nuevoUsuario);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            // 👇 Aseguro compatibilidad: acepta "contraseña" o "password"
            String pass = body.get("contraseña") != null ? body.get("contraseña") : body.get("password");

            Optional<Usuario> userOpt = service.validar(email, pass);
            if (userOpt.isPresent()) {
                String rol = userOpt.get().getRoles().iterator().next();
                String token = jwtUtil.generateToken(email, rol);

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "rol", rol,
                        "email", email
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales inválidas"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> getUsuarioByEmail(@PathVariable("email") String email) {
        try {
            Usuario usuario = service.findByEmail(email);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable("email") String email,
                                                 @RequestBody Usuario updatedUsuario) {
        try {
            Usuario existingUser = service.findByEmail(email);

            if (updatedUsuario.getNombre() != null) {
                existingUser.setNombre(updatedUsuario.getNombre());
            }
            if (updatedUsuario.getApellido() != null) {
                existingUser.setApellido(updatedUsuario.getApellido());
            }
            if (updatedUsuario.getContraseña() != null && !updatedUsuario.getContraseña().isBlank()) {
                existingUser.setContraseña(service.encodePassword(updatedUsuario.getContraseña()));
            }

            Usuario savedUser = service.save(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}



