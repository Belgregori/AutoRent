package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.model.Favorito;
import com.autoRent.autoRent.service.FavoritoService;
import com.autoRent.autoRent.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;


    @GetMapping
    public ResponseEntity<?> obtenerFavoritos() {
        try {
            Long usuarioId = obtenerUsuarioIdDelContexto();
            if (usuarioId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            List<Favorito> favoritos = favoritoService.obtenerFavoritosPorUsuario(usuarioId);
            return ResponseEntity.ok(favoritos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }


    @PostMapping
    public ResponseEntity<?> agregarFavorito(@RequestBody Map<String, Long> request) {
        try {
            Long usuarioId = obtenerUsuarioIdDelContexto();
            Long productoId = request.get("productoId");

            if (productoId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID de producto requerido"));
            }

            Favorito favorito = favoritoService.agregarFavorito(usuarioId, productoId);
            return ResponseEntity.status(201).body(favorito);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }


    @DeleteMapping("/{productoId}")
    public ResponseEntity<?> eliminarFavorito(@PathVariable Long productoId) {
        try {
            Long usuarioId = obtenerUsuarioIdDelContexto();
            boolean eliminado = favoritoService.eliminarFavorito(usuarioId, productoId);

            if (eliminado) {
                return ResponseEntity.ok(Map.of("message", "Favorito eliminado correctamente"));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }


    @GetMapping("/verificar/{productoId}")
    public ResponseEntity<Map<String, Boolean>> verificarFavorito(@PathVariable Long productoId) {
        try {
            Long usuarioId = obtenerUsuarioIdDelContexto();
            boolean esFavorito = favoritoService.esFavorito(usuarioId, productoId);
            return ResponseEntity.ok(Map.of("esFavorito", esFavorito));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }




   private Long obtenerUsuarioIdDelContexto() {
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       if (authentication != null && authentication.isAuthenticated()
               && !"anonymousUser".equals(authentication.getPrincipal())) {
           String username = authentication.getName();
           System.out.println("Usuario autenticado: " + username); // Log para debug
           return obtenerUsuarioIdPorUsername(username);
       }
       // Log cuando no está autenticado
       System.out.println("Usuario no autenticado o anónimo");
       return null; // Si no está autenticado → devolvemos null
   }




    @Autowired
    private UsuarioService usuarioService;

    private Long obtenerUsuarioIdPorUsername(String username) {
        return usuarioService.obtenerUsuarioIdPorUsername(username);
    }
}