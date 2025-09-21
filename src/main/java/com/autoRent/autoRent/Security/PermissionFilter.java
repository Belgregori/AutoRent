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

        String principal = auth.getPrincipal().toString(); // en tu JwtRequestFilter es el email
        // cargar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(principal).orElse(null);
        if (usuario == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Determinar roles: soportamos tanto "ADMIN" como "ADMIN1"
        boolean isAdmin1 = usuario.getRoles() != null &&
                (usuario.getRoles().contains("ADMIN") || usuario.getRoles().contains("ADMIN1"));

        boolean isAdmin2 = usuario.getRoles() != null && usuario.getRoles().contains("ADMIN2");

// Si es ADMIN1 (superadmin) pasa sin más
        if (isAdmin1) {
            filterChain.doFilter(request, response);
            return;
        }

// Si NO es ADMIN2: NO aplicamos el control de permisos dinámicos aquí.
// Dejamos que WebSecurity (WebConfig) y los endpoints manejen lo que corresponde.
// Esto restaura el comportamiento anterior: usuarios comunes podrán hacer GETs públicos
// y las rutas que WebConfig permite para autenticados (ej. agregar favoritos).
        if (!isAdmin2) {
            filterChain.doFilter(request, response);
            return;
        }


        // Mapear request a permiso
        String permissionName = mapRequestToPermission(request.getMethod(), normalizePath(request.getRequestURI()));
        if (permissionName == null) {
            // no hay mapping: denegar por defecto (fail-safe) para métodos que modifican datos
            if (HttpMethod.GET.matches(request.getMethod()) || HttpMethod.OPTIONS.matches(request.getMethod())) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Acceso denegado - permiso no encontrado para esta ruta\"}");
            }
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
