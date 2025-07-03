package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.model.Categoria;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.repository.CategoriaRepository;
import com.autoRent.autoRent.repository.ProductoRepository;
import com.autoRent.autoRent.repository.CaracteristicaRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @PostMapping
    public ResponseEntity<?> agregarProducto(@RequestParam("nombre") String nombre,
                                             @RequestParam("descripcion") String descripcion,
                                             @RequestParam("precio") double precio,
                                             @RequestParam("categoria") Categoria categoria,
                                             @RequestParam(value = "imagen_", required = false) MultipartFile[] imagenes) {

        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setCategoria(categoria);


        if (imagenes != null && imagenes.length > 0) {
            for (MultipartFile imagen : imagenes) {
                try {
                    byte[] imagenData = imagen.getBytes();
                    // Guardá la imagen si necesitás (ej: producto.getImagenesData().add(imagenData);)
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la imagen.");
                }
            }
        }

        productoRepository.save(producto);
        return ResponseEntity.ok().body(java.util.Map.of("mensaje", "Producto agregado con éxito"));
    }

    @GetMapping("/random")
    public List<Producto> getRandomProductos() {
        List<Producto> todos = productoRepository.findAll();
        Collections.shuffle(todos);
        return todos.stream().limit(4).toList();
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }


    @PostMapping("/{id}/caracteristicas")
    public ResponseEntity<?> asociarCaracteristica(
            @PathVariable Long id,
            @RequestBody Caracteristica caracteristica) {

        Producto producto = productoRepository.findById(id).orElse(null);
        Caracteristica c = caracteristicaRepository.findById(caracteristica.getId()).orElse(null);

        if (producto == null || c == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto o característica no encontrada.");
        }

        producto.getCaracteristicas().add(c);
        productoRepository.save(producto);

        return ResponseEntity.ok().body("Característica asociada con éxito.");
    }
}
