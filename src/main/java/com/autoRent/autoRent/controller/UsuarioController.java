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
        try{
            String email = body.get("email");
            String pass = body.get("contraseña");

            Optional<Usuario> userOpt = service.validar(email, pass);
            if (userOpt.isPresent()) {
                // Obtenemos el primer rol del set
                String rol = userOpt.get().getRoles().iterator().next();

                // Generamos el token usando JwtUtil
                String token = jwtUtil.generateToken(email, rol);

                // Devolvemos un JSON con el token y rol
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "rol", rol,
                        "email", email
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales inválidas"));
            }
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }
}

