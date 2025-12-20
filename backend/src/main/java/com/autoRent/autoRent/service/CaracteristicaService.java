package com.autoRent.autoRent.service;


import com.autoRent.autoRent.model.Caracteristica;
import com.autoRent.autoRent.repository.CaracteristicaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaracteristicaService {

  private final CaracteristicaRepository caracteristicaRepository;

  public CaracteristicaService(CaracteristicaRepository caracteristicaRepository){
    this.caracteristicaRepository = caracteristicaRepository;
  }

    public List<Caracteristica> listar() {
        return caracteristicaRepository.findAll();
    }

    public Caracteristica crear(Caracteristica c) {
        return caracteristicaRepository.save(c);
    }

    public Caracteristica actualizar(Long id, Caracteristica datos) {
        Caracteristica original = caracteristicaRepository.findById(id).orElseThrow();
        original.setNombre(datos.getNombre());
        return caracteristicaRepository.save(original);
    }

    public void eliminar(Long id) {
        caracteristicaRepository.deleteById(id);
    }

    public Caracteristica buscarPorId(Long id) {
        return caracteristicaRepository.findById(id).orElseThrow();
    }
}









