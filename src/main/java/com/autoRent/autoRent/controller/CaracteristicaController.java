package com.autoRent.autoRent.controller;


import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.service.CaracteristicaService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/caracteristicas")
public class CaracteristicaController {

    private final CaracteristicaService service;

    public CaracteristicaController(CaracteristicaService servcice){
        this.service = servcice;
    }

    @GetMapping
    public List<Caracteristica> listar() {
        return service.listar();
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Caracteristica crear(
           @RequestParam("nombre") String nombre,
           @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {

        String imagenUrl = null;
        if(imagen != null && !imagen.isEmpty()) {
            String uploadsDir = System.getProperty("user.dir") + "/uploads/imagenes/";
            String filename = UUID.randomUUID() + "_" + imagen.getOriginalFilename();
            Path filePath = Paths.get(uploadsDir + filename);
            Files.createDirectories(filePath.getParent());
            imagen.transferTo(filePath);


            imagenUrl = "/imagenes/" + filename;
        }

        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setNombre(nombre);
        caracteristica.setImagenUrl(imagenUrl);

        return service.crear(caracteristica);


    }


    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Caracteristica actualizar(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {

        Caracteristica c = service.listar()
                .stream()
                .filter(x -> x.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No existe"));

        c.setNombre(nombre);

        if (imagen != null && !imagen.isEmpty()) {
            String uploadsDir = System.getProperty("user.dir") + "/uploads/imagenes/";
            String filename = UUID.randomUUID() + "_" + imagen.getOriginalFilename();
            Path filePath = Paths.get(uploadsDir + filename);
            Files.createDirectories(filePath.getParent());
            imagen.transferTo(filePath);
            c.setImagenUrl("/imagenes/" + filename);
        }

        return service.actualizar(id, c);
    }


    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
