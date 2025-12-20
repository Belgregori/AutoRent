package com.autoRent.autoRent.service;

import com.autoRent.autoRent.DTO.ReservaRequest;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Reserva;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.ReservaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ProductoService productoService;

    public Reserva crearReserva(ReservaRequest request, Long usuarioId) {
        // Validar que el producto existe
        Optional<Producto> productoOpt = productoService.obtenerProductoPorId(request.getProductoId());
        if (productoOpt.isEmpty()) {
            throw new IllegalArgumentException("Producto no encontrado");
        }
        Producto producto = productoOpt.get(); // Obtener el Producto

        // Validar fechas (fechaInicio < fechaFin, fechas futuras)
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
        if (request.getFechaInicio().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser futura.");
        }

        // Verificar disponibilidad en el rango de fechas
        if (hayConflictosEnFechas(producto.getId(), request.getFechaInicio(), request.getFechaFin())) {
            throw new IllegalArgumentException("El producto no está disponible en las fechas seleccionadas.");
        }

        // Calcular precio total
        long dias = ChronoUnit.DAYS.between(request.getFechaInicio(), request.getFechaFin()) + 1;
        if (dias <= 0) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior o igual a la de inicio");
        }

        BigDecimal precioTotal = BigDecimal.valueOf(dias * producto.getPrecio());


        // Crear y guardar la reserva
        Reserva nuevaReserva = new Reserva();
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        nuevaReserva.setUsuario(usuario);

        nuevaReserva.setProducto(producto);
        nuevaReserva.setFechaInicio(request.getFechaInicio());
        nuevaReserva.setFechaFin(request.getFechaFin());
        nuevaReserva.setPrecioTotal(precioTotal);

        nuevaReserva.setDiasReserva((int) dias);

        return reservaRepository.save(nuevaReserva);
    }

    public List<LocalDate> obtenerFechasOcupadas(Long productoId, int meses) {
        // Buscar todas las reservas asociadas al producto
        List<Reserva> reservas = reservaRepository.findByProductoId(productoId); // Obtener las reservas
        List<LocalDate> fechasOcupadas = new ArrayList<>();

        // Recorrer las reservas para obtener los rangos ocupados
        for (Reserva reserva : reservas) {
            LocalDate fecha = reserva.getFechaInicio(); // Uso del getter correspondiente
            while (!fecha.isAfter(reserva.getFechaFin())) { // Rango de fechas ocupado
                fechasOcupadas.add(fecha);
                fecha = fecha.plusDays(1);
            }
        }

        return fechasOcupadas;
    }

    public List<LocalDate> obtenerFechasDisponibles(Long productoId, int mesesAdelante) {
        // Corregido: Usar el mismo parámetro mesesAdelante para obtener fechas ocupadas
        List<LocalDate> fechasOcupadas = obtenerFechasOcupadas(productoId, mesesAdelante);
        List<LocalDate> fechasDisponibles = new ArrayList<>();

        LocalDate hoy = LocalDate.now();
        LocalDate finRango = hoy.plusMonths(mesesAdelante); // Usar mesesAdelante

        // Generar las fechas disponibles excluyendo las fechas ocupadas
        for (LocalDate fecha = hoy; !fecha.isAfter(finRango); fecha = fecha.plusDays(1)) {
            if (!fechasOcupadas.contains(fecha)) {
                fechasDisponibles.add(fecha);
            }
        }

        return fechasDisponibles;
    }

    private boolean hayConflictosEnFechas(Long productoId, LocalDate fechaInicio, LocalDate fechaFin) {
        // Usa el método de repositorio para verificar conflictos en las fechas
        return reservaRepository.findReservasConflictivas(productoId, fechaInicio, fechaFin).size() > 0;
    }

    public List<Reserva> obtenerTodasLasReservas(int page, int size, String estado, Long productoId) {
        Pageable pageable = PageRequest.of(page, size);

        // Convertir String estado a Enum si viene, si no -> null (sin filtro por estado)
        Reserva.EstadoReserva estadoEnum = null;
        if (estado != null && !estado.isBlank()) {
            try {
                estadoEnum = Reserva.EstadoReserva.valueOf(estado.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                // si el estado no coincide con el enum, lo ignoramos (podés lanzar excepción si querés)
                estadoEnum = null;
            }
        }

        // Llamada correcta al repositorio: (EstadoReserva, productoId, Pageable)
        return reservaRepository.findAllWithFilters(estadoEnum, productoId, pageable);
    }

    public void eliminarReserva(Long reservaId) {
        reservaRepository.deleteById(reservaId);
    }


    public long contarReservasPorEstado(Reserva.EstadoReserva estadoReserva) {
        return reservaRepository.countByEstado(estadoReserva);
    }

    public long contarTotalReservas() {
        return reservaRepository.count();
    }

    public Reserva confirmarReserva(Long reservaId) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(reservaId);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        Reserva reserva = reservaOpt.get();
        reserva.setEstado(Reserva.EstadoReserva.CONFIRMADA);
        return reservaRepository.save(reserva);

    }

    public Reserva cancelarReserva(Long reservaId) {
        Optional<Reserva> reservaOpt = reservaRepository.findById(reservaId);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        Reserva reserva = reservaOpt.get();
        reserva.setEstado(Reserva.EstadoReserva.CANCELADA);
        return reservaRepository.save(reserva);
    }

    public List<Reserva> obtenerReservasPorUsuario(Long id) {
        return reservaRepository.findByUsuarioIdOrderByFechaCreacionDesc(id);
    }

    public Reserva findById(Long reservaId) {
        return reservaRepository.findById(reservaId).orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
    }

    public boolean verificarDisponibilidad(Long productoId, LocalDate fechaInicio, LocalDate fechaFin) {
        return !hayConflictosEnFechas(productoId, fechaInicio, fechaFin);

    }
}