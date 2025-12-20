package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.*;
import com.autoRent.autoRent.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final UsuarioPermissionRepository usuarioPermissionRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditLogRepository auditLogRepository;

    public PermissionService(PermissionRepository permissionRepository,
                             UsuarioPermissionRepository usuarioPermissionRepository,
                             UsuarioRepository usuarioRepository,
                             AuditLogRepository auditLogRepository) {
        this.permissionRepository = permissionRepository;
        this.usuarioPermissionRepository = usuarioPermissionRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditLogRepository = auditLogRepository;
    }

    // Chequeo rápido si un usuario tiene permission por nombre
    public boolean hasPermission(Long usuarioId, String permissionName) {
        return usuarioPermissionRepository.existsByUsuarioIdAndPermissionName(usuarioId, permissionName);
    }

    // Lista nombres de permisos del usuario
    public List<String> getPermissionNamesForUsuario(Long usuarioId) {
        return usuarioPermissionRepository.findPermissionNamesByUsuarioId(usuarioId);
    }

    // Asigna rol (ADMIN o USER) a un usuario
    @Transactional
    public void assignRole(Long targetUsuarioId, String newRole, Long actorUsuarioId) {
        Usuario user = usuarioRepository.findById(targetUsuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + targetUsuarioId));

        Set<String> oldRoles = user.getRoles() != null ? new HashSet<>(user.getRoles()) : new HashSet<>();
        String oldValue = String.join(",", oldRoles);

        Set<String> roles = user.getRoles();
        if (roles == null) roles = new HashSet<>();
        roles.add(newRole);
        user.setRoles(roles);
        usuarioRepository.save(user);

        String newValue = String.join(",", roles);
        AuditLog log = new AuditLog(actorUsuarioId, targetUsuarioId, "ASSIGN_ROLE", oldValue, newValue);
        auditLogRepository.save(log);
    }


    // Setea permisos exactamente como la lista enviada (reemplaza)
    @Transactional
    public void setPermissions(Long targetUsuarioId, List<String> requestedPermissionNames, Long actorUsuarioId) {
        List<String> existing = getPermissionNamesForUsuario(targetUsuarioId);
        Set<String> existingSet = new HashSet<>(existing);
        Set<String> requestedSet = new HashSet<>(requestedPermissionNames != null ? requestedPermissionNames : Collections.emptyList());

        // Permisos a agregar
        Set<String> toAdd = new HashSet<>(requestedSet);
        toAdd.removeAll(existingSet);

        // Permisos a quitar
        Set<String> toRemove = new HashSet<>(existingSet);
        toRemove.removeAll(requestedSet);

        // Agregar: buscar Permission por name y crear UsuarioPermission
        for (String permName : toAdd) {
            try {
                Permission perm = permissionRepository.findByName(permName)
                        .orElseThrow(() -> new RuntimeException("Permiso desconocido: " + permName));
                UsuarioPermission up = new UsuarioPermission(targetUsuarioId, perm.getId(), actorUsuarioId);
                usuarioPermissionRepository.save(up);
                System.out.println("✅ Permiso agregado: " + permName + " para usuario: " + targetUsuarioId);
            } catch (Exception e) {
                System.err.println("❌ Error agregando permiso " + permName + ": " + e.getMessage());
                // Continuar con los demás permisos
            }
        }

        // Quitar: obtener ids de permisos a eliminar y borrarlos
        for (String permName : toRemove) {
            Permission perm = permissionRepository.findByName(permName)
                    .orElse(null);
            if (perm != null) {
                usuarioPermissionRepository.deleteByUsuarioIdAndPermissionId(targetUsuarioId, perm.getId());
            }
        }

        // Audit log: guardar old y new
        String oldValue = existing.stream().sorted().collect(Collectors.joining(","));
        String newValue = requestedSet.stream().sorted().collect(Collectors.joining(","));
        AuditLog log = new AuditLog(actorUsuarioId, targetUsuarioId, "SET_PERMISSIONS", oldValue, newValue);
        auditLogRepository.save(log);
    }

    // Obtener todos los permisos del sistema
    public List<String> getAllPermissionNames() {
        return permissionRepository.findAll().stream().map(Permission::getName).collect(Collectors.toList());
    }

    public boolean existsByName(String p) {
        return permissionRepository.findByName(p).isPresent();
    }
}
