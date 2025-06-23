
package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5175"})
@RestController
@RequestMapping("/api/productos")
public class HomeController {

    private final ProductoRepository productoRepository;

    public HomeController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping("/random")
    public List<Producto> getRandomProducts() {
        List<Producto> productos = productoRepository.findAll();
        Collections.shuffle(productos);
        return productos.stream().limit(10).toList();
    }
}