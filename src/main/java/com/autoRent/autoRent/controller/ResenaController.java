package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.DTO.ResenaRequest;
import com.autoRent.autoRent.DTO.ResenaResponse;
import com.autoRent.autoRent.DTO.ResumenValoracionesResponse;
import com.autoRent.autoRent.model.Resena;
import com.autoRent.autoRent.service.ResenaService;
import com.autoRent.autoRent.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @Autowired
    private UsuarioService usuarioService;

    // Crear nueva reseña
    @PostMapping
    public ResponseEntity<?> crearResena(@Valid @RequestBody ResenaRequest request,
                                         Authentication authentication) {
        try {
            // Verifica si el usuario está autenticado
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Debes iniciar sesión para crear reseñas");
            }

            // Obtiene el username del usuario autenticado (probablemente el email)
            String username = authentication.getName();

            // Obtiene el ID del usuario a partir del username
            Long userId = getUserIdFromUsername(username);

            // Crea la reseña usando el servicio correspondiente
            ResenaResponse resena = resenaService.crearResena(userId, request);

            // Devuelve la respuesta con el código 201 (Creada)
            return ResponseEntity.status(HttpStatus.CREATED).body(resena);

        } catch (Exception e) {
            // En caso de error, devuelve el código 400 (Bad Request) con el mensaje de error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear la reseña: " + e.getMessage());
        }
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ResenaResponse>> obtenerResenasProducto(@PathVariable Long productoId) {
        try {

            List<ResenaResponse> resenas = resenaService.obtenerResenasProducto(productoId);
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // Método privado para mapear Resena a ResenaResponse
    private ResenaResponse mapToResenaResponse(Resena resena) {
        return new ResenaResponse(
                resena.getId(),
                resena.getUsuario().getNombre(),
                resena.getUsuario().getApellido(),
                resena.getPuntuacion(),
                resena.getComentario(),
                resena.getFechaCreacion() // LocalDateTime, asegurate que no sea null
        );
    }


    // Obtener resumen de valoraciones de un producto
    @GetMapping("/producto/{productoId}/resumen")
    public ResponseEntity<ResumenValoracionesResponse> obtenerResumenValoraciones(@PathVariable Long productoId) {
        try {
            ResumenValoracionesResponse resumen = resenaService.obtenerResumenValoraciones(productoId);
            return ResponseEntity.ok(resumen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Verificar si un usuario puede valorar un producto
    @GetMapping("/producto/{productoId}/puede-valorar")
    public ResponseEntity<Boolean> puedeValorarProducto(@PathVariable Long productoId,
                                                        Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.ok(false); // Si no está autenticado, no puede valorar
            }

            String username = authentication.getName();
            boolean puedeValorar = resenaService.puedeValorarProducto(getUserIdFromUsername(username), productoId);
            return ResponseEntity.ok(puedeValorar);
        } catch (Exception e) {
            return ResponseEntity.ok(false); // En caso de error, no puede valorar
        }
    }

    // Método auxiliar para obtener el ID del usuario a partir del username
    private Long getUserIdFromUsername(String username) {
        // Llamamos al servicio UsuarioService para obtener el ID del usuario por su email
        return usuarioService.obtenerUsuarioIdPorUsername(username);
    }
}