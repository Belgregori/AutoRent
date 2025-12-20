package com.autoRent.autoRent.DTO;

public class ResumenValoracionesResponse {

    private Double puntuacionMedia;
    private Long totalResenas;
    private Long puntuacion1;
    private Long puntuacion2;
    private Long puntuacion3;
    private Long puntuacion4;
    private Long puntuacion5;

    // Constructor por defecto
    public ResumenValoracionesResponse() {}

    // Constructor con parámetros
    public ResumenValoracionesResponse(Double puntuacionMedia, Long totalResenas,
                                       Long puntuacion1, Long puntuacion2, Long puntuacion3,
                                       Long puntuacion4, Long puntuacion5) {
        this.puntuacionMedia = puntuacionMedia;
        this.totalResenas = totalResenas;
        this.puntuacion1 = puntuacion1;
        this.puntuacion2 = puntuacion2;
        this.puntuacion3 = puntuacion3;
        this.puntuacion4 = puntuacion4;
        this.puntuacion5 = puntuacion5;
    }

    // Getters y Setters
    public Double getPuntuacionMedia() { return puntuacionMedia; }
    public void setPuntuacionMedia(Double puntuacionMedia) { this.puntuacionMedia = puntuacionMedia; }

    public Long getTotalResenas() { return totalResenas; }
    public void setTotalResenas(Long totalResenas) { this.totalResenas = totalResenas; }

    public Long getPuntuacion1() { return puntuacion1; }
    public void setPuntuacion1(Long puntuacion1) { this.puntuacion1 = puntuacion1; }

    public Long getPuntuacion2() { return puntuacion2; }
    public void setPuntuacion2(Long puntuacion2) { this.puntuacion2 = puntuacion2; }

    public Long getPuntuacion3() { return puntuacion3; }
    public void setPuntuacion3(Long puntuacion3) { this.puntuacion3 = puntuacion3; }

    public Long getPuntuacion4() { return puntuacion4; }
    public void setPuntuacion4(Long puntuacion4) { this.puntuacion4 = puntuacion4; }

    public Long getPuntuacion5() { return puntuacion5; }
    public void setPuntuacion5(Long puntuacion5) { this.puntuacion5 = puntuacion5; }
}