package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepo;

    public ProductoService(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }


    public List<Producto> productosPorCaracteristica(Long caractId) {
        return productoRepo.findByCaracteristicas_Id(caractId);
    }

    public Optional<Producto> obtenerProductoPorId(Long productoId) {
        return productoRepo.findById(productoId);
    }


    public Producto findById(Long productoId) {
        return productoRepo.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
    }
}
