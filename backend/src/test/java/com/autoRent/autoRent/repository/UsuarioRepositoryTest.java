package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioRepositoryTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@test.com");
        usuario.setContraseña("password123");
        usuario.setRoles(java.util.Set.of("USER"));
    }

    @Test
    void findByEmail_ConEmailExistente_DebeRetornarUsuario() {
        // Given
        when(usuarioRepository.findByEmail("juan@test.com")).thenReturn(Optional.of(usuario));

        // When
        Optional<Usuario> resultado = usuarioRepository.findByEmail("juan@test.com");

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(usuario, resultado.get());
        assertEquals("juan@test.com", resultado.get().getEmail());
    }

    @Test
    void findByEmail_ConEmailInexistente_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail("inexistente@test.com")).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioRepository.findByEmail("inexistente@test.com");

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void findByEmail_ConEmailNull_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail(null)).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioRepository.findByEmail(null);

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void findByEmail_ConEmailVacio_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail("")).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioRepository.findByEmail("");

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void findByEmail_ConEmailConEspacios_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail("  ")).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioRepository.findByEmail("  ");

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void findById_ConIdExistente_DebeRetornarUsuario() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // When
        Optional<Usuario> resultado = usuarioRepository.findById(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(usuario, resultado.get());
        assertEquals(1L, resultado.get().getId());
    }

    @Test
    void findById_ConIdInexistente_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioRepository.findById(99L);

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void save_ConUsuarioNuevo_DebePersistirUsuario() {
        // Given
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("María");
        nuevoUsuario.setApellido("García");
        nuevoUsuario.setEmail("maria@test.com");
        nuevoUsuario.setContraseña("password456");
        
        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(2L);
        usuarioGuardado.setNombre("María");
        usuarioGuardado.setApellido("García");
        usuarioGuardado.setEmail("maria@test.com");
        usuarioGuardado.setContraseña("password456");
        
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // When
        Usuario resultado = usuarioRepository.save(nuevoUsuario);

        // Then
        assertNotNull(resultado);
        assertEquals(2L, resultado.getId());
        assertEquals("María", resultado.getNombre());
        assertEquals("maria@test.com", resultado.getEmail());
    }

    @Test
    void save_ConUsuarioExistente_DebeActualizarUsuario() {
        // Given
        usuario.setNombre("Juan Actualizado");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // When
        Usuario resultado = usuarioRepository.save(usuario);

        // Then
        assertNotNull(resultado);
        assertEquals("Juan Actualizado", resultado.getNombre());
        assertEquals("juan@test.com", resultado.getEmail());
    }

    @Test
    void existsById_ConIdExistente_DebeRetornarTrue() {
        // Given
        when(usuarioRepository.existsById(1L)).thenReturn(true);

        // When
        boolean resultado = usuarioRepository.existsById(1L);

        // Then
        assertTrue(resultado);
    }

    @Test
    void existsById_ConIdInexistente_DebeRetornarFalse() {
        // Given
        when(usuarioRepository.existsById(99L)).thenReturn(false);

        // When
        boolean resultado = usuarioRepository.existsById(99L);

        // Then
        assertFalse(resultado);
    }

    @Test
    void count_DebeRetornarTotalDeUsuarios() {
        // Given
        when(usuarioRepository.count()).thenReturn(1L);

        // When
        long resultado = usuarioRepository.count();

        // Then
        assertEquals(1, resultado);
    }
}