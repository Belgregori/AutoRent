package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto1;
    private Producto producto2;

    @BeforeEach
    void setUp() {
        producto1 = new Producto();
        producto1.setId(1L);
        producto1.setNombre("Toyota Corolla");
        producto1.setDescripcion("Sedán compacto");
        producto1.setPrecio(50000.0);

        producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Honda Civic");
        producto2.setDescripcion("Sedán deportivo");
        producto2.setPrecio(55000.0);
    }

    @Test
    void productosPorCaracteristica_ConCaracteristicaExistente_DebeRetornarProductos() {
        // Given
        Long caracteristicaId = 1L;
        List<Producto> productos = Arrays.asList(producto1, producto2);
        when(productoRepository.findByCaracteristicas_Id(caracteristicaId)).thenReturn(productos);

        // When
        List<Producto> resultado = productoService.productosPorCaracteristica(caracteristicaId);

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.contains(producto1));
        assertTrue(resultado.contains(producto2));
        verify(productoRepository).findByCaracteristicas_Id(caracteristicaId);
    }

    @Test
    void productosPorCaracteristica_SinProductos_DebeRetornarListaVacia() {
        // Given
        Long caracteristicaId = 99L;
        when(productoRepository.findByCaracteristicas_Id(caracteristicaId)).thenReturn(Arrays.asList());

        // When
        List<Producto> resultado = productoService.productosPorCaracteristica(caracteristicaId);

        // Then
        assertTrue(resultado.isEmpty());
        verify(productoRepository).findByCaracteristicas_Id(caracteristicaId);
    }

    @Test
    void obtenerProductoPorId_ProductoExiste_DebeRetornarOptionalConProducto() {
        // Given
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));

        // When
        Optional<Producto> resultado = productoService.obtenerProductoPorId(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(producto1, resultado.get());
        verify(productoRepository).findById(1L);
    }

    @Test
    void obtenerProductoPorId_ProductoNoExiste_DebeRetornarOptionalVacio() {
        // Given
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Producto> resultado = productoService.obtenerProductoPorId(99L);

        // Then
        assertFalse(resultado.isPresent());
        verify(productoRepository).findById(99L);
    }

    @Test
    void findById_ProductoExiste_DebeRetornarProducto() {
        // Given
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));

        // When
        Producto resultado = productoService.findById(1L);

        // Then
        assertEquals(producto1, resultado);
        verify(productoRepository).findById(1L);
    }

    @Test
    void findById_ProductoNoExiste_DebeLanzarExcepcion() {
        // Given
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productoService.findById(99L));

        assertEquals("Producto no encontrado con id: 99", exception.getMessage());
        verify(productoRepository).findById(99L);
    }

    @Test
    void productosPorCaracteristica_ConIdNull_DebeLlamarRepositorio() {
        // Given
        when(productoRepository.findByCaracteristicas_Id(null)).thenReturn(Arrays.asList());

        // When
        List<Producto> resultado = productoService.productosPorCaracteristica(null);

        // Then
        assertTrue(resultado.isEmpty());
        verify(productoRepository).findByCaracteristicas_Id(null);
    }

    @Test
    void obtenerProductoPorId_ConIdNull_DebeLlamarRepositorio() {
        // Given
        when(productoRepository.findById(null)).thenReturn(Optional.empty());

        // When
        Optional<Producto> resultado = productoService.obtenerProductoPorId(null);

        // Then
        assertFalse(resultado.isPresent());
        verify(productoRepository).findById(null);
    }

    @Test
    void findById_ConIdNull_DebeLanzarExcepcion() {
        // Given
        when(productoRepository.findById(null)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productoService.findById(null));

        assertEquals("Producto no encontrado con id: null", exception.getMessage());
        verify(productoRepository).findById(null);
    }
}
