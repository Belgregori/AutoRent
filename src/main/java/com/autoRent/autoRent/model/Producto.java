package com.autoRent.autoRent.model;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String nombre;
    private String descripcion;
    private double precio;
    private String categoria;


    @Lob
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "imagenes_producto", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen")
    private List<byte[]> imagenesData = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name= "producto_caracteristica",
            joinColumns = @JoinColumn(name = "producto_id"),
            inverseJoinColumns = @JoinColumn(name = "caracteristica_id")
    )
    private Set<Caracteristica> caracteristicas = new HashSet<>();

    public Set<Caracteristica> getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(Set<Caracteristica> caracteristicas) {
        this.caracteristicas = caracteristicas;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public List<byte[]> getImagenesData() { return imagenesData; }
    public void setImagenesData(List<byte[]> imagenesData) { this.imagenesData = imagenesData; }




    public Producto() {
        // Constructor vacío requerido por JPA
    }

    public Producto(String nombre, String descripcion, double precio, String categoria, byte[] imagenData) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;

    }



}
