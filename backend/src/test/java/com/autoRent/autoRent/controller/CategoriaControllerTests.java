package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.CustomAccessDeniedHandler;
import com.autoRent.autoRent.configuration.JwtRequestFilter;
import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Categoria;
import com.autoRent.autoRent.repository.CategoriaRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.CategoriaService;
import com.autoRent.autoRent.service.PermissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoriaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CategoriaControllerTests {

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
    private CategoriaRepository categoriaRepository;

    @MockitoBean
    private CategoriaService categoriaService;

    @Test
    public void testGetCategorias_DebeRetornar200YListaDeCategorias() throws Exception {
        // Given
        Categoria categoria1 = new Categoria();
        categoria1.setId(1L);
        categoria1.setNombre("SUV");
        categoria1.setDescripcion("Vehículos deportivos utilitarios");
        categoria1.setImagenUrl("/imagenes/suv.jpg");

        Categoria categoria2 = new Categoria();
        categoria2.setId(2L);
        categoria2.setNombre("Sedán");
        categoria2.setDescripcion("Vehículos tipo sedán");
        categoria2.setImagenUrl("/imagenes/sedan.jpg");

        List<Categoria> categorias = Arrays.asList(categoria1, categoria2);
        when(categoriaService.obtenerTodas()).thenReturn(categorias);

        // When & Then
        mockMvc.perform(get("/api/categorias")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("SUV"))
                .andExpect(jsonPath("$[0].descripcion").value("Vehículos deportivos utilitarios"))
                .andExpect(jsonPath("$[1].nombre").value("Sedán"));

        verify(categoriaService, times(1)).obtenerTodas();
    }

    @Test
    public void testCrearCategoria_ConImagenValida_DebeRetornar200() throws Exception {
        // Given
        MockMultipartFile imagen = new MockMultipartFile(
                "imagen",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria cat = invocation.getArgument(0);
            cat.setId(1L);
            return cat;
        });

        // When & Then
        mockMvc.perform(multipart("/api/categorias")
                .file(imagen)
                .param("nombre", "Deportivo")
                .param("descripcion", "Vehículos deportivos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Deportivo"))
                .andExpect(jsonPath("$.descripcion").value("Vehículos deportivos"));

        verify(categoriaRepository, times(1)).save(any(Categoria.class));
    }

    @Test
    public void testCrearCategoria_ConErrorIO_DebeRetornar500() throws Exception {
        // Given - Crear un MockMultipartFile que simule una IOException
        MockMultipartFile imagen = new MockMultipartFile(
                "imagen",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        ) {
            @Override
            public void transferTo(java.io.File dest) throws IOException {
                throw new IOException("Error simulado al guardar la imagen");
            }
        };

        // When & Then
        mockMvc.perform(multipart("/api/categorias")
                .file(imagen)
                .param("nombre", "Deportivo")
                .param("descripcion", "Vehículos deportivos"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Error al guardar la imagen")));

        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    public void testObtenerCategoria_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("SUV");
        categoria.setDescripcion("Vehículos deportivos utilitarios");
        categoria.setImagenUrl("/imagenes/suv.jpg");

        when(categoriaService.buscarPorId(1L)).thenReturn(categoria);

        // When & Then
        mockMvc.perform(get("/api/categorias/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("SUV"));

        verify(categoriaService, times(1)).buscarPorId(1L);
    }

    @Test
    public void testObtenerCategoria_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(categoriaService.buscarPorId(99L)).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/categorias/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(categoriaService, times(1)).buscarPorId(99L);
    }

    @Test
    public void testEliminarCategoria_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("SUV");
        categoria.setImagenUrl("/imagenes/suv.jpg");

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        doNothing().when(categoriaRepository).deleteById(1L);

        // When & Then
        mockMvc.perform(delete("/api/categorias/1"))
                .andExpect(status().isOk());

        verify(categoriaRepository, times(1)).findById(1L);
        verify(categoriaRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testEliminarCategoria_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(delete("/api/categorias/99"))
                .andExpect(status().isNotFound());

        verify(categoriaRepository, times(1)).findById(99L);
        verify(categoriaRepository, never()).deleteById(anyLong());
    }
}

