package com.autoRent.autoRent.service;

import com.autoRent.autoRent.DTO.ResenaRequest;
import com.autoRent.autoRent.DTO.ResenaResponse;
import com.autoRent.autoRent.DTO.ResumenValoracionesResponse;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Resena;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.ResenaRepository;
import com.autoRent.autoRent.repository.ReservaRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResenaServiceTest {

    @Mock
    private ResenaRepository resenaRepository;

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ResenaService resenaService;

    private Usuario usuario;
    private Producto producto;
    private Reserva reserva;
    private Resena resena;
    private ResenaRequest resenaRequest;

    @BeforeEach
    void setUp() {
        // Crear usuario
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@test.com");

        // Crear producto
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");
        producto.setPrecio(100.0);

        // Crear reserva
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setUsuario(usuario);
        reserva.setProducto(producto);
        reserva.setEstado(Reserva.EstadoReserva.CONFIRMADA);
        reserva.setFechaInicio(LocalDate.now().minusDays(5));
        reserva.setFechaFin(LocalDate.now().minusDays(2));

        // Crear reseña
        resena = new Resena();
        resena.setId(1L);
        resena.setUsuario(usuario);
        resena.setProducto(producto);
        resena.setReserva(reserva);
        resena.setPuntuacion(5);
        resena.setComentario("Excelente auto");
        resena.setFechaCreacion(LocalDateTime.now());

        // Crear request
        resenaRequest = new ResenaRequest();
        resenaRequest.setReservaId(1L);
        resenaRequest.setPuntuacion(5);
        resenaRequest.setComentario("Excelente auto");
    }

    @Test
    void crearResena_ConReservaValida_DebeCrearResena() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
        when(resenaRepository.existsByReservaId(1L)).thenReturn(false);
        when(resenaRepository.save(any(Resena.class))).thenReturn(resena);

        // When
        ResenaResponse resultado = resenaService.crearResena(1L, resenaRequest);

        // Then
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Juan", resultado.getNombreUsuario());
        assertEquals("Pérez", resultado.getApellidoUsuario());
        assertEquals(5, resultado.getPuntuacion());
        assertEquals("Excelente auto", resultado.getComentario());
        verify(resenaRepository).save(any(Resena.class));
    }

    @Test
    void crearResena_ConReservaInexistente_DebeLanzarExcepcion() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.crearResena(1L, resenaRequest));
        assertEquals("Reserva no encontrada", exception.getMessage());
    }

    @Test
    void crearResena_ConReservaDeOtroUsuario_DebeLanzarExcepcion() {
        // Given
        Usuario otroUsuario = new Usuario();
        otroUsuario.setId(2L);
        reserva.setUsuario(otroUsuario);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.crearResena(1L, resenaRequest));
        assertEquals("No tienes permisos para valorar esta reserva", exception.getMessage());
    }

    @Test
    void crearResena_ConReservaPendiente_DebeLanzarExcepcion() {
        // Given
        reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.crearResena(1L, resenaRequest));
        assertEquals("Solo puedes valorar reservas completadas o confirmadas", exception.getMessage());
    }

    @Test
    void crearResena_ConReservaCancelada_DebeLanzarExcepcion() {
        // Given
        reserva.setEstado(Reserva.EstadoReserva.CANCELADA);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.crearResena(1L, resenaRequest));
        assertEquals("Solo puedes valorar reservas completadas o confirmadas", exception.getMessage());
    }

    @Test
    void crearResena_ConResenaYaExistente_DebeLanzarExcepcion() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
        when(resenaRepository.existsByReservaId(1L)).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.crearResena(1L, resenaRequest));
        assertEquals("Ya has valorado esta reserva", exception.getMessage());
    }

    @Test
    void obtenerResenasProducto_ConResenas_DebeRetornarLista() {
        // Given
        List<Resena> resenas = Arrays.asList(resena);
        when(resenaRepository.findByProductoIdWithUsuario(1L)).thenReturn(resenas);

        // When
        List<ResenaResponse> resultado = resenaService.obtenerResenasProducto(1L);

        // Then
        assertEquals(1, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombreUsuario());
        assertEquals(5, resultado.get(0).getPuntuacion());
    }

    @Test
    void obtenerResenasProducto_SinResenas_DebeRetornarListaVacia() {
        // Given
        when(resenaRepository.findByProductoIdWithUsuario(1L)).thenReturn(Collections.emptyList());

        // When
        List<ResenaResponse> resultado = resenaService.obtenerResenasProducto(1L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void obtenerResenasProducto_ConError_DebeLanzarExcepcion() {
        // Given
        when(resenaRepository.findByProductoIdWithUsuario(1L)).thenThrow(new RuntimeException("Error de BD"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenaService.obtenerResenasProducto(1L));
        assertTrue(exception.getMessage().contains("Error al obtener reseñas del producto 1"));
    }

    @Test
    void obtenerResumenValoraciones_ConDatos_DebeRetornarResumen() {
        // Given
        when(resenaRepository.getPuntuacionMediaByProductoId(1L)).thenReturn(4.5);
        when(resenaRepository.countByProductoId(1L)).thenReturn(10L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 1)).thenReturn(1L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 2)).thenReturn(1L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 3)).thenReturn(2L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 4)).thenReturn(3L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 5)).thenReturn(3L);

        // When
        ResumenValoracionesResponse resultado = resenaService.obtenerResumenValoraciones(1L);

        // Then
        assertEquals(4.5, resultado.getPuntuacionMedia());
        assertEquals(10L, resultado.getTotalResenas());
        assertEquals(1L, resultado.getPuntuacion1());
        assertEquals(1L, resultado.getPuntuacion2());
        assertEquals(2L, resultado.getPuntuacion3());
        assertEquals(3L, resultado.getPuntuacion4());
        assertEquals(3L, resultado.getPuntuacion5());
    }

    @Test
    void obtenerResumenValoraciones_SinDatos_DebeRetornarCeros() {
        // Given
        when(resenaRepository.getPuntuacionMediaByProductoId(1L)).thenReturn(null);
        when(resenaRepository.countByProductoId(1L)).thenReturn(0L);
        when(resenaRepository.countByProductoIdAndPuntuacion(anyLong(), anyInt())).thenReturn(0L);

        // When
        ResumenValoracionesResponse resultado = resenaService.obtenerResumenValoraciones(1L);

        // Then
        assertEquals(0.0, resultado.getPuntuacionMedia());
        assertEquals(0L, resultado.getTotalResenas());
        assertEquals(0L, resultado.getPuntuacion1());
    }

    @Test
    void puedeValorarProducto_ConReservasYSinValoracion_DebeRetornarTrue() {
        // Given
        when(reservaRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Arrays.asList(reserva));
        when(resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L)).thenReturn(false);

        // When
        boolean resultado = resenaService.puedeValorarProducto(1L, 1L);

        // Then
        assertTrue(resultado);
    }

    @Test
    void puedeValorarProducto_SinReservas_DebeRetornarFalse() {
        // Given
        when(reservaRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Collections.emptyList());

        // When
        boolean resultado = resenaService.puedeValorarProducto(1L, 1L);

        // Then
        assertFalse(resultado);
    }

    @Test
    void puedeValorarProducto_ConReservasYConValoracion_DebeRetornarFalse() {
        // Given
        when(reservaRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Arrays.asList(reserva));
        when(resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L)).thenReturn(true);

        // When
        boolean resultado = resenaService.puedeValorarProducto(1L, 1L);

        // Then
        assertFalse(resultado);
    }
}
