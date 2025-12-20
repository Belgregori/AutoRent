package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.service.PermissionService;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.model.AuditLog;
import com.autoRent.autoRent.repository.AuditLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PermissionService permissionService;
    private final UsuarioRepository usuarioRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminController(PermissionService permissionService,
                           UsuarioRepository usuarioRepository,
                           AuditLogRepository auditLogRepository) {
        this.permissionService = permissionService;
        this.usuarioRepository = usuarioRepository;
        this.auditLogRepository = auditLogRepository;
    }

    // Lista todos los permisos del sistema
    @GetMapping("/permissions")
    public ResponseEntity<List<String>> allPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissionNames());
    }

    // Obtiene permisos de un usuario
    @GetMapping("/users/{id}/permissions")
    public ResponseEntity<List<String>> getUserPermissions(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.getPermissionNamesForUsuario(id));
    }

    // Reemplaza permisos de un usuario. Body: { "permissions": ["PRODUCTS_CREATE", ...] }
    @PatchMapping("/users/{id}/permissions")
    public ResponseEntity<?> setPermissions(@PathVariable Long id,
                                            @RequestBody Map<String, List<String>> body,
                                            Authentication auth) {
        String actorEmail = auth.getPrincipal().toString();
        Usuario actor = usuarioRepository.findByEmail(actorEmail).orElseThrow();

        if (!actor.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("message","Solo ADMIN puede asignar permisos"));
        }


        List<String> perms = body.getOrDefault("permissions", List.of());
        System.out.println("🔍 Permisos recibidos: " + perms);

        // Validar permisos
        perms.removeIf(p -> !permissionService.existsByName(p));
        System.out.println("✅ Permisos válidos después de filtrado: " + perms);

        try {
            // Guardar permisos y registrar en audit log
            permissionService.setPermissions(id, perms, actor.getId());
            System.out.println("✅ Permisos guardados exitosamente para usuario: " + id);
        } catch (Exception e) {
            System.err.println("❌ Error guardando permisos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error interno: " + e.getMessage()));
        }

        return ResponseEntity.ok(Map.of("message", "Permisos actualizados correctamente"));
    }


    @GetMapping("/users")
    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }

    // Obtiene todos los usuarios con sus permisos asociados
    @GetMapping("/users-with-permissions")
    public ResponseEntity<List<Map<String, Object>>> getUsersWithPermissions() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> usuariosConPermisos = new ArrayList<>();
        
        for (Usuario usuario : usuarios) {
            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("id", usuario.getId());
            usuarioData.put("nombre", usuario.getNombre());
            usuarioData.put("apellido", usuario.getApellido());
            usuarioData.put("email", usuario.getEmail());
            usuarioData.put("roles", usuario.getRoles());
            usuarioData.put("permissions", permissionService.getPermissionNamesForUsuario(usuario.getId()));
            
            usuariosConPermisos.add(usuarioData);
        }
        
        return ResponseEntity.ok(usuariosConPermisos);
    }

    // Asignar rol (ADMIN o USER)
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> assignRole(@PathVariable Long id,
                                        @RequestBody Map<String, String> body,
                                        Authentication auth) {
        String actorEmail = auth.getPrincipal().toString();
        Usuario actor = usuarioRepository.findByEmail(actorEmail).orElseThrow();

        // SOLO ADMIN puede asignar roles
        if (!actor.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("message","Solo ADMIN puede asignar permisos"));
        }


        String role = body.get("role");
        if (!List.of("ADMIN", "USER").contains(role)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rol inválido"));
        }

        permissionService.assignRole(id, role, actor.getId());


        return ResponseEntity.ok(Map.of("message", "Rol asignado: " + role));
    }
}

