package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Resena;
import com.autoRent.autoRent.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResenaRepositoryTest {

    @Mock
    private ResenaRepository resenaRepository;

    private Usuario usuario;
    private Producto producto;
    private Resena resena1;
    private Resena resena2;

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

        // Crear reseñas
        resena1 = new Resena();
        resena1.setId(1L);
        resena1.setUsuario(usuario);
        resena1.setProducto(producto);
        resena1.setPuntuacion(5);
        resena1.setComentario("Excelente auto");
        resena1.setFechaCreacion(LocalDateTime.now().minusDays(1));

        resena2 = new Resena();
        resena2.setId(2L);
        resena2.setUsuario(usuario);
        resena2.setProducto(producto);
        resena2.setPuntuacion(4);
        resena2.setComentario("Muy bueno");
        resena2.setFechaCreacion(LocalDateTime.now());
    }

    @Test
    void findByProductoIdOrderByFechaCreacionDesc_ConResenas_DebeRetornarResenasOrdenadas() {
        // Given
        List<Resena> resenas = Arrays.asList(resena2, resena1); // Ordenadas por fecha desc
        when(resenaRepository.findByProductoIdOrderByFechaCreacionDesc(1L)).thenReturn(resenas);

        // When
        List<Resena> resultado = resenaRepository.findByProductoIdOrderByFechaCreacionDesc(1L);

        // Then
        assertEquals(2, resultado.size());
        assertEquals(resena2, resultado.get(0)); // Más reciente primero
        assertEquals(resena1, resultado.get(1));
    }

    @Test
    void findByProductoIdOrderByFechaCreacionDesc_SinResenas_DebeRetornarListaVacia() {
        // Given
        when(resenaRepository.findByProductoIdOrderByFechaCreacionDesc(1L)).thenReturn(Collections.emptyList());

        // When
        List<Resena> resultado = resenaRepository.findByProductoIdOrderByFechaCreacionDesc(1L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void findByReservaId_ConReservaExistente_DebeRetornarResena() {
        // Given
        when(resenaRepository.findByReservaId(1L)).thenReturn(Optional.of(resena1));

        // When
        Optional<Resena> resultado = resenaRepository.findByReservaId(1L);

        // Then
        assertTrue(resultado.isPresent());
        assertEquals(resena1, resultado.get());
    }

    @Test
    void findByReservaId_ConReservaInexistente_DebeRetornarEmpty() {
        // Given
        when(resenaRepository.findByReservaId(99L)).thenReturn(Optional.empty());

        // When
        Optional<Resena> resultado = resenaRepository.findByReservaId(99L);

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void existsByUsuarioIdAndProductoId_ConResenaExistente_DebeRetornarTrue() {
        // Given
        when(resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L)).thenReturn(true);

        // When
        boolean resultado = resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L);

        // Then
        assertTrue(resultado);
    }

    @Test
    void existsByUsuarioIdAndProductoId_ConResenaInexistente_DebeRetornarFalse() {
        // Given
        when(resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L)).thenReturn(false);

        // When
        boolean resultado = resenaRepository.existsByUsuarioIdAndProductoId(1L, 1L);

        // Then
        assertFalse(resultado);
    }

    @Test
    void findByUsuarioIdOrderByFechaCreacionDesc_ConResenas_DebeRetornarResenasDelUsuario() {
        // Given
        List<Resena> resenas = Arrays.asList(resena2, resena1);
        when(resenaRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L)).thenReturn(resenas);

        // When
        List<Resena> resultado = resenaRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L);

        // Then
        assertEquals(2, resultado.size());
        assertEquals(resena2, resultado.get(0));
        assertEquals(resena1, resultado.get(1));
    }

    @Test
    void findByUsuarioIdOrderByFechaCreacionDesc_SinResenas_DebeRetornarListaVacia() {
        // Given
        when(resenaRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L)).thenReturn(Collections.emptyList());

        // When
        List<Resena> resultado = resenaRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void countByProductoId_ConResenas_DebeRetornarCantidadCorrecta() {
        // Given
        when(resenaRepository.countByProductoId(1L)).thenReturn(2L);

        // When
        long resultado = resenaRepository.countByProductoId(1L);

        // Then
        assertEquals(2L, resultado);
    }

    @Test
    void countByProductoId_SinResenas_DebeRetornarCero() {
        // Given
        when(resenaRepository.countByProductoId(1L)).thenReturn(0L);

        // When
        long resultado = resenaRepository.countByProductoId(1L);

        // Then
        assertEquals(0L, resultado);
    }

    @Test
    void getPuntuacionMediaByProductoId_ConResenas_DebeRetornarPromedio() {
        // Given
        when(resenaRepository.getPuntuacionMediaByProductoId(1L)).thenReturn(4.5);

        // When
        Double resultado = resenaRepository.getPuntuacionMediaByProductoId(1L);

        // Then
        assertEquals(4.5, resultado);
    }

    @Test
    void getPuntuacionMediaByProductoId_SinResenas_DebeRetornarNull() {
        // Given
        when(resenaRepository.getPuntuacionMediaByProductoId(1L)).thenReturn(null);

        // When
        Double resultado = resenaRepository.getPuntuacionMediaByProductoId(1L);

        // Then
        assertNull(resultado);
    }

    @Test
    void countByProductoIdAndPuntuacion_ConResenas_DebeRetornarCantidadCorrecta() {
        // Given
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 5)).thenReturn(1L);

        // When
        Long resultado = resenaRepository.countByProductoIdAndPuntuacion(1L, 5);

        // Then
        assertEquals(1L, resultado);
    }

    @Test
    void countByProductoIdAndPuntuacion_SinResenas_DebeRetornarCero() {
        // Given
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 5)).thenReturn(0L);

        // When
        Long resultado = resenaRepository.countByProductoIdAndPuntuacion(1L, 5);

        // Then
        assertEquals(0L, resultado);
    }

    @Test
    void findByProductoIdWithUsuario_ConResenas_DebeRetornarResenasConUsuario() {
        // Given
        List<Resena> resenas = Arrays.asList(resena1, resena2);
        when(resenaRepository.findByProductoIdWithUsuario(1L)).thenReturn(resenas);

        // When
        List<Resena> resultado = resenaRepository.findByProductoIdWithUsuario(1L);

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.contains(resena1));
        assertTrue(resultado.contains(resena2));
    }

    @Test
    void findByProductoIdWithUsuario_SinResenas_DebeRetornarListaVacia() {
        // Given
        when(resenaRepository.findByProductoIdWithUsuario(1L)).thenReturn(Collections.emptyList());

        // When
        List<Resena> resultado = resenaRepository.findByProductoIdWithUsuario(1L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void existsByReservaId_ConReservaExistente_DebeRetornarTrue() {
        // Given
        when(resenaRepository.existsByReservaId(1L)).thenReturn(true);

        // When
        boolean resultado = resenaRepository.existsByReservaId(1L);

        // Then
        assertTrue(resultado);
    }

    @Test
    void existsByReservaId_ConReservaInexistente_DebeRetornarFalse() {
        // Given
        when(resenaRepository.existsByReservaId(1L)).thenReturn(false);

        // When
        boolean resultado = resenaRepository.existsByReservaId(1L);

        // Then
        assertFalse(resultado);
    }

    @Test
    void countByProductoIdAndPuntuacion_ConDiferentesPuntuaciones_DebeRetornarCantidadesCorrectas() {
        // Given
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 1)).thenReturn(0L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 2)).thenReturn(0L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 3)).thenReturn(1L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 4)).thenReturn(1L);
        when(resenaRepository.countByProductoIdAndPuntuacion(1L, 5)).thenReturn(1L);

        // When & Then
        assertEquals(0L, resenaRepository.countByProductoIdAndPuntuacion(1L, 1));
        assertEquals(0L, resenaRepository.countByProductoIdAndPuntuacion(1L, 2));
        assertEquals(1L, resenaRepository.countByProductoIdAndPuntuacion(1L, 3));
        assertEquals(1L, resenaRepository.countByProductoIdAndPuntuacion(1L, 4));
        assertEquals(1L, resenaRepository.countByProductoIdAndPuntuacion(1L, 5));
    }
}
