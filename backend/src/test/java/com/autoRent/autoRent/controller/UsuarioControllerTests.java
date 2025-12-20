package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.CustomAccessDeniedHandler;
import com.autoRent.autoRent.configuration.JwtRequestFilter;
import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.EmailService;
import com.autoRent.autoRent.service.PermissionService;
import com.autoRent.autoRent.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UsuarioControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtRequestFilter jwtRequestFilter;

    @MockitoBean
    private PermissionService permissionService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegister_UsuarioValido_DebeRetornar200YEnviarCorreo() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@test.com");
        usuario.setContraseña("password123");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan");
        usuarioGuardado.setApellido("Pérez");
        usuarioGuardado.setEmail("juan@test.com");

        when(usuarioService.registrar(any(Usuario.class))).thenReturn(usuarioGuardado);
        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());

        // When & Then
        mockMvc.perform(post("/usuarios/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.email").value("juan@test.com"));

        verify(usuarioService, times(1)).registrar(any(Usuario.class));
        verify(emailService, times(1)).sendHtmlEmail(
                eq("juan@test.com"),
                contains("Bienvenido"),
                contains("Juan")
        );
    }

    @Test
    public void testRegister_ConError_DebeRetornar500() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan");
        usuario.setEmail("juan@test.com");

        when(usuarioService.registrar(any(Usuario.class)))
                .thenThrow(new RuntimeException("Error en la base de datos"));

        // When & Then
        mockMvc.perform(post("/usuarios/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuario)))
                .andExpect(status().isInternalServerError());

        verify(usuarioService, times(1)).registrar(any(Usuario.class));
        verify(emailService, never()).sendHtmlEmail(anyString(), anyString(), anyString());
    }

    @Test
    public void testLogin_ConCredencialesValidas_DebeRetornarToken() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@test.com");
        usuario.setRoles(new HashSet<>(Arrays.asList("ROLE_USER")));

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@test.com");
        loginRequest.put("contraseña", "password123");

        when(usuarioService.validar("juan@test.com", "password123"))
                .thenReturn(Optional.of(usuario));
        when(jwtUtil.generateToken("juan@test.com", "ROLE_USER"))
                .thenReturn("fake-jwt-token");

        // When & Then
        mockMvc.perform(post("/usuarios/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.rol").value("ROLE_USER"))
                .andExpect(jsonPath("$.email").value("juan@test.com"));

        verify(usuarioService, times(1)).validar("juan@test.com", "password123");
        verify(jwtUtil, times(1)).generateToken("juan@test.com", "ROLE_USER");
    }

    @Test
    public void testLogin_ConPasswordEnLugarDeContraseña_DebeRetornarToken() throws Exception {
        // Given - Prueba de compatibilidad con campo "password"
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@test.com");
        usuario.setRoles(new HashSet<>(Arrays.asList("ROLE_USER")));

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@test.com");
        loginRequest.put("password", "password123");  // Usando "password" en lugar de "contraseña"

        when(usuarioService.validar("juan@test.com", "password123"))
                .thenReturn(Optional.of(usuario));
        when(jwtUtil.generateToken("juan@test.com", "ROLE_USER"))
                .thenReturn("fake-jwt-token");

        // When & Then
        mockMvc.perform(post("/usuarios/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));

        verify(usuarioService, times(1)).validar("juan@test.com", "password123");
    }

    @Test
    public void testLogin_ConCredencialesInvalidas_DebeRetornar401() throws Exception {
        // Given
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@test.com");
        loginRequest.put("contraseña", "wrongpassword");

        when(usuarioService.validar("juan@test.com", "wrongpassword"))
                .thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(post("/usuarios/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales inválidas"));

        verify(usuarioService, times(1)).validar("juan@test.com", "wrongpassword");
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    public void testGetUsuarioByEmail_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setEmail("juan@test.com");

        when(usuarioService.findByEmail("juan@test.com")).thenReturn(usuario);

        // When & Then
        mockMvc.perform(get("/usuarios/juan@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.email").value("juan@test.com"));

        verify(usuarioService, times(1)).findByEmail("juan@test.com");
    }

    @Test
    public void testGetUsuarioByEmail_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(usuarioService.findByEmail("noexiste@test.com"))
                .thenThrow(new RuntimeException("Usuario no encontrado"));

        // When & Then
        mockMvc.perform(get("/usuarios/noexiste@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(usuarioService, times(1)).findByEmail("noexiste@test.com");
    }

    @Test
    public void testUpdateUsuario_ActualizandoNombreYApellido_DebeRetornar200() throws Exception {
        // Given
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Juan");
        usuarioExistente.setApellido("Pérez");
        usuarioExistente.setEmail("juan@test.com");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setNombre("Juan Carlos");
        usuarioActualizado.setApellido("Pérez García");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan Carlos");
        usuarioGuardado.setApellido("Pérez García");
        usuarioGuardado.setEmail("juan@test.com");

        when(usuarioService.findByEmail("juan@test.com")).thenReturn(usuarioExistente);
        when(usuarioService.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // When & Then
        mockMvc.perform(put("/usuarios/juan@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan Carlos"))
                .andExpect(jsonPath("$.apellido").value("Pérez García"));

        verify(usuarioService, times(1)).findByEmail("juan@test.com");
        verify(usuarioService, times(1)).save(any(Usuario.class));
    }

    @Test
    public void testUpdateUsuario_ActualizandoContraseña_DebeEncodePassword() throws Exception {
        // Given
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Juan");
        usuarioExistente.setEmail("juan@test.com");
        usuarioExistente.setContraseña("oldHashedPassword");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setContraseña("newPassword123");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan");
        usuarioGuardado.setEmail("juan@test.com");
        usuarioGuardado.setContraseña("$2a$10$hashedPassword");

        when(usuarioService.findByEmail("juan@test.com")).thenReturn(usuarioExistente);
        when(usuarioService.encodePassword("newPassword123")).thenReturn("$2a$10$hashedPassword");
        when(usuarioService.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // When & Then
        mockMvc.perform(put("/usuarios/juan@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contraseña").value("$2a$10$hashedPassword"));

        verify(usuarioService, times(1)).findByEmail("juan@test.com");
        verify(usuarioService, times(1)).encodePassword("newPassword123");
        verify(usuarioService, times(1)).save(any(Usuario.class));
    }

    @Test
    public void testUpdateUsuario_SoloActualizarCamposPresentes_DebeRetornar200() throws Exception {
        // Given - Solo actualizar el nombre, dejar apellido sin cambios
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Juan");
        usuarioExistente.setApellido("Pérez");
        usuarioExistente.setEmail("juan@test.com");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setNombre("Juan Carlos");
        // No se establece apellido ni contraseña

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan Carlos");
        usuarioGuardado.setApellido("Pérez");  // Debe mantener el apellido original
        usuarioGuardado.setEmail("juan@test.com");

        when(usuarioService.findByEmail("juan@test.com")).thenReturn(usuarioExistente);
        when(usuarioService.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // When & Then
        mockMvc.perform(put("/usuarios/juan@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan Carlos"))
                .andExpect(jsonPath("$.apellido").value("Pérez"));

        verify(usuarioService, times(1)).save(any(Usuario.class));
        verify(usuarioService, never()).encodePassword(anyString());
    }

    @Test
    public void testUpdateUsuario_UsuarioNoExiste_DebeRetornar404() throws Exception {
        // Given
        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setNombre("Juan");

        when(usuarioService.findByEmail("noexiste@test.com"))
                .thenThrow(new RuntimeException("Usuario no encontrado"));

        // When & Then
        mockMvc.perform(put("/usuarios/noexiste@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioActualizado)))
                .andExpect(status().isNotFound());

        verify(usuarioService, times(1)).findByEmail("noexiste@test.com");
        verify(usuarioService, never()).save(any(Usuario.class));
    }

    @Test
    public void testGetAll_DebeRetornarListaDeUsuarios() throws Exception {
        // Given
        Usuario usuario1 = new Usuario();
        usuario1.setId(1L);
        usuario1.setNombre("Juan");

        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("María");

        List<Usuario> usuarios = Arrays.asList(usuario1, usuario2);
        when(usuarioService.findAll()).thenReturn(usuarios);

        // When & Then
        mockMvc.perform(get("/usuarios")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Juan"))
                .andExpect(jsonPath("$[1].nombre").value("María"));

        verify(usuarioService, times(1)).findAll();
    }

    @Test
    public void testUpdateUsuario_ConContraseñaVacia_NoDebeActualizarContraseña() throws Exception {
        // Given
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Juan");
        usuarioExistente.setEmail("juan@test.com");
        usuarioExistente.setContraseña("oldHashedPassword");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setNombre("Juan Carlos");
        usuarioActualizado.setContraseña("");  // Contraseña vacía

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan Carlos");
        usuarioGuardado.setEmail("juan@test.com");
        usuarioGuardado.setContraseña("oldHashedPassword");  // Debe mantener la contraseña original

        when(usuarioService.findByEmail("juan@test.com")).thenReturn(usuarioExistente);
        when(usuarioService.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // When & Then
        mockMvc.perform(put("/usuarios/juan@test.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contraseña").value("oldHashedPassword"));

        verify(usuarioService, never()).encodePassword(anyString());
        verify(usuarioService, times(1)).save(any(Usuario.class));
    }
}

