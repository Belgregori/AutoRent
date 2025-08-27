package com.autoRent.autoRent.DTO;

import java.time.LocalDate;

public class ReservaRequest {
    private Long productoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
}
