package com.autoRent.autoRent.service;

import com.autoRent.autoRent.DTO.ResenaRequest;
import com.autoRent.autoRent.DTO.ResenaResponse;
import com.autoRent.autoRent.DTO.ResumenValoracionesResponse;
import com.autoRent.autoRent.model.Resena;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.ResenaRepository;
import com.autoRent.autoRent.repository.ReservaRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear nueva reseña
    public ResenaResponse crearResena(Long usuarioId, ResenaRequest request) {
        // Verificar que la reserva existe y pertenece al usuario
        Reserva reserva = reservaRepository.findById(request.getReservaId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (!reserva.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes permisos para valorar esta reserva");
        }

        // Verificar que la reserva esté completada o confirmada
        if (reserva.getEstado() != Reserva.EstadoReserva.COMPLETADA &&
                reserva.getEstado() != Reserva.EstadoReserva.CONFIRMADA) {
            throw new RuntimeException("Solo puedes valorar reservas completadas o confirmadas");
        }

        // Verificar que no haya una reseña previa para esta reserva
        if (resenaRepository.existsByReservaId(request.getReservaId())) {
            throw new RuntimeException("Ya has valorado esta reserva");
        }

        // Crear la reseña
        Resena resena = new Resena();
        resena.setProducto(reserva.getProducto());
        resena.setUsuario(reserva.getUsuario());
        resena.setReserva(reserva);
        resena.setPuntuacion(request.getPuntuacion());
        resena.setComentario(request.getComentario());

        resena.setFechaCreacion(java.time.LocalDateTime.now());


        Resena resenaGuardada = resenaRepository.save(resena);

        return convertirAResponse(resenaGuardada);
    }

    public List<ResenaResponse> obtenerResenasProducto(Long productoId) {
        try {
            List<Resena> resenas = resenaRepository.findByProductoIdWithUsuario(productoId);
            System.out.println("DEBUG Resenas encontradas: " + resenas.size());

            return resenas.stream()
                    .map(this::convertirAResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace(); // para ver el stacktrace en la consola del server
            throw new RuntimeException("Error al obtener reseñas del producto " + productoId, e);
        }
    }


    // Obtener resumen de valoraciones de un producto
    public ResumenValoracionesResponse obtenerResumenValoraciones(Long productoId) {
        Double puntuacionMedia = resenaRepository.getPuntuacionMediaByProductoId(productoId);
        Long totalResenas = resenaRepository.countByProductoId(productoId);

        Long puntuacion1 = resenaRepository.countByProductoIdAndPuntuacion(productoId, 1);
        Long puntuacion2 = resenaRepository.countByProductoIdAndPuntuacion(productoId, 2);
        Long puntuacion3 = resenaRepository.countByProductoIdAndPuntuacion(productoId, 3);
        Long puntuacion4 = resenaRepository.countByProductoIdAndPuntuacion(productoId, 4);
        Long puntuacion5 = resenaRepository.countByProductoIdAndPuntuacion(productoId, 5);

        return new ResumenValoracionesResponse(
                puntuacionMedia != null ? Math.round(puntuacionMedia * 10.0) / 10.0 : 0.0,
                totalResenas,
                puntuacion1,
                puntuacion2,
                puntuacion3,
                puntuacion4,
                puntuacion5
        );
    }

    // Verificar si un usuario puede valorar un producto
    public boolean puedeValorarProducto(Long usuarioId, Long productoId) {
        // Verificar si tiene reservas del producto
        List<Reserva> reservas = reservaRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);

        if (reservas.isEmpty()) {
            return false;
        }

        // Verificar si ya valoró el producto
        return !resenaRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    // Convertir entidad a DTO de respuesta
    private ResenaResponse convertirAResponse(Resena resena) {
        System.out.println("DEBUG convertirAResponse - resena.id=" + resena.getId()
                + " usuario=" + (resena.getUsuario()!=null ? resena.getUsuario().getId() : "null")
                + " nombreUsuario=" + (resena.getUsuario()!=null ? resena.getUsuario().getNombre() : "null")
                + " puntuacion=" + resena.getPuntuacion()
                + " comentario=" + resena.getComentario()
        );

        return new ResenaResponse(
                resena.getId(),
                resena.getUsuario() != null ? resena.getUsuario().getNombre() : null,
                resena.getUsuario() != null ? resena.getUsuario().getApellido() : null,
                resena.getPuntuacion(),
                resena.getComentario(),
                resena.getFechaCreacion()
        );
    }

}