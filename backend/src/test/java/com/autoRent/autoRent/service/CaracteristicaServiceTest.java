package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.repository.CaracteristicaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CaracteristicaServiceTest {

    @Mock
    private CaracteristicaRepository caracteristicaRepository;

    @InjectMocks
    private CaracteristicaService caracteristicaService;

    private Caracteristica caracteristica;

    @BeforeEach
    void setUp() {
        caracteristica = new Caracteristica();
        caracteristica.setId(1L);
        caracteristica.setNombre("Aire Acondicionado");
    }

    @Test
    void listar_ConCaracteristicas_DebeRetornarLista() {
        // Given
        List<Caracteristica> caracteristicas = Arrays.asList(caracteristica);
        when(caracteristicaRepository.findAll()).thenReturn(caracteristicas);

        // When
        List<Caracteristica> resultado = caracteristicaService.listar();

        // Then
        assertEquals(1, resultado.size());
        assertEquals(caracteristica, resultado.get(0));
        verify(caracteristicaRepository).findAll();
    }

    @Test
    void listar_SinCaracteristicas_DebeRetornarListaVacia() {
        // Given
        when(caracteristicaRepository.findAll()).thenReturn(Collections.emptyList());

        // When
        List<Caracteristica> resultado = caracteristicaService.listar();

        // Then
        assertTrue(resultado.isEmpty());
        verify(caracteristicaRepository).findAll();
    }

    @Test
    void crear_ConCaracteristicaValida_DebeCrearYRetornar() {
        // Given
        Caracteristica nuevaCaracteristica = new Caracteristica();
        nuevaCaracteristica.setNombre("GPS");
        
        Caracteristica caracteristicaGuardada = new Caracteristica();
        caracteristicaGuardada.setId(2L);
        caracteristicaGuardada.setNombre("GPS");
        
        when(caracteristicaRepository.save(any(Caracteristica.class))).thenReturn(caracteristicaGuardada);

        // When
        Caracteristica resultado = caracteristicaService.crear(nuevaCaracteristica);

        // Then
        assertNotNull(resultado);
        assertEquals(2L, resultado.getId());
        assertEquals("GPS", resultado.getNombre());
        verify(caracteristicaRepository).save(nuevaCaracteristica);
    }

    @Test
    void actualizar_ConIdExistente_DebeActualizarYRetornar() {
        // Given
        Caracteristica caracteristicaExistente = new Caracteristica();
        caracteristicaExistente.setId(1L);
        caracteristicaExistente.setNombre("Aire Acondicionado");

        Caracteristica datosActualizacion = new Caracteristica();
        datosActualizacion.setNombre("Aire Acondicionado Premium");

        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.of(caracteristicaExistente));
        when(caracteristicaRepository.save(any(Caracteristica.class))).thenReturn(caracteristicaExistente);

        // When
        Caracteristica resultado = caracteristicaService.actualizar(1L, datosActualizacion);

        // Then
        assertNotNull(resultado);
        assertEquals("Aire Acondicionado Premium", resultado.getNombre());
        verify(caracteristicaRepository).findById(1L);
        verify(caracteristicaRepository).save(caracteristicaExistente);
    }

    @Test
    void actualizar_ConIdInexistente_DebeLanzarExcepcion() {
        // Given
        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            caracteristicaService.actualizar(1L, new Caracteristica()));
        verify(caracteristicaRepository).findById(1L);
        verify(caracteristicaRepository, never()).save(any(Caracteristica.class));
    }

    @Test
    void eliminar_ConIdExistente_DebeEliminar() {
        // When
        caracteristicaService.eliminar(1L);

        // Then
        verify(caracteristicaRepository).deleteById(1L);
    }

    @Test
    void eliminar_ConIdInexistente_DebeEliminarSinError() {
        // When
        caracteristicaService.eliminar(1L);

        // Then
        verify(caracteristicaRepository).deleteById(1L);
    }

    @Test
    void buscarPorId_ConIdExistente_DebeRetornarCaracteristica() {
        // Given
        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.of(caracteristica));

        // When
        Caracteristica resultado = caracteristicaService.buscarPorId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(caracteristica, resultado);
        verify(caracteristicaRepository).findById(1L);
    }

    @Test
    void buscarPorId_ConIdInexistente_DebeLanzarExcepcion() {
        // Given
        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            caracteristicaService.buscarPorId(1L));
        verify(caracteristicaRepository).findById(1L);
    }

    @Test
    void crear_ConCaracteristicaNull_DebeManejarGracefully() {
        // Given
        when(caracteristicaRepository.save(null)).thenReturn(null);

        // When
        Caracteristica resultado = caracteristicaService.crear(null);

        // Then
        assertNull(resultado);
        verify(caracteristicaRepository).save(null);
    }

    @Test
    void actualizar_ConDatosNull_DebeActualizarSoloNombre() {
        // Given
        Caracteristica caracteristicaExistente = new Caracteristica();
        caracteristicaExistente.setId(1L);
        caracteristicaExistente.setNombre("Aire Acondicionado");

        Caracteristica datosActualizacion = new Caracteristica();
        datosActualizacion.setNombre("GPS");

        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.of(caracteristicaExistente));
        when(caracteristicaRepository.save(any(Caracteristica.class))).thenReturn(caracteristicaExistente);

        // When
        Caracteristica resultado = caracteristicaService.actualizar(1L, datosActualizacion);

        // Then
        assertEquals("GPS", resultado.getNombre());
        verify(caracteristicaRepository).save(caracteristicaExistente);
    }
}
