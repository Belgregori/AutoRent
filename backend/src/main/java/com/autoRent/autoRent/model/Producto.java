package com.autoRent.autoRent.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String nombre;
    private String descripcion;
    private double precio;



    @Lob
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "imagenes_producto", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen", columnDefinition = "LONGBLOB")
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

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
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





    public List<byte[]> getImagenesData() { return imagenesData; }
    public void setImagenesData(List<byte[]> imagenesData) { this.imagenesData = imagenesData; }




    public Producto() {
        // Constructor vacío requerido por JPA
    }

    public Producto(String nombre, String descripcion, double precio, String categoria, byte[] imagenData) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;

    }

    public boolean isDisponible() {
        return true; // Implementa la lógica real de disponibilidad según tus necesidades
    }
}
