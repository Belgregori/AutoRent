package com.autoRent.autoRent.Security;

import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.UsuarioRepository;
import com.autoRent.autoRent.service.PermissionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Pattern;

public class PermissionFilter extends OncePerRequestFilter {

    private final PermissionService permissionService;
    private final UsuarioRepository usuarioRepository;

    // patrón para detectar segmentos numéricos o UUID (simplificado)
    private static final Pattern ID_SEGMENT = Pattern.compile("^[0-9a-fA-F\\-]{1,}$");

    public PermissionFilter(PermissionService permissionService, UsuarioRepository usuarioRepository) {
        this.permissionService = permissionService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String principal = auth.getPrincipal().toString();
        Usuario usuario = usuarioRepository.findByEmail(principal).orElse(null);
        if (usuario == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // ADMIN: Acceso total sin validación de permisos
        if (usuario.getRoles() != null && usuario.getRoles().contains("ADMIN")) {
            filterChain.doFilter(request, response);
            return;
        }

        // USER: Validación de permisos granulares según sus permisos asignados
        if (usuario.getRoles() == null || !usuario.getRoles().contains("USER")) {
            filterChain.doFilter(request, response);
            return;
        }


        // Mapear request a permiso
        String permissionName = mapRequestToPermission(request.getMethod(), normalizePath(request.getRequestURI()));
        if (permissionName == null) {
            // no hay mapping: permitir acceso (para rutas como /admin que no necesitan permisos granulares)
            filterChain.doFilter(request, response);
            return;
        }

        boolean allowed = permissionService.hasPermission(usuario.getId(), permissionName);
        if (allowed) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Acceso denegado - necesita permiso: " + permissionName + "\"}");
        }
    }

    // Normaliza path reemplazando segmentos que parecen ids por {id}
    private String normalizePath(String uri) {
        String[] parts = uri.split("/");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p == null || p.isEmpty()) continue;
            if (ID_SEGMENT.matcher(p).matches()) {
                sb.append("/{id}");
            } else {
                sb.append("/").append(p);
            }
        }
        return sb.toString();
    }

    // Mapea METHOD + normalizedPath a permiso
    private String mapRequestToPermission(String method, String path) {
        // Productos
        if (path.matches("/api/productos(/\\{id\\})?")) {
            if (method.equals("POST")) return "PRODUCTS_CREATE";
            if (method.equals("PUT")) return "PRODUCTS_UPDATE";
            if (method.equals("DELETE")) return "PRODUCTS_DELETE";
        }
        // Categorías
        if (path.matches("/api/categorias(/\\{id\\})?")) {
            if (method.equals("POST")) return "CATEGORIES_CREATE";
            if (method.equals("PUT")) return "CATEGORIES_UPDATE";
            if (method.equals("DELETE")) return "CATEGORIES_DELETE";
        }
        // Características (features)
        if (path.matches("/api/caracteristicas(/\\{id\\})?") || path.matches("/api/feature.*")) {
            if (method.equals("POST")) return "FEATURES_CREATE";
            if (method.equals("PUT")) return "FEATURES_UPDATE";
            if (method.equals("DELETE")) return "FEATURES_DELETE";
        }
        return null;
    }
}
