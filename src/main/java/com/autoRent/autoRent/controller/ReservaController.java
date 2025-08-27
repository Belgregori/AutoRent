package com.autoRent.autoRent.controller;

import com.autoRent.autoRent.DTO.ReservaRequest;
import com.autoRent.autoRent.DTO.DisponibilidadResponse;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.service.ReservaService;
import com.autoRent.autoRent.service.UsuarioService;
import com.autoRent.autoRent.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")

public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoService productoService;

    @PostMapping
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ReservaRequest request,
                                          Authentication authentication) {
        try {
            // Chequeo de autenticación (robusto)
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Debes iniciar sesión para realizar reservas");
            }

            String username = authentication.getName();
            System.out.println("crearReserva -> usuario autenticado: " + username);

            // Obtener el usuario logueado
            Usuario usuario = usuarioService.findByEmail(username);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no encontrado");
            }

            // Verificar que el producto existe
            Producto producto = productoService.findById(request.getProductoId());
            if (producto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Producto no encontrado");
            }

            // Verificar que el producto esté disponible
            if (!producto.isDisponible()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El producto no está disponible para reservas");
            }

            // Validar que las fechas estén presentes
            if (request.getFechaInicio() == null || request.getFechaFin() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Fecha de inicio y/o fecha de fin faltante");
            }

            // Validar fechas
            if (request.getFechaInicio().isBefore(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No se pueden reservar fechas pasadas");
            }

            if (request.getFechaInicio().isAfter(request.getFechaFin())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("La fecha de inicio debe ser anterior a la fecha de fin");
            }

            // Verificar disponibilidad en el rango de fechas
            boolean disponible = reservaService.verificarDisponibilidad(
                    request.getProductoId(),
                    request.getFechaInicio(),
                    request.getFechaFin()
            );

            // si NO está disponible -> conflict
            if (!disponible) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El producto no está disponible en el rango de fechas seleccionado");
            }

            // Crear la reserva
            System.out.println("crearReserva -> creando reserva para usuarioId: " + usuario.getId()
                    + " productoId: " + request.getProductoId()
                    + " desde: " + request.getFechaInicio() + " hasta: " + request.getFechaFin());

            Reserva nuevaReserva = reservaService.crearReserva(request, usuario.getId());

            System.out.println("crearReserva -> reserva creada id: " + (nuevaReserva != null ? nuevaReserva.getId() : "null"));

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);

        } catch (Exception e) {
            e.printStackTrace(); // Logueo para debug en desarrollo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }


    @GetMapping("/producto/{productoId}/disponibilidad")
    public ResponseEntity<DisponibilidadResponse> obtenerDisponibilidad(
            @PathVariable Long productoId,
            @RequestParam(defaultValue = "6") int meses) {

        try {
            // Verificar que el producto existe
            Producto producto = productoService.findById(productoId);
            if (producto == null) {
                return ResponseEntity.notFound().build();
            }

            // Obtener fechas disponibles y ocupadas
            List<LocalDate> fechasOcupadas = reservaService.obtenerFechasOcupadas(productoId, meses);
            List<LocalDate> fechasDisponibles = reservaService.obtenerFechasDisponibles(productoId, meses);

            DisponibilidadResponse response = new DisponibilidadResponse();
            response.setFechasDisponibles(fechasDisponibles);
            response.setFechasOcupadas(fechasOcupadas);
            response.setProductoId(productoId);
            response.setMesesConsultados(meses);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<Reserva>> obtenerReservasUsuario(Authentication authentication) {
        try {
            // Chequeo de autenticación
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String username = authentication.getName();
            System.out.println("obtenerReservasUsuario -> usuario autenticado: " + username);

            Usuario usuario = usuarioService.findByEmail(username);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<Reserva> reservas = reservaService.obtenerReservasPorUsuario(usuario.getId());
            return ResponseEntity.ok(reservas);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{reservaId}")
    public ResponseEntity<Reserva> obtenerReserva(@PathVariable Long reservaId,
                                                  Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String username = authentication.getName();
            Usuario usuario = usuarioService.findByEmail(username);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Reserva reserva = reservaService.findById(reservaId);
            if (reserva == null) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que la reserva pertenece al usuario logueado
            if (!reserva.getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(reserva);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/{reservaId}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable Long reservaId,
                                             Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String username = authentication.getName();
            Usuario usuario = usuarioService.findByEmail(username);
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Reserva reserva = reservaService.findById(reservaId);
            if (reserva == null) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que la reserva pertenece al usuario logueado
            if (!reserva.getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Verificar que la reserva se puede cancelar
            if (reserva.getEstado() != Reserva.EstadoReserva.PENDIENTE &&
                    reserva.getEstado() != Reserva.EstadoReserva.CONFIRMADA) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No se puede cancelar una reserva en estado: " + reserva.getEstado());
            }

            // Verificar que no sea muy tarde para cancelar (ej: 24h antes)
            if (reserva.getFechaInicio().isBefore(LocalDate.now().plusDays(1))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No se puede cancelar una reserva que comienza en menos de 24 horas");
            }

            Reserva reservaCancelada = reservaService.cancelarReserva(reservaId);
            return ResponseEntity.ok(reservaCancelada);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cancelar la reserva: " + e.getMessage());
        }
    }


    @PutMapping("/{reservaId}/confirmar")
    @PreAuthorize("hasRole('ADMIN')") // Solo administradores pueden confirmar
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long reservaId) {
        try {
            Reserva reserva = reservaService.confirmarReserva(reservaId);
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/todas")
    @PreAuthorize("hasRole('ADMIN')") // Solo administradores
    public ResponseEntity<List<Reserva>> obtenerTodasLasReservas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Long productoId) {

        try {
            List<Reserva> reservas = reservaService.obtenerTodasLasReservas(page, size, estado, productoId);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/estadisticas")
    @PreAuthorize("hasRole('ADMIN')") // Solo administradores
    public ResponseEntity<?> obtenerEstadisticas() {
        try {
            // Estadísticas generales para el dashboard del admin
            long totalReservas = reservaService.contarTotalReservas();
            long reservasPendientes = reservaService.contarReservasPorEstado(Reserva.EstadoReserva.PENDIENTE);
            long reservasConfirmadas = reservaService.contarReservasPorEstado(Reserva.EstadoReserva.CONFIRMADA);
            long reservasCanceladas = reservaService.contarReservasPorEstado(Reserva.EstadoReserva.CANCELADA);

            // Crear objeto de respuesta con estadísticas
            Map<String, Object> estadisticas = Map.of(
                    "totalReservas", totalReservas,
                    "reservasPendientes", reservasPendientes,
                    "reservasConfirmadas", reservasConfirmadas,
                    "reservasCanceladas", reservasCanceladas,
                    "fechaConsulta", LocalDate.now()
            );

            return ResponseEntity.ok(estadisticas);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{reservaId}")
    @PreAuthorize("hasRole('ADMIN')") // Solo administradores pueden eliminar
    public ResponseEntity<?> eliminarReserva(@PathVariable Long reservaId) {
        try {
            reservaService.eliminarReserva(reservaId);
            return ResponseEntity.ok("Reserva eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la reserva: " + e.getMessage());
        }
    }
}