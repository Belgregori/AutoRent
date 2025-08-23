package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {


    List<Favorito> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);


    Optional<Favorito> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);


    void deleteByUsuarioIdAndProductoId(Long usuarioId, Long productoId);


    long countByUsuarioId(Long usuarioId);

    @Query("SELECT f FROM Favorito f " +
            "JOIN FETCH f.producto p " +
            "WHERE f.usuario.id = :usuarioId " +
            "ORDER BY f.fechaCreacion DESC")
    List<Favorito> findFavoritosConProducto(@Param("usuarioId") Long usuarioId);
}