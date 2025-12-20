package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Favorito;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.FavoritoRepository;
import com.autoRent.autoRent.repository.ProductoRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
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
class FavoritoServiceTest {

    @Mock
    private FavoritoRepository favoritoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private FavoritoService favoritoService;

    private Usuario usuario;
    private Producto producto;
    private Favorito favorito;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@test.com");

        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");

        favorito = new Favorito();
        favorito.setId(1L);
        favorito.setUsuario(usuario);
        favorito.setProducto(producto);
    }

    @Test
    void obtenerFavoritosPorUsuario_ConFavoritos_DebeRetornarLista() {
        // Given
        List<Favorito> favoritos = Arrays.asList(favorito);
        when(favoritoRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L)).thenReturn(favoritos);

        // When
        List<Favorito> resultado = favoritoService.obtenerFavoritosPorUsuario(1L);

        // Then
        assertEquals(1, resultado.size());
        assertEquals(favorito, resultado.get(0));
        verify(favoritoRepository).findByUsuarioIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void obtenerFavoritosPorUsuario_SinFavoritos_DebeRetornarListaVacia() {
        // Given
        when(favoritoRepository.findByUsuarioIdOrderByFechaCreacionDesc(1L)).thenReturn(Arrays.asList());

        // When
        List<Favorito> resultado = favoritoService.obtenerFavoritosPorUsuario(1L);

        // Then
        assertTrue(resultado.isEmpty());
        verify(favoritoRepository).findByUsuarioIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void agregarFavorito_ConDatosValidos_DebeCrearFavorito() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Optional.empty());
        when(favoritoRepository.save(any(Favorito.class))).thenReturn(favorito);

        // When
        Favorito resultado = favoritoService.agregarFavorito(1L, 1L);

        // Then
        assertNotNull(resultado);
        assertEquals(favorito, resultado);
        verify(usuarioRepository).findById(1L);
        verify(productoRepository).findById(1L);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 1L);
        verify(favoritoRepository).save(any(Favorito.class));
    }

    @Test
    void agregarFavorito_UsuarioNoExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoritoService.agregarFavorito(99L, 1L));

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(usuarioRepository).findById(99L);
        verify(productoRepository, never()).findById(anyLong());
        verify(favoritoRepository, never()).save(any(Favorito.class));
    }

    @Test
    void agregarFavorito_ProductoNoExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoritoService.agregarFavorito(1L, 99L));

        assertEquals("Producto no encontrado", exception.getMessage());
        verify(usuarioRepository).findById(1L);
        verify(productoRepository).findById(99L);
        verify(favoritoRepository, never()).save(any(Favorito.class));
    }

    @Test
    void agregarFavorito_FavoritoYaExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Optional.of(favorito));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoritoService.agregarFavorito(1L, 1L));

        assertEquals("El producto ya está en favoritos", exception.getMessage());
        verify(usuarioRepository).findById(1L);
        verify(productoRepository).findById(1L);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 1L);
        verify(favoritoRepository, never()).save(any(Favorito.class));
    }

    @Test
    void eliminarFavorito_FavoritoExiste_DebeEliminarYRetornarTrue() {
        // Given
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Optional.of(favorito));
        doNothing().when(favoritoRepository).delete(favorito);

        // When
        boolean resultado = favoritoService.eliminarFavorito(1L, 1L);

        // Then
        assertTrue(resultado);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 1L);
        verify(favoritoRepository).delete(favorito);
    }

    @Test
    void eliminarFavorito_FavoritoNoExiste_DebeRetornarFalse() {
        // Given
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 99L)).thenReturn(Optional.empty());

        // When
        boolean resultado = favoritoService.eliminarFavorito(1L, 99L);

        // Then
        assertFalse(resultado);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 99L);
        verify(favoritoRepository, never()).delete(any(Favorito.class));
    }

    @Test
    void esFavorito_EsFavorito_DebeRetornarTrue() {
        // Given
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 1L)).thenReturn(Optional.of(favorito));

        // When
        boolean resultado = favoritoService.esFavorito(1L, 1L);

        // Then
        assertTrue(resultado);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 1L);
    }

    @Test
    void esFavorito_NoEsFavorito_DebeRetornarFalse() {
        // Given
        when(favoritoRepository.findByUsuarioIdAndProductoId(1L, 99L)).thenReturn(Optional.empty());

        // When
        boolean resultado = favoritoService.esFavorito(1L, 99L);

        // Then
        assertFalse(resultado);
        verify(favoritoRepository).findByUsuarioIdAndProductoId(1L, 99L);
    }

    @Test
    void contarFavoritosPorUsuario_ConFavoritos_DebeRetornarCantidad() {
        // Given
        when(favoritoRepository.countByUsuarioId(1L)).thenReturn(3L);

        // When
        long resultado = favoritoService.contarFavoritosPorUsuario(1L);

        // Then
        assertEquals(3L, resultado);
        verify(favoritoRepository).countByUsuarioId(1L);
    }

    @Test
    void contarFavoritosPorUsuario_SinFavoritos_DebeRetornarCero() {
        // Given
        when(favoritoRepository.countByUsuarioId(1L)).thenReturn(0L);

        // When
        long resultado = favoritoService.contarFavoritosPorUsuario(1L);

        // Then
        assertEquals(0L, resultado);
        verify(favoritoRepository).countByUsuarioId(1L);
    }

    @Test
    void obtenerUsuarioIdPorUsername_UsuarioExiste_DebeRetornarId() {
        // Given
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(Optional.of(usuario));

        // When
        Long resultado = favoritoService.obtenerUsuarioIdPorUsername("test@test.com");

        // Then
        assertEquals(1L, resultado);
        verify(usuarioRepository).findByEmail("test@test.com");
    }

    @Test
    void obtenerUsuarioIdPorUsername_UsuarioNoExiste_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> favoritoService.obtenerUsuarioIdPorUsername("noexiste@test.com"));

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(usuarioRepository).findByEmail("noexiste@test.com");
    }
}
