package com.autoRent.autoRent.service;


import com.autoRent.autoRent.model.Favorito;
import com.autoRent.autoRent.model.Producto;
import com.autoRent.autoRent.model.Usuario;
import com.autoRent.autoRent.repository.FavoritoRepository;
import com.autoRent.autoRent.repository.ProductoRepository;
import com.autoRent.autoRent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    public List<Favorito> obtenerFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    @Transactional
    public Favorito agregarFavorito(Long usuarioId, Long productoId) {
        // Controlando errores dentro del servicio
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Optional<Favorito> favoritoExistente = favoritoRepository
                    .findByUsuarioIdAndProductoId(usuarioId, productoId);

            if (favoritoExistente.isPresent()) {
                throw new RuntimeException("El producto ya está en favoritos");
            }

            Favorito favorito = new Favorito(usuario, producto);
            return favoritoRepository.save(favorito);

        } catch (RuntimeException e) {
            // Log para depurar el error exacto
            System.out.println("Error: " + e.getMessage());
            throw e;
        }
    }

    // Eliminar producto de favoritos
    @Transactional
    public boolean eliminarFavorito(Long usuarioId, Long productoId) {
        Optional<Favorito> favorito = favoritoRepository
                .findByUsuarioIdAndProductoId(usuarioId, productoId);

        if (favorito.isPresent()) {
            favoritoRepository.delete(favorito.get());
            return true;
        }
        return false;
    }

    // Verificar si un producto es favorito
    public boolean esFavorito(Long usuarioId, Long productoId) {
        return favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId).isPresent();
    }

    // Contar favoritos del usuario
    public long contarFavoritosPorUsuario(Long usuarioId) {
        return favoritoRepository.countByUsuarioId(usuarioId);
    }

    public Long obtenerUsuarioIdPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getId();
    }
}




