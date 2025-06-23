package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}

