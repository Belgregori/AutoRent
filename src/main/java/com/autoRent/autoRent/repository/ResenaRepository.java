package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    // Obtener todas las reseñas de un producto
    List<Resena> findByProductoIdOrderByFechaCreacionDesc(Long productoId);

    // Obtener reseña por reserva (para evitar duplicados)
    Optional<Resena> findByReservaId(Long reservaId);

    // Verificar si un usuario ya valoró un producto específico
    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    // Obtener reseñas de un usuario
    List<Resena> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    // Contar reseñas por producto
    long countByProductoId(Long productoId);

    // Obtener puntuación media por producto
    @Query("SELECT AVG(r.puntuacion) FROM Resena r WHERE r.producto.id = :productoId")
    Double getPuntuacionMediaByProductoId(@Param("productoId") Long productoId);

    // Contar reseñas por puntuación y producto
    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = :puntuacion")
    Long countByProductoIdAndPuntuacion(@Param("productoId") Long productoId, @Param("puntuacion") Integer puntuacion);

    @Query("SELECT r FROM Resena r JOIN FETCH r.usuario u WHERE r.producto.id = :productoId ORDER BY r.fechaCreacion DESC")
    List<Resena> findByProductoIdWithUsuario(@Param("productoId") Long productoId);

    boolean existsByReservaId(Long reservaId);
}