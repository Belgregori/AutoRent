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

        if (!(actor.getRoles().contains("ADMIN") || actor.getRoles().contains("ADMIN1"))) {
            return ResponseEntity.status(403).body(Map.of("message","Solo ADMIN1 puede ..."));
        }


        List<String> perms = body.getOrDefault("permissions", List.of());

        // Validar permisos
        perms.removeIf(p -> !permissionService.existsByName(p));

        // Guardar permisos y registrar en audit log
        permissionService.setPermissions(id, perms, actor.getId());


        return ResponseEntity.ok(Map.of("message", "Permisos actualizados correctamente"));
    }


    @GetMapping("/users")
    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }

    // Asignar rol (ej: ADMIN2)
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> assignRole(@PathVariable Long id,
                                        @RequestBody Map<String, String> body,
                                        Authentication auth) {
        String actorEmail = auth.getPrincipal().toString();
        Usuario actor = usuarioRepository.findByEmail(actorEmail).orElseThrow();

        // SOLO ADMIN1 puede asignar roles
        if (!(actor.getRoles().contains("ADMIN") || actor.getRoles().contains("ADMIN1"))) {
            return ResponseEntity.status(403).body(Map.of("message","Solo ADMIN1 puede ..."));
        }


        String role = body.get("role");
        if (!List.of("ADMIN2", "USER").contains(role)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rol inválido"));
        }

        permissionService.assignRole(id, role, actor.getId());


        return ResponseEntity.ok(Map.of("message", "Rol asignado: " + role));
    }
}

