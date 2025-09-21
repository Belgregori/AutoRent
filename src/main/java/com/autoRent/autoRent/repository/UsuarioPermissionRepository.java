package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.UsuarioPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UsuarioPermissionRepository extends JpaRepository<UsuarioPermission, Long> {

    @Query("SELECT CASE WHEN COUNT(up) > 0 THEN true ELSE false END " +
            "FROM UsuarioPermission up JOIN up.permission p " +
            "WHERE up.usuarioId = :usuarioId AND p.name = :permissionName")
    boolean existsByUsuarioIdAndPermissionName(@Param("usuarioId") Long usuarioId,
                                               @Param("permissionName") String permissionName);

    @Query("SELECT p.name FROM UsuarioPermission up JOIN up.permission p WHERE up.usuarioId = :usuarioId")
    List<String> findPermissionNamesByUsuarioId(@Param("usuarioId") Long usuarioId);

    void deleteByUsuarioIdAndPermissionId(Long usuarioId, Long permissionId);
}

