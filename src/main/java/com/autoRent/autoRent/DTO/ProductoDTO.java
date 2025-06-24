package com.autoRent.autoRent.DTO;

import com.autoRent.autoRent.model.Producto;
import java.util.Base64;

public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private double precio;
    private String categoria;
    private String imagenData;

    public ProductoDTO(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.categoria = producto.getCategoria();
        if (producto.getImagenesData() != null && !producto.getImagenesData().isEmpty()) {
            byte[] primeraImagen = producto.getImagenesData().get(0);
            // usa primeraImagen
        }
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
    public String getImagenData() {
        return imagenData;
    }
    public void setImagenData(String imagenData) {
        this.imagenData = imagenData;
    }

}
