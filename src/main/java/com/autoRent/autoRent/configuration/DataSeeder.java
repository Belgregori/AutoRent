package com.autoRent.autoRent.configuration;

import com.autoRent.autoRent.model.*;
import com.autoRent.autoRent.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CategoriaRepository categoriaRepository;
    private final CaracteristicaRepository caracteristicaRepository;
    private final ProductoRepository productoRepository;

    @Value("${seeder.export.enabled:false}")
    private boolean exportEnabled;

    @Value("${seeder.export.categorias:2}")
    private int cantidadCategorias;
    @Value("${seeder.export.caracteristicas:2}")
    private int cantidadCaracteristicas;
    @Value("${seeder.export.productos:2}")
    private int cantidadProductos;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      BCryptPasswordEncoder passwordEncoder,
                      CategoriaRepository categoriaRepository,
                      CaracteristicaRepository caracteristicaRepository,
                      ProductoRepository productoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoriaRepository = categoriaRepository;
        this.caracteristicaRepository = caracteristicaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();

        if (exportEnabled) {
            exportRandomSample();
        } else {
            seedFromClasspathIfEmpty();
        }
    }

    private void seedAdmin() {
        if (usuarioRepository.findByEmail("admin@ejemplo.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setEmail("admin@ejemplo.com");
            admin.setContraseña(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of("ADMIN"));
            usuarioRepository.save(admin);
            System.out.println("✅ Admin creado (admin@ejemplo.com / admin123)");
        }
    }

    // =============== EXPORTACIÓN (UNA VEZ) ===============
    private void exportRandomSample() throws IOException {
        Path base = Paths.get("src/main/resources/static/seeder/exported");
        Files.createDirectories(base.resolve("categorias"));
        Files.createDirectories(base.resolve("caracteristicas"));
        Files.createDirectories(base.resolve("productos"));

        exportCategorias(base);
        exportCaracteristicas(base);
        exportProductos(base);

        System.out.println("📦 Exportación lista en: " + base.toAbsolutePath());
    }

    private void exportCategorias(Path base) throws IOException {
        List<Categoria> todas = categoriaRepository.findAll();
        Collections.shuffle(todas);
        for (Categoria c : todas.stream().limit(cantidadCategorias).toList()) {
            String filename = extractFilename(c.getImagenUrl());
            if (filename == null) continue;
            Path src = Paths.get("uploads/imagenes/" + filename);
            if (!Files.exists(src)) continue;
            Files.copy(src, base.resolve("categorias/" + filename));
            String meta = "nombre=" + safe(c.getNombre()) + "\n" +
                    "descripcion=" + safe(c.getDescripcion()) + "\n";
            Files.write(base.resolve("categorias/" + stripExt(filename) + ".txt"), meta.getBytes());
            System.out.println("✓ Cat exportada: " + c.getNombre());
        }
    }

    private void exportCaracteristicas(Path base) throws IOException {
        List<Caracteristica> todas = caracteristicaRepository.findAll();
        Collections.shuffle(todas);
        for (Caracteristica c : todas.stream().limit(cantidadCaracteristicas).toList()) {
            String filename = extractFilename(c.getImagenUrl());
            if (filename == null) continue;
            Path src = Paths.get("uploads/imagenes/" + filename);
            if (!Files.exists(src)) continue;
            Files.copy(src, base.resolve("caracteristicas/" + filename));
            String meta = "nombre=" + safe(c.getNombre()) + "\n";
            Files.write(base.resolve("caracteristicas/" + stripExt(filename) + ".txt"), meta.getBytes());
            System.out.println("✓ Caract exportada: " + c.getNombre());
        }
    }

    private void exportProductos(Path base) throws IOException {
        List<Producto> todos = productoRepository.findAll();
        Collections.shuffle(todos);
        for (Producto p : todos.stream().limit(cantidadProductos).toList()) {
            Path dir = base.resolve("productos/producto-" + p.getId());
            Files.createDirectories(dir);
            int i = 1;
            if (p.getImagenesData() != null) {
                for (byte[] img : p.getImagenesData()) {
                    Files.write(dir.resolve(i + ".jpg"), img);
                    i++;
                }
            }
            String meta = "nombre=" + safe(p.getNombre()) + "\n" +
                    "descripcion=" + safe(p.getDescripcion()) + "\n" +
                    "precio=" + p.getPrecio() + "\n" +
                    "categoria=" + (p.getCategoria() != null ? safe(p.getCategoria().getNombre()) : "") + "\n" +
                    "caracteristicas=" + joinCarNames(p.getCaracteristicas()) + "\n";
            Files.write(dir.resolve("metadata.txt"), meta.getBytes());
            System.out.println("✓ Prod exportado: " + p.getNombre());
        }
    }

    private String joinCarNames(Set<Caracteristica> set) {
        if (set == null || set.isEmpty()) return "";
        return String.join(",", set.stream().map(Caracteristica::getNombre).toList());
    }

    private String stripExt(String filename) {
        int idx = filename.lastIndexOf('.');
        return idx > 0 ? filename.substring(0, idx) : filename;
    }

    private String extractFilename(String imagenUrl) {
        if (imagenUrl == null) return null;
        return imagenUrl.startsWith("/imagenes/") ? imagenUrl.substring("/imagenes/".length()) : imagenUrl;
    }

    private String safe(String v) { return v == null ? "" : v; }

    // =============== SEED DESDE CLASSPATH ===============
    private void seedFromClasspathIfEmpty() {
        if (categoriaRepository.count() == 0) seedCategoriasFromClasspath();
        if (caracteristicaRepository.count() == 0) seedCaracteristicasFromClasspath();
        if (productoRepository.count() == 0) seedProductosFromClasspath();
    }

    private void seedCategoriasFromClasspath() {
        try {
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] files = resolver.getResources("classpath:/static/seeder/exported/categorias/*.{jpg,jpeg,png}");
            List<Categoria> list = new ArrayList<>();
            for (Resource r : files) {
                String file = r.getFilename();
                if (file == null) continue;
                String base = stripExt(file);
                Map<String,String> meta = readProps(resolver, "classpath:/static/seeder/exported/categorias/" + base + ".txt");
                Categoria c = new Categoria();
                c.setNombre(meta.getOrDefault("nombre", base));
                c.setDescripcion(meta.getOrDefault("descripcion", ""));
                c.setImagenUrl("/imagenes/seeder/exported/categorias/" + file);
                list.add(c);
            }
            if (!list.isEmpty()) categoriaRepository.saveAll(list);
        } catch (Exception e) {
            System.out.println("Seed categorias error: " + e.getMessage());
        }
    }

    private void seedCaracteristicasFromClasspath() {
        try {
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] files = resolver.getResources("classpath:/static/seeder/exported/caracteristicas/*.{jpg,jpeg,png}");
            List<Caracteristica> list = new ArrayList<>();
            for (Resource r : files) {
                String file = r.getFilename();
                if (file == null) continue;
                String base = stripExt(file);
                Map<String,String> meta = readProps(resolver, "classpath:/static/seeder/exported/caracteristicas/" + base + ".txt");
                Caracteristica c = new Caracteristica();
                c.setNombre(meta.getOrDefault("nombre", base));
                c.setImagenUrl("/imagenes/seeder/exported/caracteristicas/" + file);
                list.add(c);
            }
            if (!list.isEmpty()) caracteristicaRepository.saveAll(list);
        } catch (Exception e) {
            System.out.println("Seed caracteristicas error: " + e.getMessage());
        }
    }

    private void seedProductosFromClasspath() {
        try {
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] dirs = resolver.getResources("classpath:/static/seeder/exported/productos/producto-*");
            List<Categoria> cats = categoriaRepository.findAll();
            List<Caracteristica> cars = caracteristicaRepository.findAll();
            List<Producto> list = new ArrayList<>();
            for (Resource d : dirs) {
                String dirName = d.getFilename();
                if (dirName == null) continue;
                Resource[] imgs = resolver.getResources("classpath:/static/seeder/exported/productos/" + dirName + "/*.{jpg,jpeg,png}");
                if (imgs.length == 0) continue;

                Map<String,String> meta = readProps(resolver, "classpath:/static/seeder/exported/productos/" + dirName + "/metadata.txt");
                Producto p = new Producto();
                p.setNombre(meta.getOrDefault("nombre", dirName));
                p.setDescripcion(meta.getOrDefault("descripcion", ""));
                try { p.setPrecio(Double.parseDouble(meta.getOrDefault("precio", "100.0"))); } catch (Exception ignored) {}

                String catName = meta.get("categoria");
                if (catName != null) cats.stream().filter(c -> catName.equals(c.getNombre())).findFirst().ifPresent(p::setCategoria);
                if (p.getCategoria() == null && !cats.isEmpty()) p.setCategoria(cats.get(0));

                String carNames = meta.get("caracteristicas");
                if (carNames != null) {
                    Set<Caracteristica> set = new HashSet<>();
                    for (String n : carNames.split(",")) cars.stream().filter(c -> n.trim().equals(c.getNombre())).findFirst().ifPresent(set::add);
                    p.setCaracteristicas(set);
                }

                List<byte[]> data = new ArrayList<>();
                for (Resource img : imgs) data.add(img.getInputStream().readAllBytes());
                p.setImagenesData(data);
                list.add(p);
            }
            if (!list.isEmpty()) productoRepository.saveAll(list);
        } catch (Exception e) {
            System.out.println("Seed productos error: " + e.getMessage());
        }
    }

    private Map<String,String> readProps(ResourcePatternResolver resolver, String location) throws IOException {
        Map<String,String> map = new HashMap<>();
        Resource r = resolver.getResource(location);
        if (!r.exists()) return map;
        for (String line : new String(r.getInputStream().readAllBytes()).split("\n")) {
            if (line.contains("=")) {
                String[] parts = line.split("=", 2);
                map.put(parts[0], parts.length > 1 ? parts[1] : "");
            }
        }
        return map;
    }
}
