package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservaRepositoryTest {

    @Mock
    private ReservaRepository reservaRepository;

    private Usuario usuario;
    private Producto producto;
    private Reserva reserva1;
    private Reserva reserva2;
    private Reserva reserva3;

    @BeforeEach
    void setUp() {
        // Crear usuario
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setEmail("juan@test.com");
        usuario.setContraseña("password123");

        // Crear producto
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");
        producto.setDescripcion("Sedán compacto");
        producto.setPrecio(100.0);

        // Crear reservas
        reserva1 = new Reserva();
        reserva1.setId(1L);
        reserva1.setUsuario(usuario);
        reserva1.setProducto(producto);
        reserva1.setFechaInicio(LocalDate.now().plusDays(1));
        reserva1.setFechaFin(LocalDate.now().plusDays(3));
        reserva1.setPrecioTotal(BigDecimal.valueOf(300.0));
        reserva1.setDiasReserva(3);
        reserva1.setEstado(Reserva.EstadoReserva.PENDIENTE);

        reserva2 = new Reserva();
        reserva2.setId(2L);
        reserva2.setUsuario(usuario);
        reserva2.setProducto(producto);
        reserva2.setFechaInicio(LocalDate.now().plusDays(5));
        reserva2.setFechaFin(LocalDate.now().plusDays(7));
        reserva2.setPrecioTotal(BigDecimal.valueOf(300.0));
        reserva2.setDiasReserva(3);
        reserva2.setEstado(Reserva.EstadoReserva.CONFIRMADA);

        reserva3 = new Reserva();
        reserva3.setId(3L);
        reserva3.setUsuario(usuario);
        reserva3.setProducto(producto);
        reserva3.setFechaInicio(LocalDate.now().plusDays(10));
        reserva3.setFechaFin(LocalDate.now().plusDays(12));
        reserva3.setPrecioTotal(BigDecimal.valueOf(300.0));
        reserva3.setDiasReserva(3);
        reserva3.setEstado(Reserva.EstadoReserva.CANCELADA);
    }

    @Test
    void findByProductoId_ConReservas_DebeRetornarTodasLasReservasDelProducto() {
        // Given
        List<Reserva> reservas = Arrays.asList(reserva1, reserva2, reserva3);
        when(reservaRepository.findByProductoId(producto.getId())).thenReturn(reservas);

        // When
        List<Reserva> resultado = reservaRepository.findByProductoId(producto.getId());

        // Then
        assertEquals(3, resultado.size());
        assertTrue(resultado.contains(reserva1));
        assertTrue(resultado.contains(reserva2));
        assertTrue(resultado.contains(reserva3));
    }

    @Test
    void findByProductoId_ConProductoInexistente_DebeRetornarListaVacia() {
        // Given
        when(reservaRepository.findByProductoId(99L)).thenReturn(Collections.emptyList());

        // When
        List<Reserva> resultado = reservaRepository.findByProductoId(99L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void findReservasConflictivas_ConSolapamiento_DebeRetornarReservasConflictivas() {
        // Given
        LocalDate fechaInicio = LocalDate.now().plusDays(2);
        LocalDate fechaFin = LocalDate.now().plusDays(4);
        when(reservaRepository.findReservasConflictivas(producto.getId(), fechaInicio, fechaFin))
                .thenReturn(Arrays.asList(reserva1));

        // When
        List<Reserva> resultado = reservaRepository.findReservasConflictivas(
                producto.getId(), fechaInicio, fechaFin);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(reserva1, resultado.get(0));
    }

    @Test
    void findReservasConflictivas_SinSolapamiento_DebeRetornarListaVacia() {
        // Given
        LocalDate fechaInicio = LocalDate.now().plusDays(15);
        LocalDate fechaFin = LocalDate.now().plusDays(17);
        when(reservaRepository.findReservasConflictivas(producto.getId(), fechaInicio, fechaFin))
                .thenReturn(Collections.emptyList());

        // When
        List<Reserva> resultado = reservaRepository.findReservasConflictivas(
                producto.getId(), fechaInicio, fechaFin);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void findReservasConflictivas_ConSolapamientoExacto_DebeRetornarReserva() {
        // Given
        LocalDate fechaInicio = LocalDate.now().plusDays(1);
        LocalDate fechaFin = LocalDate.now().plusDays(3);
        when(reservaRepository.findReservasConflictivas(producto.getId(), fechaInicio, fechaFin))
                .thenReturn(Arrays.asList(reserva1));

        // When
        List<Reserva> resultado = reservaRepository.findReservasConflictivas(
                producto.getId(), fechaInicio, fechaFin);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(reserva1, resultado.get(0));
    }

    @Test
    void findAllWithFilters_SinFiltros_DebeRetornarTodasLasReservas() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Reserva> reservas = Arrays.asList(reserva1, reserva2, reserva3);
        when(reservaRepository.findAllWithFilters(null, null, pageable)).thenReturn(reservas);

        // When
        List<Reserva> resultado = reservaRepository.findAllWithFilters(null, null, pageable);

        // Then
        assertEquals(3, resultado.size());
    }

    @Test
    void findAllWithFilters_ConFiltroEstado_DebeRetornarReservasDelEstado() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        when(reservaRepository.findAllWithFilters(Reserva.EstadoReserva.PENDIENTE, null, pageable))
                .thenReturn(Arrays.asList(reserva1));

        // When
        List<Reserva> resultado = reservaRepository.findAllWithFilters(
                Reserva.EstadoReserva.PENDIENTE, null, pageable);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(reserva1, resultado.get(0));
    }

    @Test
    void findAllWithFilters_ConFiltroProducto_DebeRetornarReservasDelProducto() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Reserva> reservas = Arrays.asList(reserva1, reserva2, reserva3);
        when(reservaRepository.findAllWithFilters(null, producto.getId(), pageable)).thenReturn(reservas);

        // When
        List<Reserva> resultado = reservaRepository.findAllWithFilters(
                null, producto.getId(), pageable);

        // Then
        assertEquals(3, resultado.size());
    }

    @Test
    void findAllWithFilters_ConFiltrosCombinados_DebeRetornarReservasFiltradas() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        when(reservaRepository.findAllWithFilters(Reserva.EstadoReserva.CONFIRMADA, producto.getId(), pageable))
                .thenReturn(Arrays.asList(reserva2));

        // When
        List<Reserva> resultado = reservaRepository.findAllWithFilters(
                Reserva.EstadoReserva.CONFIRMADA, producto.getId(), pageable);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(reserva2, resultado.get(0));
    }

    @Test
    void findByUsuarioIdOrderByFechaCreacionDesc_ConReservas_DebeRetornarReservasOrdenadas() {
        // Given
        List<Reserva> reservas = Arrays.asList(reserva3, reserva2, reserva1); // Ordenadas por fecha desc
        when(reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuario.getId())).thenReturn(reservas);

        // When
        List<Reserva> resultado = reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuario.getId());

        // Then
        assertEquals(3, resultado.size());
    }

    @Test
    void findByUsuarioIdOrderByFechaCreacionDesc_ConUsuarioInexistente_DebeRetornarListaVacia() {
        // Given
        when(reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(99L)).thenReturn(Collections.emptyList());

        // When
        List<Reserva> resultado = reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(99L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void findByUsuarioIdAndProductoId_ConReservas_DebeRetornarReservasDelUsuarioYProducto() {
        // Given
        List<Reserva> reservas = Arrays.asList(reserva1, reserva2, reserva3);
        when(reservaRepository.findByUsuarioIdAndProductoId(usuario.getId(), producto.getId())).thenReturn(reservas);

        // When
        List<Reserva> resultado = reservaRepository.findByUsuarioIdAndProductoId(usuario.getId(), producto.getId());

        // Then
        assertEquals(3, resultado.size());
        assertTrue(resultado.contains(reserva1));
        assertTrue(resultado.contains(reserva2));
        assertTrue(resultado.contains(reserva3));
    }

    @Test
    void findByUsuarioIdAndProductoId_ConUsuarioInexistente_DebeRetornarListaVacia() {
        // Given
        when(reservaRepository.findByUsuarioIdAndProductoId(99L, producto.getId())).thenReturn(Collections.emptyList());

        // When
        List<Reserva> resultado = reservaRepository.findByUsuarioIdAndProductoId(99L, producto.getId());

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void countByEstado_ConReservas_DebeRetornarCantidadCorrecta() {
        // Given
        when(reservaRepository.countByEstado(Reserva.EstadoReserva.PENDIENTE)).thenReturn(1L);
        when(reservaRepository.countByEstado(Reserva.EstadoReserva.CONFIRMADA)).thenReturn(1L);
        when(reservaRepository.countByEstado(Reserva.EstadoReserva.CANCELADA)).thenReturn(1L);

        // When
        long pendientes = reservaRepository.countByEstado(Reserva.EstadoReserva.PENDIENTE);
        long confirmadas = reservaRepository.countByEstado(Reserva.EstadoReserva.CONFIRMADA);
        long canceladas = reservaRepository.countByEstado(Reserva.EstadoReserva.CANCELADA);

        // Then
        assertEquals(1, pendientes);
        assertEquals(1, confirmadas);
        assertEquals(1, canceladas);
    }

    @Test
    void countByEstado_ConEstadoInexistente_DebeRetornarCero() {
        // Given
        when(reservaRepository.countByEstado(Reserva.EstadoReserva.PENDIENTE)).thenReturn(1L);

        // When
        long resultado = reservaRepository.countByEstado(Reserva.EstadoReserva.PENDIENTE);

        // Then
        assertEquals(1, resultado);
    }

    @Test
    void count_DebeRetornarTotalDeReservas() {
        // Given
        when(reservaRepository.count()).thenReturn(3L);

        // When
        long resultado = reservaRepository.count();

        // Then
        assertEquals(3, resultado);
    }
}