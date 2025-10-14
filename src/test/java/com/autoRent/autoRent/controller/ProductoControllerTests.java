package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.configuration.CustomAccessDeniedHandler;
import com.autoRent.autoRent.configuration.JwtRequestFilter;
import com.autoRent.autoRent.configuration.JwtUtil;
import com.autoRent.autoRent.model.Categoria;
import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.repository.CaracteristicaRepository;
import com.autoRent.autoRent.repository.CategoriaRepository;
import com.autoRent.autoRent.repository.ProductoRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.PermissionService;
import com.autoRent.autoRent.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductoController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductoControllerTests {

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
    private ProductoService productoService;

    @MockitoBean
    private ProductoRepository productoRepository;

    @MockitoBean
    private CaracteristicaRepository caracteristicaRepository;

    @MockitoBean
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAgregarProducto_ConDatosValidos_DebeRetornar200() throws Exception {
        // Given
        MockMultipartFile imagen = new MockMultipartFile(
                "imagen_",
                "auto.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        Producto productoGuardado = new Producto();
        productoGuardado.setId(1L);
        productoGuardado.setNombre("Toyota Corolla");
        productoGuardado.setDescripcion("Sedán compacto");
        productoGuardado.setPrecio(50000.0);

        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // When & Then
        mockMvc.perform(multipart("/api/productos")
                .file(imagen)
                .param("nombre", "Toyota Corolla")
                .param("descripcion", "Sedán compacto")
                .param("precio", "50000.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Producto agregado con éxito"));

        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    public void testAgregarProducto_ConImagenNula_DebeRetornar200() throws Exception {
        // Given
        Producto productoGuardado = new Producto();
        productoGuardado.setId(1L);
        productoGuardado.setNombre("Toyota Corolla");

        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // When & Then
        mockMvc.perform(multipart("/api/productos")
                .param("nombre", "Toyota Corolla")
                .param("descripcion", "Sedán compacto")
                .param("precio", "50000.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Producto agregado con éxito"));

        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    public void testAgregarProducto_ConErrorEnImagen_DebeRetornar500() throws Exception {
        // Given - MockMultipartFile que lance IOException al obtener bytes
        MockMultipartFile imagen = new MockMultipartFile(
                "imagen_",
                "auto.jpg",
                "image/jpeg",
                "test image content".getBytes()
        ) {
            @Override
            public byte[] getBytes() throws IOException {
                throw new IOException("Error al procesar la imagen");
            }
        };

        // When & Then
        mockMvc.perform(multipart("/api/productos")
                .file(imagen)
                .param("nombre", "Toyota Corolla")
                .param("descripcion", "Sedán compacto")
                .param("precio", "50000.0"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error al procesar la imagen."));

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    public void testGetRandomProductos_DebeRetornarCantidadEspecificada() throws Exception {
        // Given
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setNombre("Toyota Corolla");
        p1.setPrecio(50000.0);
        p1.setImagenesData(new ArrayList<>());

        Producto p2 = new Producto();
        p2.setId(2L);
        p2.setNombre("Honda Civic");
        p2.setPrecio(55000.0);
        p2.setImagenesData(new ArrayList<>());

        Producto p3 = new Producto();
        p3.setId(3L);
        p3.setNombre("Ford Focus");
        p3.setPrecio(48000.0);
        p3.setImagenesData(new ArrayList<>());

        Producto p4 = new Producto();
        p4.setId(4L);
        p4.setNombre("Mazda 3");
        p4.setPrecio(52000.0);
        p4.setImagenesData(new ArrayList<>());

        Producto p5 = new Producto();
        p5.setId(5L);
        p5.setNombre("Nissan Sentra");
        p5.setPrecio(49000.0);
        p5.setImagenesData(new ArrayList<>());

        List<Producto> productos = Arrays.asList(p1, p2, p3, p4, p5);
        when(productoRepository.findAll()).thenReturn(productos);

        // When & Then
        mockMvc.perform(get("/api/productos/random")
                .param("cantidad", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(5))
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].nombre").exists())
                .andExpect(jsonPath("$[0].precio").exists());

        verify(productoRepository, times(1)).findAll();
    }

    @Test
    public void testActualizarProducto_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        Producto productoExistente = new Producto();
        productoExistente.setId(1L);
        productoExistente.setNombre("Toyota Corolla");
        productoExistente.setDescripcion("Sedán compacto");
        productoExistente.setPrecio(50000.0);

        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNombre("Sedán");

        Producto productoActualizado = new Producto();
        productoActualizado.setNombre("Toyota Corolla 2024");
        productoActualizado.setDescripcion("Sedán compacto actualizado");
        productoActualizado.setPrecio(55000.0);
        productoActualizado.setCategoria(categoria);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoExistente));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoExistente);

        // When & Then
        mockMvc.perform(put("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productoActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    public void testActualizarProducto_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        Producto productoActualizado = new Producto();
        productoActualizado.setNombre("Toyota Corolla");
        productoActualizado.setDescripcion("Sedán compacto");
        productoActualizado.setPrecio(50000.0);

        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(put("/api/productos/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productoActualizado)))
                .andExpect(status().isNotFound());

        verify(productoRepository, times(1)).findById(99L);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    public void testEliminarProducto_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        when(productoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productoRepository).deleteById(1L);

        // When & Then
        mockMvc.perform(delete("/api/productos/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Producto eliminado con éxito."));

        verify(productoRepository, times(1)).existsById(1L);
        verify(productoRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testEliminarProducto_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(productoRepository.existsById(99L)).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/productos/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Producto no encontrado."));

        verify(productoRepository, times(1)).existsById(99L);
        verify(productoRepository, never()).deleteById(any());
    }

    @Test
    public void testAsociarCaracteristica_CuandoAmbosExisten_DebeRetornar200() throws Exception {
        // Given
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");
        producto.setCaracteristicas(new HashSet<>());

        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setId(1L);
        caracteristica.setNombre("Aire Acondicionado");

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(caracteristicaRepository.findById(1L)).thenReturn(Optional.of(caracteristica));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Map<String, Object> request = new HashMap<>();
        request.put("id", 1L);

        // When & Then
        mockMvc.perform(post("/api/productos/1/caracteristicas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Característica asociada con éxito."));

        verify(productoRepository, times(1)).findById(1L);
        verify(caracteristicaRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    public void testAsociarCaracteristica_CuandoProductoNoExiste_DebeRetornar404() throws Exception {
        // Given
        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setId(1L);

        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> request = new HashMap<>();
        request.put("id", 1L);

        // When & Then
        mockMvc.perform(post("/api/productos/99/caracteristicas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Producto o característica no encontrada."));

        verify(productoRepository, times(1)).findById(99L);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    public void testAsociarCaracteristica_CuandoCaracteristicaNoExiste_DebeRetornar404() throws Exception {
        // Given
        Producto producto = new Producto();
        producto.setId(1L);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(caracteristicaRepository.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> request = new HashMap<>();
        request.put("id", 99L);

        // When & Then
        mockMvc.perform(post("/api/productos/1/caracteristicas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Producto o característica no encontrada."));

        verify(productoRepository, times(1)).findById(1L);
        verify(caracteristicaRepository, times(1)).findById(99L);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    public void testObtenerProductoPorId_CuandoExiste_DebeRetornar200() throws Exception {
        // Given
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Toyota Corolla");
        producto.setDescripcion("Sedán compacto");
        producto.setPrecio(50000.0);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        // When & Then
        mockMvc.perform(get("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Toyota Corolla"));

        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    public void testObtenerProductoPorId_CuandoNoExiste_DebeRetornar404() throws Exception {
        // Given
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/productos/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Producto no encontrado"));

        verify(productoRepository, times(1)).findById(99L);
    }

    @Test
    public void testListarProductos_DebeRetornarListaCompleta() throws Exception {
        // Given
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setNombre("Toyota Corolla");

        Producto p2 = new Producto();
        p2.setId(2L);
        p2.setNombre("Honda Civic");

        List<Producto> productos = Arrays.asList(p1, p2);
        when(productoRepository.findAll()).thenReturn(productos);

        // When & Then
        mockMvc.perform(get("/api/productos")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Toyota Corolla"))
                .andExpect(jsonPath("$[1].nombre").value("Honda Civic"));

        verify(productoRepository, times(1)).findAll();
    }
}

