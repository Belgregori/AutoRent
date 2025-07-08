package com.autoRent.autoRent.controller;


import com.autoRent.autoRent.model.Categoria;
import com.autoRent.autoRent.repository.CategoriaRepository;
import com.autoRent.autoRent.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.File;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {


    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaService.obtenerTodas();
    }

    @PostMapping
    public ResponseEntity<?> crearCategoria(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("imagen") MultipartFile imagen) {

        try {
            // Ruta donde se guardará la imagen
            String carpeta = System.getProperty("user.dir") + "/uploads/imagenes/";
            File directorio = new File(carpeta);
            if (!directorio.exists()) {
                directorio.mkdirs(); // crea la carpeta si no existe
            }

            // Nombre único para la imagen
            String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
            String ruta = carpeta + nombreArchivo;

            // Guardar la imagen en disco
            imagen.transferTo(new File(ruta));

            // Crear la categoría con la URL pública de la imagen
            Categoria categoria = new Categoria();
            categoria.setNombre(nombre);
            categoria.setDescripcion(descripcion);
            categoria.setImagenUrl("/imagenes/" + nombreArchivo); // esta URL se usará en el frontend

            categoriaRepository.save(categoria);
            return ResponseEntity.ok(categoria);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al guardar la imagen: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCategoria(@PathVariable Long id) {
        Categoria cat = categoriaService.buscarPorId(id);
        if (cat == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cat);
    }
}
