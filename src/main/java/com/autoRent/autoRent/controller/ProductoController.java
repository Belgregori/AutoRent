package com.autoRent.autoRent.controller;


import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"})
@RestController
@RequestMapping("/api/productos")

public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProducto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") double precio,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {





        // Validación de campos obligatorios
        if (nombre.isEmpty() || descripcion.isEmpty() || precio <= 0 || categoria.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("Error","Campos obligatorios incompletos"));
        }



        // Crear y guardar producto
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setCategoria(categoria);

        if (imagen != null && !imagen.isEmpty()) {
            try {
                producto.setImagenData(imagen.getBytes());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("Error", "No se pudo guardar la imagen"));
            }
        }

        productoRepository.save(producto);

        return ResponseEntity.ok(producto);
    }

    private String saveImage(MultipartFile imagen) {
        if(imagen == null || imagen.isEmpty()) {
            return null;
        }
        String fileName = imagen.getOriginalFilename();

        return "/images/" + fileName;
    }


}
