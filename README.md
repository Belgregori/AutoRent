# AutoRent Backend API 🚗

Sistema backend completo para plataforma de alquiler de autos desarrollado con Spring Boot 3.5.2 y Java 17.

## ✨ Características Principales

- 🔐 **Autenticación JWT** con roles y permisos granulares
- 🚗 **Gestión completa de vehículos** con categorías y características
- 📅 **Sistema de reservas** con validación de disponibilidad
- ⭐ **Reseñas y valoraciones** de productos
- ❤️ **Lista de favoritos** personalizada por usuario
- 👨‍💼 **Panel administrativo** con gestión de permisos
- 📧 **Notificaciones por email** automáticas
- 🖼️ **Gestión de imágenes** con almacenamiento local
- 📊 **Auditoría completa** de operaciones

## 🛠️ Stack Tecnológico

- **Java 17** - Lenguaje de programación
- **Spring Boot 3.5.2** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT** - Tokens de autenticación
- **Spring Data JPA** - Acceso a datos
- **MySQL 8** - Base de datos
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate

## 🚀 Instalación y Configuración

### Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- MySQL 8.0+
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd alquiler-autos/backend
```

### 2. Configurar Base de Datos

```sql
CREATE DATABASE alquiler_autos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar Variables de Entorno

Editar `src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/alquiler_autos?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña

# Email (Gmail SMTP)
spring.mail.username=tu_email@gmail.com
spring.mail.password=tu_app_password

# JWT (cambiar en producción)
jwt.secret=tu_clave_secreta_muy_segura
```

### 4. Ejecutar la Aplicación

```bash
# Instalar dependencias
mvn clean install

# Ejecutar en modo desarrollo
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## 📚 Documentación de la API

### 🔐 Autenticación

Todos los endpoints protegidos requieren el header de autorización:

```
Authorization: Bearer <jwt_token>
```

### 👥 Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN1** | Superadministrador | Acceso total al sistema |
| **ADMIN2** | Administrador | Permisos granulares configurables |
| **USER** | Usuario común | Acceso limitado a funcionalidades básicas |

### 🛣️ Endpoints Principales

#### Autenticación
```http
POST /usuarios/register    # Registro de usuario
POST /usuarios/login       # Inicio de sesión
GET  /usuarios/{email}     # Obtener perfil de usuario
PUT  /usuarios/{email}     # Actualizar perfil
```

#### Productos
```http
GET    /api/productos                    # Listar productos (público)
GET    /api/productos/{id}               # Obtener producto por ID
GET    /api/productos/random             # Productos aleatorios
POST   /api/productos                    # Crear producto (ADMIN2)
PUT    /api/productos/{id}               # Actualizar producto (ADMIN2)
DELETE /api/productos/{id}               # Eliminar producto (ADMIN2)
```

#### Reservas
```http
POST   /api/reservas                     # Crear reserva
GET    /api/reservas/usuario             # Mis reservas
GET    /api/reservas/{id}                # Obtener reserva
PUT    /api/reservas/{id}/cancelar       # Cancelar reserva
GET    /api/reservas/producto/{id}/disponibilidad  # Consultar disponibilidad
```

#### Administración
```http
GET    /api/admin/users                  # Listar usuarios (ADMIN)
GET    /api/admin/permissions            # Listar permisos
PATCH  /api/admin/users/{id}/permissions # Asignar permisos (ADMIN1)
PATCH  /api/admin/users/{id}/role        # Asignar rol (ADMIN1)
```

#### Reseñas y Favoritos
```http
POST   /api/resenas                      # Crear reseña
GET    /api/resenas/producto/{id}        # Reseñas de producto
POST   /api/favoritos                    # Agregar a favoritos
GET    /api/favoritos                    # Mis favoritos
DELETE /api/favoritos/{productoId}       # Quitar de favoritos
```

### 📝 Ejemplos de Uso

#### Registro de Usuario
```bash
curl -X POST http://localhost:8080/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@ejemplo.com",
    "contraseña": "miPassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "contraseña": "miPassword123"
  }'
```

#### Crear Reserva
```bash
curl -X POST http://localhost:8080/api/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "productoId": 1,
    "fechaInicio": "2024-02-01",
    "fechaFin": "2024-02-05"
  }'
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Para producción, usar variables de entorno:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/alquiler_autos
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=clave_super_secreta_produccion
export EMAIL_PASSWORD=app_password_gmail
```

### Configuración de CORS

El sistema está configurado para desarrollo con estos orígenes permitidos:
- `http://localhost:3000`
- `http://localhost:5173-5176`

Para producción, actualizar en `WebConfig.java`.

### Gestión de Archivos

- **Tamaño máximo**: 10MB por archivo
- **Ubicación**: `/uploads/imagenes/`
- **Formatos**: JPG, PNG, JPEG
- **Acceso**: `/imagenes/{filename}`

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
mvn test

# Tests específicos
mvn test -Dtest=UsuarioServiceTest

# Con cobertura
mvn clean test jacoco:report
```

### Cobertura de Código

```bash
# Generar reporte de cobertura
mvn jacoco:report

# Ver reporte en: target/site/jacoco/index.html
```

## 📁 Estructura del Proyecto

```
src/main/java/com/autoRent/autoRent/
├── controller/              # Controladores REST
│   ├── AdminController.java
│   ├── ProductoController.java
│   ├── ReservaController.java
│   ├── UsuarioController.java
│   └── ...
├── service/                # Lógica de negocio
│   ├── UsuarioService.java
│   ├── ProductoService.java
│   ├── ReservaService.java
│   └── ...
├── repository/             # Acceso a datos
│   ├── UsuarioRepository.java
│   ├── ProductoRepository.java
│   └── ...
├── model/                  # Entidades JPA
│   ├── Usuario.java
│   ├── Producto.java
│   ├── Reserva.java
│   └── ...
├── DTO/                    # Objetos de transferencia
│   ├── ReservaRequest.java
│   ├── ProductoDTO.java
│   └── ...
├── configuration/          # Configuración Spring
│   ├── WebConfig.java
│   ├── JwtUtil.java
│   └── ...
└── Security/              # Filtros de seguridad
    └── PermissionFilter.java
```

## 🔒 Seguridad

### JWT Configuration
- **Algoritmo**: HS256
- **Expiración**: 7 días
- **Claims**: email, rol

### Permisos Granulares

El sistema implementa permisos específicos por módulo:

| Permiso | Descripción |
|---------|-------------|
| `PRODUCTS_CREATE` | Crear productos |
| `PRODUCTS_UPDATE` | Actualizar productos |
| `PRODUCTS_DELETE` | Eliminar productos |
| `CATEGORIES_CREATE` | Crear categorías |
| `CATEGORIES_UPDATE` | Actualizar categorías |
| `CATEGORIES_DELETE` | Eliminar categorías |
| `FEATURES_CREATE` | Crear características |
| `FEATURES_UPDATE` | Actualizar características |
| `FEATURES_DELETE` | Eliminar características |

### Validaciones de Seguridad

- ✅ Contraseñas encriptadas con BCrypt
- ✅ Validación de tokens JWT
- ✅ Control de acceso basado en roles
- ✅ Filtros de permisos granulares
- ✅ Validación de entrada en todos los endpoints
- ✅ Protección CORS configurada

## 📊 Monitoreo y Logs

### Niveles de Log Configurados

```properties
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### Logs Estructurados

El sistema genera logs para:
- Autenticación y autorización
- Operaciones CRUD
- Errores de aplicación
- Auditoría administrativa

## 🚀 Despliegue

### Desarrollo Local

```bash
mvn spring-boot:run
```

### Producción

```bash
# Compilar
mvn clean package -Pprod

# Ejecutar JAR
java -jar target/autoRent-0.0.1-SNAPSHOT.jar
```

### Docker (Recomendado)

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/autoRent-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código

- Seguir convenciones de Java
- Documentar métodos públicos
- Escribir tests para nueva funcionalidad
- Mantener cobertura de código > 80%

## 📞 Soporte

- **Email**: soporte@autorent.com
- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🏆 Roadmap

### Versión 1.1
- [ ] Sistema de notificaciones push
- [ ] Integración con pasarelas de pago
- [ ] API de reportes avanzados
- [ ] Optimización de rendimiento

### Versión 1.2
- [ ] Sistema de cupones y descuentos
- [ ] Integración con mapas (ubicación de vehículos)
- [ ] App móvil nativa
- [ ] Sistema de chat en tiempo real

---

**Desarrollado con ❤️ por el equipo AutoRent**
