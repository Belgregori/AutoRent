package com.autoRent.autoRent.service;

import com.autoRent.autoRent.model.AuditLog;
import com.autoRent.autoRent.model.Permission;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.model.UsuarioPermission;
import com.autoRent.autoRent.repository.AuditLogRepository;
import com.autoRent.autoRent.repository.PermissionRepository;
import com.autoRent.autoRent.repository.UsuarioPermissionRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PermissionServiceTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private UsuarioPermissionRepository usuarioPermissionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private PermissionService permissionService;

    private Usuario usuario;
    private Permission permission;
    private UsuarioPermission usuarioPermission;

    @BeforeEach
    void setUp() {
        // Crear usuario
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setEmail("juan@test.com");
        usuario.setRoles(new HashSet<>(Arrays.asList("USER")));

        // Crear permiso
        permission = new Permission();
        permission.setId(1L);
        permission.setName("PRODUCTS_CREATE");

        // Crear usuario-permiso
        usuarioPermission = new UsuarioPermission();
        usuarioPermission.setUsuarioId(1L);
        usuarioPermission.setPermissionId(1L);
        usuarioPermission.setGrantedBy(2L);
    }

    @Test
    void hasPermission_ConPermisoExistente_DebeRetornarTrue() {
        // Given
        when(usuarioPermissionRepository.existsByUsuarioIdAndPermissionName(1L, "PRODUCTS_CREATE"))
                .thenReturn(true);

        // When
        boolean resultado = permissionService.hasPermission(1L, "PRODUCTS_CREATE");

        // Then
        assertTrue(resultado);
    }

    @Test
    void hasPermission_ConPermisoInexistente_DebeRetornarFalse() {
        // Given
        when(usuarioPermissionRepository.existsByUsuarioIdAndPermissionName(1L, "PRODUCTS_DELETE"))
                .thenReturn(false);

        // When
        boolean resultado = permissionService.hasPermission(1L, "PRODUCTS_DELETE");

        // Then
        assertFalse(resultado);
    }

    @Test
    void getPermissionNamesForUsuario_ConPermisos_DebeRetornarLista() {
        // Given
        List<String> permisos = Arrays.asList("PRODUCTS_CREATE", "PRODUCTS_READ");
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(permisos);

        // When
        List<String> resultado = permissionService.getPermissionNamesForUsuario(1L);

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.contains("PRODUCTS_CREATE"));
        assertTrue(resultado.contains("PRODUCTS_READ"));
    }

    @Test
    void getPermissionNamesForUsuario_SinPermisos_DebeRetornarListaVacia() {
        // Given
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(Collections.emptyList());

        // When
        List<String> resultado = permissionService.getPermissionNamesForUsuario(1L);

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void assignRole_ConUsuarioExistente_DebeAsignarRol() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // When
        permissionService.assignRole(1L, "ADMIN", 2L);

        // Then
        verify(usuarioRepository).save(any(Usuario.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void assignRole_ConUsuarioInexistente_DebeLanzarExcepcion() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> permissionService.assignRole(1L, "ADMIN", 2L));
        assertEquals("Usuario no encontrado: 1", exception.getMessage());
    }

    @Test
    void setPermissions_ConPermisosNuevos_DebeAgregarPermisos() {
        // Given
        List<String> permisosExistentes = Arrays.asList("PRODUCTS_READ");
        List<String> permisosSolicitados = Arrays.asList("PRODUCTS_READ", "PRODUCTS_CREATE");
        
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(permisosExistentes);
        when(permissionRepository.findByName("PRODUCTS_CREATE")).thenReturn(Optional.of(permission));
        when(usuarioPermissionRepository.save(any(UsuarioPermission.class))).thenReturn(usuarioPermission);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // When
        permissionService.setPermissions(1L, permisosSolicitados, 2L);

        // Then
        verify(usuarioPermissionRepository).save(any(UsuarioPermission.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void setPermissions_ConPermisosParaEliminar_DebeEliminarPermisos() {
        // Given
        List<String> permisosExistentes = Arrays.asList("PRODUCTS_READ", "PRODUCTS_CREATE");
        List<String> permisosSolicitados = Arrays.asList("PRODUCTS_READ");
        
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(permisosExistentes);
        when(permissionRepository.findByName("PRODUCTS_CREATE")).thenReturn(Optional.of(permission));
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // When
        permissionService.setPermissions(1L, permisosSolicitados, 2L);

        // Then
        verify(usuarioPermissionRepository).deleteByUsuarioIdAndPermissionId(1L, 1L);
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void setPermissions_ConPermisoDesconocido_DebeContinuarConOtros() {
        // Given
        List<String> permisosExistentes = Collections.emptyList();
        List<String> permisosSolicitados = Arrays.asList("PERMISO_DESCONOCIDO", "PRODUCTS_READ");
        
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(permisosExistentes);
        when(permissionRepository.findByName("PERMISO_DESCONOCIDO")).thenReturn(Optional.empty());
        when(permissionRepository.findByName("PRODUCTS_READ")).thenReturn(Optional.of(permission));
        when(usuarioPermissionRepository.save(any(UsuarioPermission.class))).thenReturn(usuarioPermission);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // When
        permissionService.setPermissions(1L, permisosSolicitados, 2L);

        // Then
        verify(usuarioPermissionRepository).save(any(UsuarioPermission.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void setPermissions_ConListaNull_DebeTratarComoListaVacia() {
        // Given
        List<String> permisosExistentes = Arrays.asList("PRODUCTS_READ");
        
        when(usuarioPermissionRepository.findPermissionNamesByUsuarioId(1L)).thenReturn(permisosExistentes);
        when(permissionRepository.findByName("PRODUCTS_READ")).thenReturn(Optional.of(permission));
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        // When
        permissionService.setPermissions(1L, null, 2L);

        // Then
        verify(usuarioPermissionRepository).deleteByUsuarioIdAndPermissionId(1L, 1L);
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void getAllPermissionNames_ConPermisos_DebeRetornarLista() {
        // Given
        List<Permission> permisos = Arrays.asList(permission);
        when(permissionRepository.findAll()).thenReturn(permisos);

        // When
        List<String> resultado = permissionService.getAllPermissionNames();

        // Then
        assertEquals(1, resultado.size());
        assertEquals("PRODUCTS_CREATE", resultado.get(0));
    }

    @Test
    void getAllPermissionNames_SinPermisos_DebeRetornarListaVacia() {
        // Given
        when(permissionRepository.findAll()).thenReturn(Collections.emptyList());

        // When
        List<String> resultado = permissionService.getAllPermissionNames();

        // Then
        assertTrue(resultado.isEmpty());
    }

    @Test
    void existsByName_ConPermisoExistente_DebeRetornarTrue() {
        // Given
        when(permissionRepository.findByName("PRODUCTS_CREATE")).thenReturn(Optional.of(permission));

        // When
        boolean resultado = permissionService.existsByName("PRODUCTS_CREATE");

        // Then
        assertTrue(resultado);
    }

    @Test
    void existsByName_ConPermisoInexistente_DebeRetornarFalse() {
        // Given
        when(permissionRepository.findByName("PERMISO_INEXISTENTE")).thenReturn(Optional.empty());

        // When
        boolean resultado = permissionService.existsByName("PERMISO_INEXISTENTE");

        // Then
        assertFalse(resultado);
    }
}
