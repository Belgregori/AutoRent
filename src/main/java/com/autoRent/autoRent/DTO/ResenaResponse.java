package com.autoRent.autoRent.DTO;

import com.autoRent.autoRent.model.Resena;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class ResenaResponse {

    private Long id;
    private String nombreUsuario;
    private String apellidoUsuario;
    private Integer puntuacion;
    private String comentario;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;
  // Constructor con parámetros
    public ResenaResponse(Long id, String nombreUsuario, String apellidoUsuario,
                          Integer puntuacion, String comentario, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.apellidoUsuario = apellidoUsuario;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getApellidoUsuario() { return apellidoUsuario; }
    public void setApellidoUsuario(String apellidoUsuario) { this.apellidoUsuario = apellidoUsuario; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }

    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public ResenaResponse mapToResenaResponse(Resena resena) {
        return new ResenaResponse(
                resena.getId(),
                resena.getUsuario().getNombre(),
                resena.getUsuario().getApellido(),
                resena.getPuntuacion(),
                resena.getComentario(),
                resena.getFechaCreacion() // LocalDateTime NO nulo
        );
    }




}

