# Guía de Pruebas Unitarias de Controladores

## Resumen de Implementación

Se han implementado **6 clases de pruebas unitarias** completas para todos los controladores principales del sistema, utilizando `@WebMvcTest` y `MockMvc` según las especificaciones solicitadas.

## Archivos Creados

### 1. **CategoriaControllerTests.java**
   - `testGetCategorias_DebeRetornar200YListaDeCategorias()` - GET /api/categorias
   - `testCrearCategoria_ConImagenValida_DebeRetornar200()` - POST /api/categorias con imagen
   - `testCrearCategoria_ConErrorIO_DebeRetornar500()` - POST con simulación de IOException
   - `testObtenerCategoria_CuandoExiste_DebeRetornar200()` - GET /api/categorias/{id}
   - `testObtenerCategoria_CuandoNoExiste_DebeRetornar404()` - GET /api/categorias/{id} no encontrado
   - `testEliminarCategoria_CuandoExiste_DebeRetornar200()` - DELETE /api/categorias/{id}
   - `testEliminarCategoria_CuandoNoExiste_DebeRetornar404()` - DELETE /api/categorias/{id} no encontrado

### 2. **ProductoControllerTests.java**
   - `testAgregarProducto_ConDatosValidos_DebeRetornar200()` - POST /api/productos
   - `testAgregarProducto_ConImagenNula_DebeRetornar200()` - POST sin imagen
   - `testAgregarProducto_ConErrorEnImagen_DebeRetornar500()` - POST con error de imagen
   - `testGetRandomProductos_DebeRetornarCantidadEspecificada()` - GET /api/productos/random?cantidad=5
   - `testActualizarProducto_CuandoExiste_DebeRetornar200()` - PUT /api/productos/{id}
   - `testActualizarProducto_CuandoNoExiste_DebeRetornar404()` - PUT /api/productos/{id} no encontrado
   - `testEliminarProducto_CuandoExiste_DebeRetornar200()` - DELETE /api/productos/{id}
   - `testEliminarProducto_CuandoNoExiste_DebeRetornar404()` - DELETE /api/productos/{id} no encontrado
   - `testAsociarCaracteristica_CuandoAmbosExisten_DebeRetornar200()` - POST /api/productos/{id}/caracteristicas
   - `testAsociarCaracteristica_CuandoProductoNoExiste_DebeRetornar404()` - POST características sin producto
   - `testAsociarCaracteristica_CuandoCaracteristicaNoExiste_DebeRetornar404()` - POST características sin característica
   - `testObtenerProductoPorId_CuandoExiste_DebeRetornar200()` - GET /api/productos/{id}
   - `testObtenerProductoPorId_CuandoNoExiste_DebeRetornar404()` - GET /api/productos/{id} no encontrado
   - `testListarProductos_DebeRetornarListaCompleta()` - GET /api/productos

### 3. **CaracteristicaControllerTests.java**
   - `testListarCaracteristicas_DebeRetornarTodasLasCaracteristicas()` - GET /api/caracteristicas
   - `testCrearCaracteristica_ConNombreSinImagen_DebeRetornar200()` - POST /api/caracteristicas sin imagen
   - `testCrearCaracteristica_ConNombreYImagen_DebeGenerarURLConUUID()` - POST /api/caracteristicas con imagen
   - `testActualizarCaracteristica_CambiandoNombreYSubiendoNuevaImagen_DebeRetornar200()` - PUT /api/caracteristicas/{id}
   - `testActualizarCaracteristica_SoloNombre_DebeRetornar200()` - PUT /api/caracteristicas/{id} solo nombre
   - `testActualizarCaracteristica_CuandoNoExiste_DebeLanzarExcepcion()` - PUT /api/caracteristicas/{id} no encontrado
   - `testEliminarCaracteristica_DebeRetornarSinContenido()` - DELETE /api/caracteristicas/{id}
   - `testCrearCaracteristica_ConImagenVacia_DebeCrearSinURL()` - POST /api/caracteristicas con imagen vacía

### 4. **ReservaControllerTests.java**
   - `testCrearReserva_SinAutenticacion_DebeRetornar401()` - POST /api/reservas sin autenticación
   - `testCrearReserva_ProductoNoExiste_DebeRetornar404()` - POST /api/reservas producto no existe
   - `testCrearReserva_UsuarioNoExiste_DebeRetornar401()` - POST /api/reservas usuario no existe
   - `testCrearReserva_FechasInvalidas_DebeRetornar400()` - POST /api/reservas fechas pasadas
   - `testCrearReserva_FechaInicioMayorQueFechaFin_DebeRetornar400()` - POST /api/reservas fechas inválidas
   - `testCrearReserva_ProductoNoDisponible_DebeRetornar400()` - POST /api/reservas producto no disponible
   - `testCrearReserva_SinDisponibilidadEnFechas_DebeRetornar409()` - POST /api/reservas sin disponibilidad
   - `testCrearReserva_Exitosa_DebeRetornar201()` - POST /api/reservas exitoso
   - `testObtenerDisponibilidad_ProductoExiste_DebeRetornarDisponibilidad()` - GET /api/reservas/producto/{id}/disponibilidad
   - `testObtenerDisponibilidad_ProductoNoExiste_DebeRetornar404()` - GET disponibilidad producto no existe
   - `testObtenerReservasUsuario_Autenticado_DebeRetornarReservas()` - GET /api/reservas/usuario
   - `testObtenerReservasUsuario_NoAutenticado_DebeRetornar401()` - GET /api/reservas/usuario sin auth
   - `testObtenerReserva_PropietarioAccede_DebeRetornar200()` - GET /api/reservas/{id} propietario
   - `testObtenerReserva_NoEsPropietario_DebeRetornar403()` - GET /api/reservas/{id} no propietario
   - `testObtenerReserva_ReservaNoExiste_DebeRetornar404()` - GET /api/reservas/{id} no encontrado

### 5. **FavoritoControllerTests.java**
   - `testObtenerFavoritos_UsuarioAutenticado_DebeRetornarLista()` - GET /api/favoritos
   - `testObtenerFavoritos_UsuarioNoAutenticado_DebeRetornar401()` - GET /api/favoritos sin auth
   - `testAgregarFavorito_ConProductoValido_DebeRetornar201()` - POST /api/favoritos
   - `testAgregarFavorito_SinProductoId_DebeRetornar400()` - POST /api/favoritos sin productoId
   - `testAgregarFavorito_ProductoInexistente_DebeRetornar400()` - POST /api/favoritos producto no existe
   - `testEliminarFavorito_CuandoExiste_DebeRetornar200()` - DELETE /api/favoritos/{id}
   - `testEliminarFavorito_CuandoNoExiste_DebeRetornar404()` - DELETE /api/favoritos/{id} no encontrado
   - `testVerificarFavorito_EsFavorito_DebeRetornarTrue()` - GET /api/favoritos/verificar/{productoId}
   - `testVerificarFavorito_NoEsFavorito_DebeRetornarFalse()` - GET /api/favoritos/verificar/{productoId}
   - `testAgregarFavorito_UsuarioNoAutenticado_DebeRetornar401()` - POST /api/favoritos sin auth

### 6. **UsuarioControllerTests.java**
   - `testRegister_UsuarioValido_DebeRetornar200YEnviarCorreo()` - POST /usuarios/register
   - `testRegister_ConError_DebeRetornar500()` - POST /usuarios/register con error
   - `testLogin_ConCredencialesValidas_DebeRetornarToken()` - POST /usuarios/login
   - `testLogin_ConPasswordEnLugarDeContraseña_DebeRetornarToken()` - POST /usuarios/login compatibilidad
   - `testLogin_ConCredencialesInvalidas_DebeRetornar401()` - POST /usuarios/login credenciales inválidas
   - `testGetUsuarioByEmail_CuandoExiste_DebeRetornar200()` - GET /usuarios/{email}
   - `testGetUsuarioByEmail_CuandoNoExiste_DebeRetornar404()` - GET /usuarios/{email} no encontrado
   - `testUpdateUsuario_ActualizandoNombreYApellido_DebeRetornar200()` - PUT /usuarios/{email}
   - `testUpdateUsuario_ActualizandoContraseña_DebeEncodePassword()` - PUT /usuarios/{email} con contraseña
   - `testUpdateUsuario_SoloActualizarCamposPresentes_DebeRetornar200()` - PUT /usuarios/{email} parcial
   - `testUpdateUsuario_UsuarioNoExiste_DebeRetornar404()` - PUT /usuarios/{email} no encontrado
   - `testGetAll_DebeRetornarListaDeUsuarios()` - GET /usuarios
   - `testUpdateUsuario_ConContraseñaVacia_NoDebeActualizarContraseña()` - PUT /usuarios/{email} password vacío


## Características Implementadas

✅ **@WebMvcTest** para pruebas unitarias de controladores simples
✅ **@SpringBootTest** para pruebas de integración de controladores con seguridad (ReservaController)
✅ **@MockitoBean** para mockear servicios y repositorios
✅ **MockMvc** para simular solicitudes HTTP
✅ **MockMultipartFile** para simular archivos en uploads
✅ **@WithMockUser** y **@WithAnonymousUser** para pruebas con autenticación
✅ **Verificación de códigos de estado HTTP** (200, 201, 400, 401, 403, 404, 409, 500)
✅ **Verificación de contenido JSON** usando jsonPath
✅ **Mockeo de excepciones** (IOException, RuntimeException)
✅ **Verificación de llamadas a servicios** con verify()
✅ **Pruebas de casos exitosos y de error** para cada endpoint

## Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas de controladores:
```bash
mvn test -Dtest="*ControllerTests"
```

### Ejecutar pruebas de un controlador específico:
```bash
mvn test -Dtest=CategoriaControllerTests
mvn test -Dtest=ProductoControllerTests
mvn test -Dtest=CaracteristicaControllerTests
mvn test -Dtest=ReservaControllerTests
mvn test -Dtest=FavoritoControllerTests
mvn test -Dtest=UsuarioControllerTests
```

### Ejecutar una prueba específica:
```bash
mvn test -Dtest=CategoriaControllerTests#testGetCategorias_DebeRetornar200YListaDeCategorias
```

### Ejecutar todas las pruebas del proyecto:
```bash
mvn test
```

## Estructura de las Pruebas

Cada prueba sigue el patrón **AAA (Arrange-Act-Assert)**:

1. **Arrange (Given)**: Configuración de datos de prueba y mocks
2. **Act (When)**: Ejecución de la llamada HTTP con MockMvc
3. **Assert (Then)**: Verificación de resultados y llamadas a servicios

## Ejemplo de Prueba

```java
@Test
public void testGetCategorias_DebeRetornar200YListaDeCategorias() throws Exception {
    // Given - Configurar datos de prueba
    Categoria categoria1 = new Categoria();
    categoria1.setId(1L);
    categoria1.setNombre("SUV");
    
    when(categoriaService.obtenerTodas()).thenReturn(Arrays.asList(categoria1));

    // When & Then - Ejecutar y verificar
    mockMvc.perform(get("/api/categorias")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(1))
            .andExpect(jsonPath("$[0].nombre").value("SUV"));

    verify(categoriaService, times(1)).obtenerTodas();
}
```

## Notas Importantes

- Todas las pruebas están completamente aisladas y no requieren base de datos
- Se utilizan mocks para todos los servicios y repositorios
- **Dos tipos de pruebas:**
  - **@WebMvcTest** con `@AutoConfigureMockMvc(addFilters = false)`: Para controladores sin lógica de seguridad compleja (Categoria, Producto, Caracteristica, Usuario, Favorito)
  - **@SpringBootTest** con `@AutoConfigureMockMvc`: Para controladores con lógica de autorización (ReservaController)
- **ReservaControllerTests usa `@SpringBootTest`** porque:
  - El controlador recibe `Authentication` como parámetro
  - Tiene validaciones complejas de autorización (401, 403)
  - Verifica propietarios de recursos
- Las clases con `@WebMvcTest` mockean las dependencias de `WebConfig` (JwtUtil, JwtRequestFilter, PermissionService, UsuarioRepository, CustomAccessDeniedHandler)
- **ReservaControllerTests solo mockea servicios de negocio**, Spring carga automáticamente los componentes de seguridad
- Las pruebas de autenticación utilizan `@WithMockUser` y `@WithAnonymousUser` de Spring Security Test
- **Con `@SpringBootTest`, usuarios anónimos reciben 403 (Forbidden) en lugar de 401 (Unauthorized)** debido a la configuración real de seguridad
- Se configuran mocks con `.thenAnswer()` para simular el comportamiento de JPA (asignación de IDs)
- **Todos los DTOs tienen getters y setters** para correcta serialización/deserialización JSON con Jackson
- Se prueban tanto casos exitosos como casos de error (validaciones, excepciones)
- Todas las pruebas están libres de errores de linter

## Cobertura de Pruebas

Las pruebas cubren:
- ✅ Operaciones CRUD completas
- ✅ Manejo de archivos (MultipartFile)
- ✅ Autenticación y autorización
- ✅ Validaciones de datos
- ✅ Manejo de excepciones
- ✅ Códigos de respuesta HTTP correctos
- ✅ Estructura de respuestas JSON

## Total de Pruebas Implementadas

**67 pruebas unitarias** distribuidas en 6 controladores con 100% de éxito.

