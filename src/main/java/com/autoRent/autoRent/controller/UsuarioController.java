package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Usuario;
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

    public UsuarioController(UsuarioService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return service.findAll();
    }

    // Registrar un nuevo usuario
    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario u) {
        return service.registrar(u);
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



