package com.autoRent.autoRent.configuration;

import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
    }

    private void seedAdmin() {
        if (usuarioRepository.findByEmail("admin@ejemplo.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setEmail("admin@ejemplo.com");
            admin.setContraseña(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of("ADMIN"));
            usuarioRepository.save(admin);
            System.out.println("✅ Admin creado (admin@ejemplo.com / admin123)");
        }
    }
}
