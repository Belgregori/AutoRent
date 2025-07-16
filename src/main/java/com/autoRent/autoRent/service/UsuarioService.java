package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;
    private final BCryptPasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repo,
                          BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    /** Devuelve todos los usuarios */
    public List<Usuario> findAll() {
        return repo.findAll();
    }

    /** Registra usuario: encripta contraseña y asigna rol por defecto si no tiene */
    public Usuario registrar(Usuario u) {
        // Encriptar la contraseña antes de guardar
        String rawPassword = u.getContraseña();
        u.setContraseña(encoder.encode(rawPassword));

        // Si no tiene roles, le asigna USER por defecto
        if (u.getRoles() == null || u.getRoles().isEmpty()) {
            u.setRoles(Set.of("USER"));
        }

        return repo.save(u);
    }

    /** Valida usuario en login comparando la contraseña con BCrypt */
    public Optional<Usuario> validar(String email, String pass) {
        return repo.findByEmail(email)
                .filter(u -> encoder.matches(pass, u.getContraseña()));
    }
}







