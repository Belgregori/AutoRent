package com.autoRent.autoRent.DTO;

import java.time.LocalDate;
import java.util.List;

public class DisponibilidadResponse {
    private Long productoId;
    private int mesesConsultados;
    private List<LocalDate> fechasDisponibles;
    private List<LocalDate> fechasOcupadas;

    public DisponibilidadResponse() {}

    public DisponibilidadResponse(Long productoId, int mesesConsultados, List<LocalDate> fechasDisponibles, List<LocalDate> fechasOcupadas) {
        this.productoId = productoId;
        this.mesesConsultados = mesesConsultados;
        this.fechasDisponibles = fechasDisponibles;
        this.fechasOcupadas = fechasOcupadas;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public int getMesesConsultados() {
        return mesesConsultados;
    }

    public void setMesesConsultados(int mesesConsultados) {
        this.mesesConsultados = mesesConsultados;
    }

    public List<LocalDate> getFechasDisponibles() {
        return fechasDisponibles;
    }

    public void setFechasDisponibles(List<LocalDate> fechasDisponibles) {
        this.fechasDisponibles = fechasDisponibles;
    }

    public List<LocalDate> getFechasOcupadas() {
        return fechasOcupadas;
    }

    public void setFechasOcupadas(List<LocalDate> fechasOcupadas) {
        this.fechasOcupadas = fechasOcupadas;
    }
}