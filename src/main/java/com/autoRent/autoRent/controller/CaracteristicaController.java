package com.autoRent.autoRent.controller;


import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.service.CaracteristicaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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


    @PostMapping
    public Caracteristica crear(@RequestBody Caracteristica c) {
        return service.crear(c);
    }

    @PutMapping("/{id}")
    public Caracteristica actualizar(@PathVariable Long id, @RequestBody Caracteristica c) {
        return service.actualizar(id, c);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
