package com.autoRent.autoRent.model;


import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Caracteristica {

      @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

      private String nombre;

     public Long getId() {return id;}
        public void setId(Long id) {this.id = id;}

    private String imagenUrl;

     @ManyToMany(mappedBy = "caracteristicas")
     private Set<Producto> productos = new HashSet<>();

    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}


    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}
