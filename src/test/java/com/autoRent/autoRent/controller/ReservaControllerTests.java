package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.DTO.ReservaRequest;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.service.ProductoService;
import com.autoRent.autoRent.service.ReservaService;
import com.autoRent.autoRent.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ReservaControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservaService reservaService;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private ProductoService productoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithAnonymousUser
    public void testCrearReserva_SinAutenticacion_DebeRetornar401() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_ProductoNoExiste_DebeRetornar404() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(99L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(99L)).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Producto no encontrado"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "noexiste@test.com")
    public void testCrearReserva_UsuarioNoExiste_DebeRetornar401() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        when(usuarioService.findByEmail("noexiste@test.com")).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuario no encontrado"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_FechasInvalidas_DebeRetornar400() throws Exception {
        // Given - Fecha de inicio en el pasado
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().minusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(1L)).thenReturn(producto);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No se pueden reservar fechas pasadas"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_FechaInicioMayorQueFechaFin_DebeRetornar400() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(5));
        request.setFechaFin(LocalDate.now().plusDays(2));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto();
        producto.setId(1L);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(1L)).thenReturn(producto);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La fecha de inicio debe ser anterior a la fecha de fin"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_ProductoNoDisponible_DebeRetornar400() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto() {
            @Override
            public boolean isDisponible() {
                return false;
            }
        };
        producto.setId(1L);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(1L)).thenReturn(producto);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El producto no está disponible para reservas"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_SinDisponibilidadEnFechas_DebeRetornar409() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto();
        producto.setId(1L);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(1L)).thenReturn(producto);
        when(reservaService.verificarDisponibilidad(1L, request.getFechaInicio(), request.getFechaFin()))
                .thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(content().string("El producto no está disponible en el rango de fechas seleccionado"));

        verify(reservaService, never()).crearReserva(any(), anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testCrearReserva_Exitosa_DebeRetornar201() throws Exception {
        // Given
        ReservaRequest request = new ReservaRequest();
        request.setProductoId(1L);
        request.setFechaInicio(LocalDate.now().plusDays(1));
        request.setFechaFin(LocalDate.now().plusDays(3));

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Producto producto = new Producto();
        producto.setId(1L);

        Reserva reservaCreada = new Reserva();
        reservaCreada.setId(1L);
        reservaCreada.setUsuario(usuario);
        reservaCreada.setProducto(producto);
        reservaCreada.setFechaInicio(request.getFechaInicio());
        reservaCreada.setFechaFin(request.getFechaFin());
        reservaCreada.setPrecioTotal(BigDecimal.valueOf(300));
        reservaCreada.setEstado(Reserva.EstadoReserva.PENDIENTE);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(productoService.findById(1L)).thenReturn(producto);
        when(reservaService.verificarDisponibilidad(1L, request.getFechaInicio(), request.getFechaFin()))
                .thenReturn(true);
        when(reservaService.crearReserva(any(ReservaRequest.class), eq(1L))).thenReturn(reservaCreada);

        // When & Then
        mockMvc.perform(post("/api/reservas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));

        verify(reservaService, times(1)).crearReserva(any(ReservaRequest.class), eq(1L));
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerDisponibilidad_ProductoExiste_DebeRetornarDisponibilidad() throws Exception {
        // Given
        Producto producto = new Producto();
        producto.setId(1L);

        List<LocalDate> fechasOcupadas = Arrays.asList(
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(6)
        );

        List<LocalDate> fechasDisponibles = Arrays.asList(
                LocalDate.now().plusDays(1),
                LocalDate.now().plusDays(2),
                LocalDate.now().plusDays(3)
        );

        when(productoService.findById(1L)).thenReturn(producto);
        when(reservaService.obtenerFechasOcupadas(1L, 6)).thenReturn(fechasOcupadas);
        when(reservaService.obtenerFechasDisponibles(1L, 6)).thenReturn(fechasDisponibles);

        // When & Then
        mockMvc.perform(get("/api/reservas/producto/1/disponibilidad")
                .with(csrf())
                .param("meses", "6")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productoId").value(1))
                .andExpect(jsonPath("$.mesesConsultados").value(6))
                .andExpect(jsonPath("$.fechasOcupadas").isArray())
                .andExpect(jsonPath("$.fechasDisponibles").isArray());

        verify(productoService, times(1)).findById(1L);
        verify(reservaService, times(1)).obtenerFechasOcupadas(1L, 6);
        verify(reservaService, times(1)).obtenerFechasDisponibles(1L, 6);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerDisponibilidad_ProductoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(productoService.findById(99L)).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/reservas/producto/99/disponibilidad")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(productoService, times(1)).findById(99L);
        verify(reservaService, never()).obtenerFechasOcupadas(anyLong(), anyInt());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerReservasUsuario_Autenticado_DebeRetornarReservas() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Reserva reserva1 = new Reserva();
        reserva1.setId(1L);
        reserva1.setUsuario(usuario);

        Reserva reserva2 = new Reserva();
        reserva2.setId(2L);
        reserva2.setUsuario(usuario);

        List<Reserva> reservas = Arrays.asList(reserva1, reserva2);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(reservaService.obtenerReservasPorUsuario(1L)).thenReturn(reservas);

        // When & Then
        mockMvc.perform(get("/api/reservas/usuario")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));

        verify(usuarioService, times(1)).findByEmail("usuario@test.com");
        verify(reservaService, times(1)).obtenerReservasPorUsuario(1L);
    }

    @Test
    @WithAnonymousUser
    public void testObtenerReservasUsuario_NoAutenticado_DebeRetornar401() throws Exception {
        mockMvc.perform(get("/api/reservas/usuario")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(reservaService, never()).obtenerReservasPorUsuario(anyLong());
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerReserva_PropietarioAccede_DebeRetornar200() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        Reserva reserva = new Reserva();
        reserva.setId(1L);
        reserva.setUsuario(usuario);

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(reservaService.findById(1L)).thenReturn(reserva);

        // When & Then
        mockMvc.perform(get("/api/reservas/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(reservaService, times(1)).findById(1L);
    }

    @Test
    @WithMockUser(username = "otrousuario@test.com")
    public void testObtenerReserva_NoEsPropietario_DebeRetornar403() throws Exception {
        // Given
        Usuario propietario = new Usuario();
        propietario.setId(1L);
        propietario.setEmail("usuario@test.com");

        Usuario otroUsuario = new Usuario();
        otroUsuario.setId(2L);
        otroUsuario.setEmail("otrousuario@test.com");

        Reserva reserva = new Reserva();
        reserva.setId(1L);
        reserva.setUsuario(propietario);

        when(usuarioService.findByEmail("otrousuario@test.com")).thenReturn(otroUsuario);
        when(reservaService.findById(1L)).thenReturn(reserva);

        // When & Then
        mockMvc.perform(get("/api/reservas/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(reservaService, times(1)).findById(1L);
    }

    @Test
    @WithMockUser(username = "usuario@test.com")
    public void testObtenerReserva_ReservaNoExiste_DebeRetornar404() throws Exception {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("usuario@test.com");

        when(usuarioService.findByEmail("usuario@test.com")).thenReturn(usuario);
        when(reservaService.findById(99L)).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/reservas/99")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(reservaService, times(1)).findById(99L);
    }
}

