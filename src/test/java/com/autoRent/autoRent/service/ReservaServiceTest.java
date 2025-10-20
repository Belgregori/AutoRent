package com.autoRent.autoRent.service;

import com.autoRent.autoRent.DTO.ReservaRequest;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.ReservaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ReservaService reservaService;

    private ReservaRequest reservaRequest;
    private Producto producto;
    private Usuario usuario;
    private Reserva reserva;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        reservaRequest = new ReservaRequest();
        reservaRequest.setProductoId(1L);
        reservaRequest.setFechaInicio(LocalDate.now().plusDays(1));
        reservaRequest.setFechaFin(LocalDate.now().plusDays(3));

        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");
        producto.setPrecio(100.0);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@test.com");

        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setUsuario(usuario);
        reserva.setProducto(producto);
        reserva.setFechaInicio(reservaRequest.getFechaInicio());
        reserva.setFechaFin(reservaRequest.getFechaFin());
        reserva.setPrecioTotal(BigDecimal.valueOf(300.0));
        reserva.setDiasReserva(3);
    }

    @Test
    void crearReserva_ConDatosValidos_DebeCrearReserva() {
        // Given
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.of(producto));
        when(reservaRepository.findReservasConflictivas(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Arrays.asList());
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);

        // When
        Reserva resultado = reservaService.crearReserva(reservaRequest, 1L);

        // Then
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals(usuario.getId(), resultado.getUsuario().getId());
        assertEquals(producto.getId(), resultado.getProducto().getId());
        assertEquals(BigDecimal.valueOf(300.0), resultado.getPrecioTotal());
        assertEquals(3, resultado.getDiasReserva());

        verify(productoService).obtenerProductoPorId(1L);
        verify(reservaRepository).findReservasConflictivas(1L, reservaRequest.getFechaInicio(), reservaRequest.getFechaFin());
        verify(reservaRepository).save(any(Reserva.class));
    }

    @Test
    void crearReserva_ProductoNoExiste_DebeLanzarExcepcion() {
        // Given
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.crearReserva(reservaRequest, 1L));

        assertEquals("Producto no encontrado", exception.getMessage());
        verify(productoService).obtenerProductoPorId(1L);
        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void crearReserva_FechaInicioMayorQueFechaFin_DebeLanzarExcepcion() {
        // Given
        reservaRequest.setFechaInicio(LocalDate.now().plusDays(5));
        reservaRequest.setFechaFin(LocalDate.now().plusDays(3));
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.of(producto));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.crearReserva(reservaRequest, 1L));

        assertEquals("La fecha de inicio debe ser anterior a la fecha de fin.", exception.getMessage());
        verify(productoService).obtenerProductoPorId(1L);
        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void crearReserva_FechaInicioEnElPasado_DebeLanzarExcepcion() {
        // Given
        reservaRequest.setFechaInicio(LocalDate.now().minusDays(1));
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.of(producto));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.crearReserva(reservaRequest, 1L));

        assertEquals("La fecha de inicio debe ser futura.", exception.getMessage());
        verify(productoService).obtenerProductoPorId(1L);
        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void crearReserva_HayConflictosEnFechas_DebeLanzarExcepcion() {
        // Given
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.of(producto));
        when(reservaRepository.findReservasConflictivas(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Arrays.asList(reserva));

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.crearReserva(reservaRequest, 1L));

        assertEquals("El producto no está disponible en las fechas seleccionadas.", exception.getMessage());
        verify(productoService).obtenerProductoPorId(1L);
        verify(reservaRepository).findReservasConflictivas(1L, reservaRequest.getFechaInicio(), reservaRequest.getFechaFin());
        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void crearReserva_CalculaPrecioCorrectamente() {
        // Given
        reservaRequest.setFechaInicio(LocalDate.now().plusDays(1));
        reservaRequest.setFechaFin(LocalDate.now().plusDays(5)); // 5 días
        when(productoService.obtenerProductoPorId(1L)).thenReturn(Optional.of(producto));
        when(reservaRepository.findReservasConflictivas(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Arrays.asList());
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(invocation -> {
            Reserva r = invocation.getArgument(0);
            r.setId(1L);
            return r;
        });

        // When
        Reserva resultado = reservaService.crearReserva(reservaRequest, 1L);

        // Then
        assertEquals(BigDecimal.valueOf(500.0), resultado.getPrecioTotal()); // 5 días * 100.0
        assertEquals(5, resultado.getDiasReserva());
    }

    @Test
    void obtenerFechasOcupadas_ConReservas_DebeRetornarFechasOcupadas() {
        // Given
        Reserva reserva1 = new Reserva();
        reserva1.setFechaInicio(LocalDate.now().plusDays(1));
        reserva1.setFechaFin(LocalDate.now().plusDays(2));

        Reserva reserva2 = new Reserva();
        reserva2.setFechaInicio(LocalDate.now().plusDays(5));
        reserva2.setFechaFin(LocalDate.now().plusDays(6));

        when(reservaRepository.findByProductoId(1L)).thenReturn(Arrays.asList(reserva1, reserva2));

        // When
        List<LocalDate> fechasOcupadas = reservaService.obtenerFechasOcupadas(1L, 6);

        // Then
        assertEquals(4, fechasOcupadas.size()); // 2 días de reserva1 + 2 días de reserva2
        assertTrue(fechasOcupadas.contains(LocalDate.now().plusDays(1)));
        assertTrue(fechasOcupadas.contains(LocalDate.now().plusDays(2)));
        assertTrue(fechasOcupadas.contains(LocalDate.now().plusDays(5)));
        assertTrue(fechasOcupadas.contains(LocalDate.now().plusDays(6)));
    }

    @Test
    void obtenerFechasDisponibles_SinReservas_DebeRetornarTodasLasFechas() {
        // Given
        when(reservaRepository.findByProductoId(1L)).thenReturn(Arrays.asList());

        // When
        List<LocalDate> fechasDisponibles = reservaService.obtenerFechasDisponibles(1L, 1);

        // Then
        assertFalse(fechasDisponibles.isEmpty());
        assertTrue(fechasDisponibles.contains(LocalDate.now()));
    }

    @Test
    void verificarDisponibilidad_SinConflictos_DebeRetornarTrue() {
        // Given
        when(reservaRepository.findReservasConflictivas(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3)))
                .thenReturn(Arrays.asList());

        // When
        boolean disponible = reservaService.verificarDisponibilidad(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3));

        // Then
        assertTrue(disponible);
    }

    @Test
    void verificarDisponibilidad_ConConflictos_DebeRetornarFalse() {
        // Given
        when(reservaRepository.findReservasConflictivas(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3)))
                .thenReturn(Arrays.asList(reserva));

        // When
        boolean disponible = reservaService.verificarDisponibilidad(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(3));

        // Then
        assertFalse(disponible);
    }

    @Test
    void confirmarReserva_ReservaExiste_DebeCambiarEstado() {
        // Given
        reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);

        // When
        Reserva resultado = reservaService.confirmarReserva(1L);

        // Then
        assertEquals(Reserva.EstadoReserva.CONFIRMADA, resultado.getEstado());
        verify(reservaRepository).findById(1L);
        verify(reservaRepository).save(reserva);
    }

    @Test
    void confirmarReserva_ReservaNoExiste_DebeLanzarExcepcion() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.confirmarReserva(1L));

        assertEquals("Reserva no encontrada", exception.getMessage());
        verify(reservaRepository).findById(1L);
        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void cancelarReserva_ReservaExiste_DebeCambiarEstado() {
        // Given
        reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reserva);

        // When
        Reserva resultado = reservaService.cancelarReserva(1L);

        // Then
        assertEquals(Reserva.EstadoReserva.CANCELADA, resultado.getEstado());
        verify(reservaRepository).findById(1L);
        verify(reservaRepository).save(reserva);
    }

    @Test
    void findById_ReservaExiste_DebeRetornarReserva() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        // When
        Reserva resultado = reservaService.findById(1L);

        // Then
        assertEquals(reserva, resultado);
        verify(reservaRepository).findById(1L);
    }

    @Test
    void findById_ReservaNoExiste_DebeLanzarExcepcion() {
        // Given
        when(reservaRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> reservaService.findById(1L));

        assertEquals("Reserva no encontrada", exception.getMessage());
        verify(reservaRepository).findById(1L);
    }

    @Test
    void obtenerReservasPorUsuario_DebeRetornarReservas() {
        // Given
        when(reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L)).thenReturn(Arrays.asList(reserva));

        // When
        List<Reserva> resultado = reservaService.obtenerReservasPorUsuario(1L);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(reserva, resultado.get(0));
        verify(reservaRepository).findByUsuarioIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void contarReservasPorEstado_DebeRetornarCantidad() {
        // Given
        when(reservaRepository.countByEstado(Reserva.EstadoReserva.PENDIENTE)).thenReturn(5L);

        // When
        long resultado = reservaService.contarReservasPorEstado(Reserva.EstadoReserva.PENDIENTE);

        // Then
        assertEquals(5L, resultado);
        verify(reservaRepository).countByEstado(Reserva.EstadoReserva.PENDIENTE);
    }

    @Test
    void contarTotalReservas_DebeRetornarCantidad() {
        // Given
        when(reservaRepository.count()).thenReturn(10L);

        // When
        long resultado = reservaService.contarTotalReservas();

        // Then
        assertEquals(10L, resultado);
        verify(reservaRepository).count();
    }
}
