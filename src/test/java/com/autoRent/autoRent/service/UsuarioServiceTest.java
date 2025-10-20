package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private Usuario usuarioConRoles;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@test.com");
        usuario.setContraseña("password123");

        usuarioConRoles = new Usuario();
        usuarioConRoles.setId(2L);
        usuarioConRoles.setNombre("María");
        usuarioConRoles.setApellido("García");
        usuarioConRoles.setEmail("maria@test.com");
        usuarioConRoles.setContraseña("password456");
        usuarioConRoles.setRoles(Set.of("ADMIN"));
    }

    @Test
    void findAll_DebeRetornarTodosLosUsuarios() {
        // Given
        List<Usuario> usuarios = Arrays.asList(usuario, usuarioConRoles);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // When
        List<Usuario> resultado = usuarioService.findAll();

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.contains(usuario));
        assertTrue(resultado.contains(usuarioConRoles));
        verify(usuarioRepository).findAll();
    }

    @Test
    void registrar_UsuarioSinRoles_DebeAsignarRolUserPorDefecto() {
        // Given
        Usuario usuarioNuevo = new Usuario();
        usuarioNuevo.setNombre("Carlos");
        usuarioNuevo.setEmail("carlos@test.com");
        usuarioNuevo.setContraseña("password789");

        when(passwordEncoder.encode("password789")).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(3L);
            return u;
        });

        // When
        Usuario resultado = usuarioService.registrar(usuarioNuevo);

        // Then
        assertNotNull(resultado);
        assertEquals("hashedPassword", resultado.getContraseña());
        assertEquals(Set.of("USER"), resultado.getRoles());
        verify(passwordEncoder).encode("password789");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrar_UsuarioConRoles_DebeMantenerRolesExistentes() {
        // Given
        Usuario usuarioConRoles = new Usuario();
        usuarioConRoles.setNombre("Ana");
        usuarioConRoles.setEmail("ana@test.com");
        usuarioConRoles.setContraseña("password123");
        usuarioConRoles.setRoles(Set.of("ADMIN", "USER"));

        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(4L);
            return u;
        });

        // When
        Usuario resultado = usuarioService.registrar(usuarioConRoles);

        // Then
        assertNotNull(resultado);
        assertEquals("hashedPassword", resultado.getContraseña());
        assertEquals(Set.of("ADMIN", "USER"), resultado.getRoles());
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void validar_CredencialesCorrectas_DebeRetornarUsuario() {
        // Given
        when(usuarioRepository.findByEmail("juan@test.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        usuario.setContraseña("hashedPassword");

        // When
        Optional<Usuario> resultado = usuarioService.validar("juan@test.com", "password123");

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(usuario, resultado.get());
        verify(usuarioRepository).findByEmail("juan@test.com");
        verify(passwordEncoder).matches("password123", "hashedPassword");
    }

    @Test
    void validar_CredencialesIncorrectas_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail("juan@test.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);
        usuario.setContraseña("hashedPassword");

        // When
        Optional<Usuario> resultado = usuarioService.validar("juan@test.com", "wrongPassword");

        // Then
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail("juan@test.com");
        verify(passwordEncoder).matches("wrongPassword", "hashedPassword");
    }

    @Test
    void validar_UsuarioNoExiste_DebeRetornarEmpty() {
        // Given
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        // When
        Optional<Usuario> resultado = usuarioService.validar("noexiste@test.com", "password123");

        // Then
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail("noexiste@test.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void obtenerUsuarioIdPorUsername_UsuarioExiste_DebeRetornarId() {
        // Given
        when(usuarioRepository.findByEmail("juan@test.com")).thenReturn(Optional.of(usuario));

        // When
        Long resultado = usuarioService.obtenerUsuarioIdPorUsername("juan@test.com");

        // Then
        assertEquals(1L, resultado);
        verify(usuarioRepository).findByEmail("juan@test.com");
    }

    @Test
    void obtenerUsuarioIdPorUsername_UsuarioNoExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> usuarioService.obtenerUsuarioIdPorUsername("noexiste@test.com"));

        assertEquals("Usuario no encontrado: noexiste@test.com", exception.getMessage());
        verify(usuarioRepository).findByEmail("noexiste@test.com");
    }

    @Test
    void findByEmail_UsuarioExiste_DebeRetornarUsuario() {
        // Given
        when(usuarioRepository.findByEmail("juan@test.com")).thenReturn(Optional.of(usuario));

        // When
        Usuario resultado = usuarioService.findByEmail("juan@test.com");

        // Then
        assertEquals(usuario, resultado);
        verify(usuarioRepository).findByEmail("juan@test.com");
    }

    @Test
    void findByEmail_UsuarioNoExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> usuarioService.findByEmail("noexiste@test.com"));

        assertEquals("Usuario no encontrado con email: noexiste@test.com", exception.getMessage());
        verify(usuarioRepository).findByEmail("noexiste@test.com");
    }

    @Test
    void save_DebeGuardarUsuario() {
        // Given
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        // When
        Usuario resultado = usuarioService.save(usuario);

        // Then
        assertEquals(usuario, resultado);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void encodePassword_DebeEncriptarContraseña() {
        // Given
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");

        // When
        String resultado = usuarioService.encodePassword("password123");

        // Then
        assertEquals("hashedPassword", resultado);
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void registrar_UsuarioConRolesNull_DebeAsignarRolUser() {
        // Given
        Usuario usuarioSinRoles = new Usuario();
        usuarioSinRoles.setNombre("Pedro");
        usuarioSinRoles.setEmail("pedro@test.com");
        usuarioSinRoles.setContraseña("password123");
        usuarioSinRoles.setRoles(null);

        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(5L);
            return u;
        });

        // When
        Usuario resultado = usuarioService.registrar(usuarioSinRoles);

        // Then
        assertNotNull(resultado);
        assertEquals(Set.of("USER"), resultado.getRoles());
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrar_UsuarioConRolesVacio_DebeAsignarRolUser() {
        // Given
        Usuario usuarioConRolesVacio = new Usuario();
        usuarioConRolesVacio.setNombre("Luis");
        usuarioConRolesVacio.setEmail("luis@test.com");
        usuarioConRolesVacio.setContraseña("password123");
        usuarioConRolesVacio.setRoles(Set.of());

        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(6L);
            return u;
        });

        // When
        Usuario resultado = usuarioService.registrar(usuarioConRolesVacio);

        // Then
        assertNotNull(resultado);
        assertEquals(Set.of("USER"), resultado.getRoles());
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(any(Usuario.class));
    }
}
