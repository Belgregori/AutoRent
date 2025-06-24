package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.model.Producto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

// Agrega tu repository o service para obtener productos
import org.springframework.beans.factory.annotation.Autowired;
import com.autoRent.autoRent.repository.ProductoRepository;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @PostMapping
    public ResponseEntity<?> agregarProducto(@RequestParam("nombre") String nombre,
                                             @RequestParam("descripcion") String descripcion,
                                             @RequestParam("precio") double precio,
                                             @RequestParam("categoria") String categoria,
                                             @RequestParam(value = "imagen_", required = false) MultipartFile[] imagenes) {
        // Crear el producto
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setCategoria(categoria);

        // Verificar si se recibieron imágenes
        if (imagenes != null && imagenes.length > 0) {
            for (MultipartFile imagen : imagenes) {
                try {
                    // Convertir la imagen a un array de bytes
                    byte[] imagenData = imagen.getBytes();
                    // Aquí guardas cada imagen (puedes almacenarlas como una lista si es necesario)
                    // Por ejemplo, puedes agregar las imágenes en una lista si deseas almacenar varias
                    // producto.addImagen(imagenData); // Aquí puedes añadir la imagen a una lista si necesitas varias
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la imagen.");
                }
            }
        }

        // Aquí puedes guardar el producto en la base de datos
        // productoService.guardarProducto(producto);

        return ResponseEntity.ok().body(java.util.Map.of("mensaje", "Producto agregado con éxito"));
    }

    // Nuevo endpoint para productos aleatorios
    @GetMapping("/random")
    public List<Producto> getRandomProductos() {
        List<Producto> todos = productoRepository.findAll();
        Collections.shuffle(todos);
        return todos.stream().limit(4).toList(); // Devuelve 4 productos aleatorios
    }
}
