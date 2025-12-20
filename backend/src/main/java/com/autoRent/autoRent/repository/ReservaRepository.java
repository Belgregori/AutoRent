package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Reserva.EstadoReserva;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // 1) Buscar reservas por producto
    List<Reserva> findByProductoId(Long productoId);

    // 2) Reservas conflictivas: devuelve reservas que se solapan con el rango recibido
    @Query("SELECT r FROM Reserva r WHERE r.producto.id = :productoId AND NOT (r.fechaFin < :fechaInicio OR r.fechaInicio > :fechaFin)")
    List<Reserva> findReservasConflictivas(@Param("productoId") Long productoId,
                                           @Param("fechaInicio") LocalDate fechaInicio,
                                           @Param("fechaFin") LocalDate fechaFin);

    // 3) Paginado y filtros simples (usamos Pageable para page/size)
    @Query("SELECT r FROM Reserva r " +
            "WHERE (:estado IS NULL OR r.estado = :estado) " +
            "AND (:productoId IS NULL OR r.producto.id = :productoId)")
    List<Reserva> findAllWithFilters(@Param("estado") EstadoReserva estado,
                                     @Param("productoId") Long productoId,
                                     Pageable pageable);

    // 4) Reservas por usuario ordenadas por fecha creacion
    List<Reserva> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    List<Reserva> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
    
    // Contar reservas por estado
    long countByEstado(EstadoReserva estado);
}
