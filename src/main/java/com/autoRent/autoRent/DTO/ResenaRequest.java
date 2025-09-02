package com.autoRent.autoRent.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ResenaRequest {

    @NotNull(message = "El ID de la reserva es obligatorio")
    private Long reservaId;

    @NotNull(message = "La puntuación es obligatoria")
    @Min(value = 1, message = "La puntuación mínima es 1")
    @Max(value = 5, message = "La puntuación máxima es 5")
    private Integer puntuacion;

    @NotBlank(message = "El comentario es obligatorio")
    private String comentario;

    // Constructor por defecto
    public ResenaRequest() {}

    // Constructor con parámetros
    public ResenaRequest(Long reservaId, Integer puntuacion, String comentario) {
        this.reservaId = reservaId;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
    }

    // Getters y Setters
    public Long getReservaId() { return reservaId; }
    public void setReservaId(Long reservaId) { this.reservaId = reservaId; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}