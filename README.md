# 🚗 AutoRent - Backend API

## 📋 Descripción

**AutoRent** es una plataforma completa de alquiler de autos desarrollada con Spring Boot. El backend proporciona una API REST robusta que permite a los usuarios buscar, reservar y gestionar alquileres de vehículos, con funcionalidades avanzadas como sistema de favoritos, reseñas, administración de usuarios y notificaciones por email.

### ✨ Funcionalidades Principales

- 🔐 **Autenticación y autorización** con JWT
- 🚙 **Gestión de productos** (vehículos) con imágenes y características
- 📅 **Sistema de reservas** con verificación de disponibilidad
- ⭐ **Sistema de favoritos** para usuarios
- 📝 **Reseñas y valoraciones** de productos
- 👥 **Panel de administración** con gestión de usuarios y permisos
- 📧 **Notificaciones por email** (registro y confirmación de reservas)
- 🏷️ **Categorización** de productos
- 🔍 **Búsqueda y filtrado** por características

---

## 🛠️ Tecnologías y Versiones

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Java** | 17 | Lenguaje de programación |
| **Spring Boot** | 3.5.2 | Framework principal |
| **Spring Security** | 3.5.2 | Autenticación y autorización |
| **Spring Data JPA** | 3.5.2 | Persistencia de datos |
| **Spring Mail** | 3.5.2 | Envío de emails |
| **MySQL** | 8.0+ | Base de datos relacional |
| **JWT** | 0.11.5 | Tokens de autenticación |
| **Lombok** | - | Reducción de código boilerplate |
| **Maven** | 3.6+ | Gestión de dependencias |
| **Jackson** | - | Serialización JSON |
| **Hibernate** | - | ORM |

---

## ⚙️ Requisitos Previos

### Versiones Mínimas Requeridas

- **Java 17** o superior
- **Maven 3.6** o superior
- **MySQL 8.0** o superior
- **Git** (para clonar el repositorio)

### Verificar Instalaciones

```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar MySQL
mysql --version
```

---

## 🚀 Instalación y Configuración

### 1. 📥 Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd alquiler-autos/backend
```

### 2. 🗄️ Crear Base de Datos

```sql
-- Conectar a MySQL
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE alquiler_autos;

-- Verificar creación
SHOW DATABASES;

-- Salir de MySQL
EXIT;
```

### 3. ⚙️ Configurar Variables de Entorno

```bash
# Copiar archivo de configuración
cp env.production .env

# Editar el archivo .env con tus credenciales
nano .env  # o usar cualquier editor de texto
```

### 4. 📝 Configurar archivo .env

```bash
# ==== CONFIGURACIÓN BASE DE DATOS ====
DB_NAME=alquiler_autos
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_HOST=localhost
DB_PORT=3306

# ==== CONFIGURACIÓN JWT ====
JWT_SECRET=claveSuperSecretaParaFirmarTokens

# ==== CONFIGURACIÓN DE EMAIL (SMTP) ====
EMAIL_USERNAME=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_gmail
EMAIL_FROM=tu_email@gmail.com

# ==== CONFIGURACIÓN CORS ====
FRONTEND_URL=http://localhost:5173
```

### 5. 🔧 Instalar Dependencias

```bash
# Limpiar e instalar dependencias
mvn clean install

# Si hay errores, forzar actualización
mvn clean install -U
```

### 6. 🚀 Ejecutar la Aplicación

```bash
# Ejecutar con Maven
mvn spring-boot:run

# O compilar y ejecutar JAR
mvn clean package
java -jar target/autoRent-0.0.1-SNAPSHOT.jar
```

### 7. ✅ Verificar Instalación

- **Aplicación**: http://localhost:8080
- **Base de datos**: Se crea automáticamente con las tablas
- **Logs**: Verificar que no hay errores en consola

---

## 🔑 Variables de Entorno

### Configuración Completa

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_NAME` | Nombre de la base de datos | `alquiler_autos` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `tu_password` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `JWT_SECRET` | Clave secreta para JWT | `claveSuperSecreta` |
| `EMAIL_USERNAME` | Email para envío | `tu_email@gmail.com` |
| `EMAIL_PASSWORD` | App password de Gmail | `app_password` |
| `EMAIL_FROM` | Email remitente | `tu_email@gmail.com` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |

### Configuración de Gmail

1. Ir a tu cuenta de Gmail
2. Configuración → Seguridad → Verificación en 2 pasos (activar)
3. Contraseñas de aplicaciones → Generar contraseña
4. Usar esa contraseña en `EMAIL_PASSWORD`

---

## 🔗 Endpoints Principales

### 🔐 Autenticación (`/usuarios`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/usuarios/register` | Registro de nuevo usuario | ❌ |
| `POST` | `/usuarios/login` | Inicio de sesión | ❌ |
| `GET` | `/usuarios` | Listar todos los usuarios | ✅ |
| `GET` | `/usuarios/{email}` | Obtener usuario por email | ✅ |
| `PUT` | `/usuarios/{email}` | Actualizar usuario | ✅ |

### 🚙 Productos (`/api/productos`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/productos` | Listar todos los productos | ❌ |
| `GET` | `/api/productos/{id}` | Obtener producto por ID | ❌ |
| `GET` | `/api/productos/random` | Productos aleatorios | ❌ |
| `GET` | `/api/productos/por-caracteristica/{caractId}` | Filtrar por característica | ❌ |
| `POST` | `/api/productos` | Crear nuevo producto | ✅ |
| `PUT` | `/api/productos/{id}` | Actualizar producto | ✅ |
| `DELETE` | `/api/productos/{id}` | Eliminar producto | ✅ |
| `POST` | `/api/productos/{id}/caracteristicas` | Asociar característica | ✅ |

### 📅 Reservas (`/api/reservas`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/reservas` | Crear nueva reserva | ✅ |
| `GET` | `/api/reservas/usuario` | Reservas del usuario | ✅ |
| `GET` | `/api/reservas/{reservaId}` | Obtener reserva específica | ✅ |
| `PUT` | `/api/reservas/{reservaId}/cancelar` | Cancelar reserva | ✅ |
| `PUT` | `/api/reservas/usuario/{reservaId}/confirmar` | Confirmar reserva | ✅ |
| `DELETE` | `/api/reservas/usuario/{reservaId}` | Eliminar reserva | ✅ |
| `GET` | `/api/reservas/producto/{productoId}/disponibilidad` | Verificar disponibilidad | ❌ |
| `GET` | `/api/reservas/admin/todas` | Todas las reservas (Admin) | ✅ Admin |
| `GET` | `/api/reservas/admin/estadisticas` | Estadísticas (Admin) | ✅ Admin |

### ⭐ Favoritos (`/api/favoritos`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/favoritos` | Listar favoritos del usuario | ✅ |
| `POST` | `/api/favoritos` | Agregar a favoritos | ✅ |
| `DELETE` | `/api/favoritos/{productoId}` | Eliminar de favoritos | ✅ |
| `GET` | `/api/favoritos/verificar/{productoId}` | Verificar si es favorito | ✅ |

### 📝 Reseñas (`/api/resenas`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/resenas` | Crear reseña | ✅ |
| `GET` | `/api/resenas/producto/{productoId}` | Reseñas de un producto | ❌ |
| `GET` | `/api/resenas/producto/{productoId}/resumen` | Resumen de valoraciones | ❌ |
| `GET` | `/api/resenas/producto/{productoId}/puede-valorar` | Verificar si puede valorar | ✅ |

### 🏷️ Categorías (`/api/categorias`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/categorias` | Listar categorías | ❌ |
| `GET` | `/api/categorias/{id}` | Obtener categoría | ❌ |
| `POST` | `/api/categorias` | Crear categoría | ✅ |
| `DELETE` | `/api/categorias/{id}` | Eliminar categoría | ✅ |

### 🔧 Características (`/api/caracteristicas`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/caracteristicas` | Listar características | ❌ |
| `POST` | `/api/caracteristicas` | Crear característica | ✅ |
| `PUT` | `/api/caracteristicas/{id}` | Actualizar característica | ✅ |
| `DELETE` | `/api/caracteristicas/{id}` | Eliminar característica | ✅ |

### 👥 Administración (`/api/admin`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/users` | Listar usuarios | ✅ Admin |
| `GET` | `/api/admin/users-with-permissions` | Usuarios con permisos | ✅ Admin |
| `GET` | `/api/admin/permissions` | Listar permisos | ✅ Admin |
| `GET` | `/api/admin/users/{id}/permissions` | Permisos de usuario | ✅ Admin |
| `PATCH` | `/api/admin/users/{id}/permissions` | Asignar permisos | ✅ Admin |
| `PATCH` | `/api/admin/users/{id}/role` | Asignar rol | ✅ Admin |

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests específicos
mvn test -Dtest=CaracteristicaServiceTest
mvn test -Dtest=UsuarioControllerTests

# Ejecutar tests con reporte
mvn test jacoco:report
```

### Tipos de Tests

- **Tests Unitarios**: Servicios y lógica de negocio
- **Tests de Integración**: Controladores REST
- **Tests de Repositorio**: Acceso a datos
- **Cobertura**: Más de 50 tests implementados

---

## 🗄️ Base de Datos

### Estructura de Tablas

El proyecto crea automáticamente las siguientes tablas:

- **usuarios** - Información de usuarios
- **productos** - Catálogo de vehículos
- **categorias** - Categorías de productos
- **caracteristicas** - Características de productos
- **reservas** - Reservas de alquiler
- **favoritos** - Productos favoritos
- **resenas** - Reseñas y valoraciones
- **imagenes_producto** - Imágenes de productos
- **usuario_roles** - Roles de usuarios
- **usuario_permissions** - Permisos específicos
- **audit_log** - Log de auditoría

### Diagrama de Base de Datos

```
Usuario (1) ←→ (N) Reserva (N) ←→ (1) Producto
    ↓
Usuario_Roles
    ↓
Usuario_Permissions

Producto (N) ←→ (N) Caracteristica
    ↓
Categoria (1) ←→ (N) Producto

Usuario (1) ←→ (N) Favorito (N) ←→ (1) Producto
Usuario (1) ←→ (N) Resena (N) ←→ (1) Producto
```

---

## 📁 Estructura del Proyecto

```
alquiler-autos/backend/
├── src/
│   ├── main/
│   │   ├── java/com/autoRent/autoRent/
│   │   │   ├── controller/          # Controladores REST
│   │   │   │   ├── UsuarioController.java
│   │   │   │   ├── ProductoController.java
│   │   │   │   ├── ReservaController.java
│   │   │   │   ├── FavoritoController.java
│   │   │   │   ├── ResenaController.java
│   │   │   │   ├── CategoriaController.java
│   │   │   │   ├── CaracteristicaController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   └── EmailController.java
│   │   │   ├── service/             # Lógica de negocio
│   │   │   │   ├── UsuarioService.java
│   │   │   │   ├── ProductoService.java
│   │   │   │   ├── ReservaService.java
│   │   │   │   ├── FavoritoService.java
│   │   │   │   ├── ResenaService.java
│   │   │   │   ├── CategoriaService.java
│   │   │   │   ├── CaracteristicaService.java
│   │   │   │   ├── EmailService.java
│   │   │   │   └── PermissionService.java
│   │   │   ├── repository/          # Acceso a datos
│   │   │   │   ├── UsuarioRepository.java
│   │   │   │   ├── ProductoRepository.java
│   │   │   │   ├── ReservaRepository.java
│   │   │   │   └── ...
│   │   │   ├── model/               # Entidades JPA
│   │   │   │   ├── Usuario.java
│   │   │   │   ├── Producto.java
│   │   │   │   ├── Reserva.java
│   │   │   │   └── ...
│   │   │   ├── DTO/                 # Objetos de transferencia
│   │   │   │   ├── ReservaRequest.java
│   │   │   │   ├── ResenaRequest.java
│   │   │   │   └── ...
│   │   │   ├── configuration/       # Configuración Spring
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtRequestFilter.java
│   │   │   │   └── ...
│   │   │   └── AutoRentApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Tests unitarios e integración
│       ├── java/com/autoRent/autoRent/
│       │   ├── controller/
│       │   ├── service/
│       │   └── repository/
├── uploads/imagenes/                # Imágenes subidas
├── target/                         # Archivos compilados
├── pom.xml                         # Configuración Maven
├── .env                           # Variables de entorno
├── env.production                 # Plantilla de variables
└── README.md                      # Este archivo
```

---

## 🚀 Deploy

### Opciones de Despliegue

#### 1. **Railway** (Recomendado)
```bash
# Conectar repositorio
# Configurar variables de entorno en dashboard
# Deploy automático en cada push
```

#### 2. **Render**
```bash
# Conectar repositorio
# Configurar build command: mvn clean package
# Configurar start command: java -jar target/autoRent-0.0.1-SNAPSHOT.jar
# Configurar variables de entorno
```

#### 3. **Heroku**
```bash
# Crear Procfile
echo "web: java -jar target/autoRent-0.0.1-SNAPSHOT.jar" > Procfile

# Deploy
git push heroku main
```

### Variables de Entorno para Producción

```bash
DB_PASSWORD=password_produccion_seguro
MAIL_PASSWORD=app_password_gmail_produccion
JWT_SECRET=clave_super_secreta_produccion
SPRING_PROFILES_ACTIVE=prod
```

---

## 🛠️ Solución de Problemas

### Errores Comunes

#### **Error: "Could not connect to database"**
```bash
# Verificar que MySQL esté corriendo
net start mysql  # Windows
sudo systemctl start mysql  # Linux

# Verificar credenciales en .env
# Verificar que la base de datos existe
mysql -u root -p -e "SHOW DATABASES;"
```

#### **Error: "Port 8080 already in use"**
```bash
# Encontrar proceso usando puerto 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Linux/Mac

# Matar proceso
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Linux/Mac
```

#### **Error: "Java version not found"**
```bash
# Verificar JAVA_HOME
echo $JAVA_HOME  # Linux/Mac
echo %JAVA_HOME%  # Windows

# Configurar JAVA_HOME si es necesario
```

#### **Error: "Maven not found"**
```bash
# Verificar PATH
echo $PATH  # Linux/Mac
echo %PATH%  # Windows

# Agregar Maven al PATH si es necesario
```

---

## 📊 Comandos Útiles

```bash
# Ejecutar aplicación
mvn spring-boot:run

# Compilar proyecto
mvn clean compile

# Ejecutar tests
mvn test

# Generar JAR
mvn clean package

# Ver logs en tiempo real
tail -f logs/application.log

# Verificar puertos
netstat -tulpn | grep :8080
```

---

## 📞 Soporte

Para consultas técnicas o reportar bugs:

- **Email**: autorentagentina@gmail.com
- **GitHub**: [Repositorio del proyecto]

---

## ✍️ Autora

**Romina Belgregori** - Desarrolladora Full Stack

---

*Documentación generada automáticamente - AutoRent Backend API v1.0* 🚗