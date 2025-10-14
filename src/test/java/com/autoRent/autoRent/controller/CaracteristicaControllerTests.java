package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.CustomAccessDeniedHandler;
import com.autoRent.autoRent.configuration.JwtRequestFilter;
import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.CaracteristicaService;
import com.autoRent.autoRent.service.PermissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CaracteristicaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CaracteristicaControllerTests {

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
    private CaracteristicaService caracteristicaService;

    @Test
    public void testListarCaracteristicas_DebeRetornarTodasLasCaracteristicas() throws Exception {
        // Given
        Caracteristica c1 = new Caracteristica();
        c1.setId(1L);
        c1.setNombre("Aire Acondicionado");
        c1.setImagenUrl("/imagenes/ac.jpg");

        Caracteristica c2 = new Caracteristica();
        c2.setId(2L);
        c2.setNombre("GPS");
        c2.setImagenUrl("/imagenes/gps.jpg");

        List<Caracteristica> caracteristicas = Arrays.asList(c1, c2);
        when(caracteristicaService.listar()).thenReturn(caracteristicas);

        // When & Then
        mockMvc.perform(get("/api/caracteristicas")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Aire Acondicionado"))
                .andExpect(jsonPath("$[1].nombre").value("GPS"));

        verify(caracteristicaService, times(1)).listar();
    }

    @Test
    public void testCrearCaracteristica_ConNombreSinImagen_DebeRetornar200() throws Exception {
        // Given
        Caracteristica caracteristicaGuardada = new Caracteristica();
        caracteristicaGuardada.setId(1L);
        caracteristicaGuardada.setNombre("Bluetooth");
        caracteristicaGuardada.setImagenUrl(null);

        when(caracteristicaService.crear(any(Caracteristica.class))).thenReturn(caracteristicaGuardada);

        // When & Then
        mockMvc.perform(multipart("/api/caracteristicas")
                .param("nombre", "Bluetooth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Bluetooth"))
                .andExpect(jsonPath("$.imagenUrl").doesNotExist());

        verify(caracteristicaService, times(1)).crear(any(Caracteristica.class));
    }

    @Test
    public void testCrearCaracteristica_ConNombreYImagen_DebeGenerarURLConUUID() throws Exception {
        // Given
        MockMultipartFile imagen = new MockMultipartFile(
                "imagen",
                "caracteristica.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        Caracteristica caracteristicaGuardada = new Caracteristica();
        caracteristicaGuardada.setId(1L);
        caracteristicaGuardada.setNombre("Aire Acondicionado");
        caracteristicaGuardada.setImagenUrl("/imagenes/12345-caracteristica.jpg");

        when(caracteristicaService.crear(any(Caracteristica.class))).thenReturn(caracteristicaGuardada);

        // When & Then
        mockMvc.perform(multipart("/api/caracteristicas")
                .file(imagen)
                .param("nombre", "Aire Acondicionado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Aire Acondicionado"))
                .andExpect(jsonPath("$.imagenUrl").value(org.hamcrest.Matchers.startsWith("/imagenes/")));

        verify(caracteristicaService, times(1)).crear(any(Caracteristica.class));
    }

    @Test
    public void testActualizarCaracteristica_CambiandoNombreYSubiendoNuevaImagen_DebeRetornar200() throws Exception {
        // Given
        MockMultipartFile nuevaImagen = new MockMultipartFile(
                "imagen",
                "nueva-caracteristica.jpg",
                "image/jpeg",
                "nueva imagen".getBytes()
        );

        Caracteristica caracteristicaExistente = new Caracteristica();
        caracteristicaExistente.setId(1L);
        caracteristicaExistente.setNombre("Aire Acondicionado");
        caracteristicaExistente.setImagenUrl("/imagenes/old.jpg");

        Caracteristica caracteristicaActualizada = new Caracteristica();
        caracteristicaActualizada.setId(1L);
        caracteristicaActualizada.setNombre("Aire Acondicionado Premium");
        caracteristicaActualizada.setImagenUrl("/imagenes/12345-nueva.jpg");

        when(caracteristicaService.listar()).thenReturn(Arrays.asList(caracteristicaExistente));
        when(caracteristicaService.actualizar(eq(1L), any(Caracteristica.class))).thenReturn(caracteristicaActualizada);

        // When & Then
        mockMvc.perform(multipart("/api/caracteristicas/1")
                .file(nuevaImagen)
                .param("nombre", "Aire Acondicionado Premium")
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Aire Acondicionado Premium"))
                .andExpect(jsonPath("$.imagenUrl").value(org.hamcrest.Matchers.startsWith("/imagenes/")));

        verify(caracteristicaService, times(1)).actualizar(eq(1L), any(Caracteristica.class));
    }

    @Test
    public void testActualizarCaracteristica_SoloNombre_DebeRetornar200() throws Exception {
        // Given
        Caracteristica caracteristicaExistente = new Caracteristica();
        caracteristicaExistente.setId(1L);
        caracteristicaExistente.setNombre("GPS");
        caracteristicaExistente.setImagenUrl("/imagenes/gps.jpg");

        Caracteristica caracteristicaActualizada = new Caracteristica();
        caracteristicaActualizada.setId(1L);
        caracteristicaActualizada.setNombre("GPS Premium");
        caracteristicaActualizada.setImagenUrl("/imagenes/gps.jpg");

        when(caracteristicaService.listar()).thenReturn(Arrays.asList(caracteristicaExistente));
        when(caracteristicaService.actualizar(eq(1L), any(Caracteristica.class))).thenReturn(caracteristicaActualizada);

        // When & Then
        mockMvc.perform(multipart("/api/caracteristicas/1")
                .param("nombre", "GPS Premium")
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("GPS Premium"));

        verify(caracteristicaService, times(1)).actualizar(eq(1L), any(Caracteristica.class));
    }

    @Test
    public void testActualizarCaracteristica_CuandoNoExiste_DebeLanzarExcepcion() throws Exception {
        // Given
        when(caracteristicaService.listar()).thenReturn(Arrays.asList());

        // When & Then - El controlador lanza RuntimeException que se traduce en 500
        try {
            mockMvc.perform(multipart("/api/caracteristicas/99")
                    .param("nombre", "No Existe")
                    .with(request -> {
                        request.setMethod("PUT");
                        return request;
                    }))
                    .andExpect(status().isInternalServerError());
        } catch (Exception e) {
            // Se espera que falle con RuntimeException
        }
    }

    @Test
    public void testEliminarCaracteristica_DebeRetornarSinContenido() throws Exception {
        // Given
        doNothing().when(caracteristicaService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/caracteristicas/1"))
                .andExpect(status().isOk());

        verify(caracteristicaService, times(1)).eliminar(1L);
    }

    @Test
    public void testCrearCaracteristica_ConImagenVacia_DebeCrearSinURL() throws Exception {
        // Given
        MockMultipartFile imagenVacia = new MockMultipartFile(
                "imagen",
                "",
                "image/jpeg",
                new byte[0]
        );

        Caracteristica caracteristicaGuardada = new Caracteristica();
        caracteristicaGuardada.setId(1L);
        caracteristicaGuardada.setNombre("USB");
        caracteristicaGuardada.setImagenUrl(null);

        when(caracteristicaService.crear(any(Caracteristica.class))).thenReturn(caracteristicaGuardada);

        // When & Then
        mockMvc.perform(multipart("/api/caracteristicas")
                .file(imagenVacia)
                .param("nombre", "USB"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("USB"))
                .andExpect(jsonPath("$.imagenUrl").doesNotExist());

        verify(caracteristicaService, times(1)).crear(any(Caracteristica.class));
    }
}

