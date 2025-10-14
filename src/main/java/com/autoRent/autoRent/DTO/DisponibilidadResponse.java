package com.autoRent.autoRent.DTO;

import java.time.LocalDate;
import java.util.List;

public class DisponibilidadResponse {
    private Long productoId;
    private int mesesConsultados;
    private List<LocalDate> fechasDisponibles;
    private List<LocalDate> fechasOcupadas;

    public Long getProductoId() {
        return productoId;
    }

    public int getMesesConsultados() {
        return mesesConsultados;
    }

    public List<LocalDate> getFechasDisponibles() {
        return fechasDisponibles;
    }

    public List<LocalDate> getFechasOcupadas() {
        return fechasOcupadas;
    }

    public void setMesesConsultados(int meses) {
        this.mesesConsultados = meses;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public void setFechasOcupadas(List<LocalDate> fechasOcupadas) {
        this.fechasOcupadas = fechasOcupadas;
    }

    public void setFechasDisponibles(List<LocalDate> fechasDisponibles) {
        this.fechasDisponibles = fechasDisponibles;
    }
}