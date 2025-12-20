package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Categoria;
import com.autoRent.autoRent.repository.CategoriaRepository;
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
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    private Categoria categoria1;
    private Categoria categoria2;

    @BeforeEach
    void setUp() {
        categoria1 = new Categoria();
        categoria1.setId(1L);
        categoria1.setNombre("SUV");
        categoria1.setDescripcion("Vehículos deportivos utilitarios");
        categoria1.setImagenUrl("/imagenes/suv.jpg");

        categoria2 = new Categoria();
        categoria2.setId(2L);
        categoria2.setNombre("Sedán");
        categoria2.setDescripcion("Vehículos tipo sedán");
        categoria2.setImagenUrl("/imagenes/sedan.jpg");
    }

    @Test
    void obtenerTodas_ConCategorias_DebeRetornarLista() {
        // Given
        List<Categoria> categorias = Arrays.asList(categoria1, categoria2);
        when(categoriaRepository.findAll()).thenReturn(categorias);

        // When
        List<Categoria> resultado = categoriaService.obtenerTodas();

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.contains(categoria1));
        assertTrue(resultado.contains(categoria2));
        verify(categoriaRepository).findAll();
    }

    @Test
    void obtenerTodas_SinCategorias_DebeRetornarListaVacia() {
        // Given
        when(categoriaRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Categoria> resultado = categoriaService.obtenerTodas();

        // Then
        assertTrue(resultado.isEmpty());
        verify(categoriaRepository).findAll();
    }

    @Test
    void guardar_CategoriaValida_DebeGuardarYRetornarCategoria() {
        // Given
        Categoria categoriaNueva = new Categoria();
        categoriaNueva.setNombre("Deportivo");
        categoriaNueva.setDescripcion("Vehículos deportivos");

        when(categoriaRepository.save(categoriaNueva)).thenAnswer(invocation -> {
            Categoria c = invocation.getArgument(0);
            c.setId(3L);
            return c;
        });

        // When
        Categoria resultado = categoriaService.guardar(categoriaNueva);

        // Then
        assertNotNull(resultado);
        assertEquals(3L, resultado.getId());
        assertEquals("Deportivo", resultado.getNombre());
        assertEquals("Vehículos deportivos", resultado.getDescripcion());
        verify(categoriaRepository).save(categoriaNueva);
    }

    @Test
    void guardar_CategoriaConId_DebeActualizarCategoria() {
        // Given
        when(categoriaRepository.save(categoria1)).thenReturn(categoria1);

        // When
        Categoria resultado = categoriaService.guardar(categoria1);

        // Then
        assertEquals(categoria1, resultado);
        verify(categoriaRepository).save(categoria1);
    }

    @Test
    void buscarPorId_CategoriaExiste_DebeRetornarCategoria() {
        // Given
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria1));

        // When
        Categoria resultado = categoriaService.buscarPorId(1L);

        // Then
        assertEquals(categoria1, resultado);
        verify(categoriaRepository).findById(1L);
    }

    @Test
    void buscarPorId_CategoriaNoExiste_DebeRetornarNull() {
        // Given
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Categoria resultado = categoriaService.buscarPorId(99L);

        // Then
        assertNull(resultado);
        verify(categoriaRepository).findById(99L);
    }

    @Test
    void buscarPorId_ConIdNull_DebeRetornarNull() {
        // Given
        when(categoriaRepository.findById(null)).thenReturn(Optional.empty());

        // When
        Categoria resultado = categoriaService.buscarPorId(null);

        // Then
        assertNull(resultado);
        verify(categoriaRepository).findById(null);
    }

    @Test
    void guardar_CategoriaConCamposNull_DebeGuardar() {
        // Given
        Categoria categoriaConNulls = new Categoria();
        categoriaConNulls.setNombre(null);
        categoriaConNulls.setDescripcion(null);
        categoriaConNulls.setImagenUrl(null);

        when(categoriaRepository.save(categoriaConNulls)).thenAnswer(invocation -> {
            Categoria c = invocation.getArgument(0);
            c.setId(4L);
            return c;
        });

        // When
        Categoria resultado = categoriaService.guardar(categoriaConNulls);

        // Then
        assertNotNull(resultado);
        assertEquals(4L, resultado.getId());
        assertNull(resultado.getNombre());
        assertNull(resultado.getDescripcion());
        assertNull(resultado.getImagenUrl());
        verify(categoriaRepository).save(categoriaConNulls);
    }

    @Test
    void guardar_CategoriaConCamposVacios_DebeGuardar() {
        // Given
        Categoria categoriaConVacios = new Categoria();
        categoriaConVacios.setNombre("");
        categoriaConVacios.setDescripcion("");
        categoriaConVacios.setImagenUrl("");

        when(categoriaRepository.save(categoriaConVacios)).thenAnswer(invocation -> {
            Categoria c = invocation.getArgument(0);
            c.setId(5L);
            return c;
        });

        // When
        Categoria resultado = categoriaService.guardar(categoriaConVacios);

        // Then
        assertNotNull(resultado);
        assertEquals(5L, resultado.getId());
        assertEquals("", resultado.getNombre());
        assertEquals("", resultado.getDescripcion());
        assertEquals("", resultado.getImagenUrl());
        verify(categoriaRepository).save(categoriaConVacios);
    }
}
