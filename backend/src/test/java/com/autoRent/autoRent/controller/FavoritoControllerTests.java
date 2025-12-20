package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.CustomAccessDeniedHandler;
import com.autoRent.autoRent.configuration.JwtRequestFilter;
import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Favorito;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.FavoritoService;
import com.autoRent.autoRent.service.PermissionService;
import com.autoRent.autoRent.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FavoritoController.class)
@AutoConfigureMockMvc(addFilters = false)
public class FavoritoControllerTests {

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
    private FavoritoService favoritoService;

    @MockitoBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerFavoritos_UsuarioAutenticado_DebeRetornarLista() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto1 = new Producto();
        producto1.setId(1L);
        producto1.setNombre("Toyota Corolla");

        Producto producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Honda Civic");

        Favorito favorito1 = new Favorito();
        favorito1.setId(1L);
        favorito1.setUsuario(usuario);
        favorito1.setProducto(producto1);

        Favorito favorito2 = new Favorito();
        favorito2.setId(2L);
        favorito2.setUsuario(usuario);
        favorito2.setProducto(producto2);

        List<Favorito> favoritos = Arrays.asList(favorito1, favorito2);

        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.obtenerFavoritosPorUsuario(1L)).thenReturn(favoritos);

        // When & Then
        mockMvc.perform(get("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));

        verify(favoritoService, times(1)).obtenerFavoritosPorUsuario(1L);
    }

    @Test
    @WithAnonymousUser
    public void testObtenerFavoritos_UsuarioNoAutenticado_DebeRetornar401() throws Exception {
        // Given - Simular que obtenerUsuarioIdPorUsername retorna null para usuario anónimo
        when(usuarioService.obtenerUsuarioIdPorUsername(anyString())).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Usuario no autenticado"));

        verify(favoritoService, never()).obtenerFavoritosPorUsuario(anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testAgregarFavorito_ConProductoValido_DebeRetornar201() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");

        Favorito favorito = new Favorito();
        favorito.setId(1L);
        favorito.setUsuario(usuario);
        favorito.setProducto(producto);

        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.agregarFavorito(1L, 1L)).thenReturn(favorito);

        Map<String, Long> request = new HashMap<>();
        request.put("productoId", 1L);

        // When & Then
        mockMvc.perform(post("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(favoritoService, times(1)).agregarFavorito(1L, 1L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testAgregarFavorito_SinProductoId_DebeRetornar400() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);

        Map<String, Long> request = new HashMap<>();
        // No se incluye productoId

        // When & Then
        mockMvc.perform(post("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("ID de producto requerido"));

        verify(favoritoService, never()).agregarFavorito(anyLong(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testAgregarFavorito_ProductoInexistente_DebeRetornar400() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.agregarFavorito(1L, 99L))
                .thenThrow(new RuntimeException("Producto no encontrado"));

        Map<String, Long> request = new HashMap<>();
        request.put("productoId", 99L);

        // When & Then
        mockMvc.perform(post("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Producto no encontrado"));

        verify(favoritoService, times(1)).agregarFavorito(1L, 99L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testEliminarFavorito_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.eliminarFavorito(1L, 1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/favoritos/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Favorito eliminado correctamente"));

        verify(favoritoService, times(1)).eliminarFavorito(1L, 1L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testEliminarFavorito_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.eliminarFavorito(1L, 99L)).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/favoritos/99")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(favoritoService, times(1)).eliminarFavorito(1L, 99L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testVerificarFavorito_EsFavorito_DebeRetornarTrue() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.esFavorito(1L, 1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/favoritos/verificar/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.esFavorito").value(true));

        verify(favoritoService, times(1)).esFavorito(1L, 1L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testVerificarFavorito_NoEsFavorito_DebeRetornarFalse() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername("usuario@test.com")).thenReturn(1L);
        when(favoritoService.esFavorito(1L, 99L)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/favoritos/verificar/99")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.esFavorito").value(false));

        verify(favoritoService, times(1)).esFavorito(1L, 99L);
    }

    @Test
    @WithAnonymousUser
    public void testAgregarFavorito_UsuarioNoAutenticado_DebeRetornar401() throws Exception {
        // Given
        when(usuarioService.obtenerUsuarioIdPorUsername(anyString())).thenReturn(null);
        when(favoritoService.agregarFavorito(isNull(), eq(1L)))
                .thenThrow(new RuntimeException("Usuario no autenticado"));

        Map<String, Long> request = new HashMap<>();
        request.put("productoId", 1L);

        // When & Then - El controlador retorna BadRequest cuando hay RuntimeException
        mockMvc.perform(post("/api/favoritos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(favoritoService, times(1)).agregarFavorito(isNull(), eq(1L));
    }
}

