# 🚗 AutoRent - Plataforma Web de Alquiler de Vehículos

AutoRent es una aplicación **Full Stack** desarrollada por **Romina Gregori**. Combina un **backend robusto en Spring Boot (Java 17)** con un **frontend moderno en React 19 + Vite**, ofreciendo una plataforma completa para el alquiler de autos.

El sistema permite a los usuarios **buscar, reservar y gestionar vehículos** fácilmente, y cuenta con un **panel administrativo avanzado** con gestión de roles y permisos dinámicos.

---

## 📚 Tabla de Contenidos

- [👩🏻‍💻 1. Descripción General](#1-descripción-general-)
- [📝 2. Características Principales](#2-características-principales-)
- [🛠️ 3. Tecnologías Utilizadas](#3-tecnologías-utilizadas-)
- [📋 4. Requisitos Previos](#4-requisitos-previos-)
- [⚙️ 5. Instalación y Configuración](#5-instalación-y-configuración-)
  - [5.1 Backend (Spring Boot)](#51-backend-spring-boot)
  - [5.2 Frontend (React + Vite)](#52-frontend-react--vite)
- [🔑 6. Variables de Entorno](#6-variables-de-entorno-)
- [🗄️ 7. Base de Datos](#7-base-de-datos-)
- [🔗 8. Endpoints Principales](#8-endpoints-principales-)
- [📁 9. Estructura del Proyecto](#9-estructura-del-proyecto)
- [🧪 10. Testing](#10-testing)
- [🚀 11. Deploy](#11-deploy)
- [💡 12. Solución de Problemas](#12-solución-de-problemas)
- [🔐 13. Sistema de Autenticación y Roles](#13-sistema-de-autenticación-y-roles)
- [🤝 14. Contribución](#14-contribución)
- [✨ 15. Licencia](#15-licencia)
- [👩‍💻 16. Autora y Contacto](#16-autora-y-contacto)
- [🖼️ 17. Imágenes](#17-imágenes)

---

## 1. Descripción General 🥁

AutoRent es una plataforma que permite gestionar **alquileres de vehículos**, ofreciendo funcionalidades tanto para el usuario final como para administradores.

Incluye sistema de autenticación con JWT, reservas, reseñas, favoritos, administración de usuarios, categorías, características y notificaciones por correo.

---

## 2. Características Principales 🤓

### 👥 Usuario Final
- Registro e inicio de sesión (JWT)
- Perfil personal y edición de datos
- Sistema de favoritos
- Gestión de reservas con calendario de disponibilidad
- Sistema de valoraciones y reseñas
- Interfaz responsive y diseño moderno

### 🧑‍💼 Administrador
- Panel de administración completo
- Gestión de usuarios, roles y permisos dinámicos
- CRUD de productos, categorías y características
- Auditoría de acciones administrativas

---

## 3. Tecnologías Utilizadas 💻

### 🔹 Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Java** | 17 | Lenguaje principal |
| **Spring Boot** | 3.5.2 | Framework backend |
| **Spring Security** | 3.5.2 | Autenticación y autorización |
| **Spring Data JPA** | 3.5.2 | Persistencia de datos |
| **Spring Mail** | 3.5.2 | Envío de emails |
| **MySQL** | 8.0+ | Base de datos relacional |
| **JWT** | 0.11.5 | Manejo de tokens |
| **Maven** | 3.6+ | Gestión de dependencias |
| **Lombok** | - | Reducción de código boilerplate |
| **Hibernate** | - | ORM |
| **Jackson** | - | Serialización JSON |

### 🔹 Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | ^19.1.0 | Biblioteca de UI |
| **React Router DOM** | ^6.30.1 | Enrutamiento |
| **Vite** | ^6.3.5 | Servidor y build |
| **ESLint** | ^9.25.0 | Linter |
| **Jest** | ^29.7.0 | Testing framework |
| **React Testing Library** | ^16.0.1 | Testing de componentes |
| **MSW** | ^1.3.2 | Mock Service Worker |
| **CSS Modules** | - | Estilos modulares |
| **Babel** | ^7.26.0 | Transpilador JS |

---

## 4. Requisitos Previos 🫡

### 🔧 Backend
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Git

### 💻 Frontend
- Node.js 18+
- npm 8+
- Git

### Verificar Instalaciones

```bash
java -version
mvn -version
mysql --version
node --version
npm --version
git --version
```

---

## 5. Instalación y Configuración 🏗️

### 5.1 Backend (Spring Boot)

```bash
git clone https://github.com/Belgregori/AutoRent.git
cd AutoRent/backend
```

#### 1️⃣ Crear Base de Datos

```sql
mysql -u root -p
CREATE DATABASE alquiler_autos;
SHOW DATABASES;
EXIT;
```

#### 2️⃣ Configurar .env

```bash
DB_NAME=alquiler_autos
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=claveSuperSecreta
EMAIL_USERNAME=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM=tu_email@gmail.com
FRONTEND_URL=http://localhost:5173
```

#### 3️⃣ Instalar Dependencias y Ejecutar

```bash
mvn clean install
mvn spring-boot:run
```

#### 4️⃣ Usuario administrador por defecto

Al levantar el backend por primera vez, si la base de datos está vacía, el sistema crea automáticamente un usuario administrador con rol ADMIN para permitir el acceso inicial al panel de administración.

**Credenciales por defecto:**
- **Email:** admin@ejemplo.com
- **Contraseña:** admin123

> ⚠️ Se recomienda cambiar estas credenciales al usar el proyecto fuera de un entorno de desarrollo.

#### ✅ Verificar
- **API:** http://localhost:8080
- **BD:** creada automáticamente
- **Logs:** sin errores

#### ⚠️ Si el puerto 8080 está ocupado

Si al ejecutar `mvn spring-boot:run` obtenés un error de puerto ocupado, tenés dos opciones:

**Opción 1:** Liberar el puerto 8080
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

**Opción 2:** Usar puerto dinámico
1. En `application.properties`, cambiá `server.port=8080` por `server.port=0`
2. Ejecutá `mvn spring-boot:run`
3. En la consola aparecerá el puerto asignado, por ejemplo: `Tomcat started on port(s): 54321`
4. Actualizá el archivo `frontend/vite.config.js` con ese puerto:
   ```javascript
   target: 'http://localhost:54321'  // Reemplazar en todos los proxy
   ```

---

### 5.2 Frontend (React + Vite)

⚠️ **IMPORTANTE: Primero debes levantar el backend antes de ejecutar el frontend.**

```bash
# Desde la raíz del proyecto
cd frontend
npm install
npm run dev
```

**Servidor:** http://localhost:5173

#### Verificar Puerto del Backend

Antes de ejecutar el frontend, verifica que el backend esté corriendo en el puerto **8080**. Si el backend está en otro puerto, deberás actualizar el archivo `vite.config.js`.

#### Proxy en `vite.config.js`

El frontend está configurado para conectarse al backend mediante un proxy. En `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/imagenes': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/usuarios': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/admin': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

> 💡 Si usaste puerto dinámico en el backend, recordá actualizar el `target` con el puerto real en todas las configuraciones del proxy.

---

## 6. Variables de Entorno 🗝️

### Backend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_NAME` | Nombre BD | `alquiler_autos` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña | `password` |
| `DB_HOST` | Host | `localhost` |
| `DB_PORT` | Puerto | `3306` |
| `JWT_SECRET` | Clave JWT | `claveSuperSecreta` |
| `EMAIL_USERNAME` | Email | `tu_email@gmail.com` |
| `EMAIL_PASSWORD` | App password | `app_password` |
| `EMAIL_FROM` | Email remitente | `tu_email@gmail.com` |
| `FRONTEND_URL` | URL frontend | `http://localhost:5173` |

### Configuración de Gmail para Emails

Para que el sistema de notificaciones por email funcione:

1. Ir a tu cuenta de Gmail
2. Configuración → Seguridad → Verificación en 2 pasos (activar)
3. Contraseñas de aplicaciones → Generar contraseña
4. Usar esa contraseña en `EMAIL_PASSWORD` del archivo `.env`

### Frontend

El frontend no requiere variables de entorno - funciona directamente con la configuración del proxy en `vite.config.js`.

---

## 7. Base de Datos 🌐

### Tablas Principales
- `usuarios`
- `productos`
- `categorias`
- `caracteristicas`
- `reservas`
- `favoritos`
- `resenas`
- `imagenes_producto`
- `usuario_roles`
- `usuario_permissions`
- `audit_log`

📌 **Diagrama generado con dbdiagram.io**

![Diagrama de Base de Datos](https://github.com/user-attachments/assets/eb3380ae-c3a2-4d9b-9d8c-58f2b459fb06)

### Relaciones

```
Usuario (1) ←→ (N) Reserva (N) ←→ (1) Producto
Producto (N) ←→ (N) Caracteristica
Categoria (1) ←→ (N) Producto
Usuario (1) ←→ (N) Favorito (N) ←→ (1) Producto
Usuario (1) ←→ (N) Resena (N) ←→ (1) Producto
```

---

## 8. Endpoints Principales 🧩

| Módulo | Método | Endpoint | Descripción | Auth |
|--------|--------|----------|-------------|------|
| **Usuarios** | `POST` | `/usuarios/register` | Registrar nuevo usuario | ❌ |
| | `POST` | `/usuarios/login` | Iniciar sesión | ❌ |
| **Productos** | `GET` | `/api/productos` | Listar productos | ❌ |
| | `GET` | `/api/productos/{id}` | Obtener producto por ID | ❌ |
| | `POST` | `/api/productos` | Crear producto | ✅ |
| | `DELETE` | `/api/productos/{id}` | Eliminar producto | ✅ |
| **Reservas** | `POST` | `/api/reservas` | Crear reserva | ✅ |
| | `GET` | `/api/reservas/usuario` | Ver reservas del usuario | ✅ |
| | `GET` | `/api/reservas/producto/{id}/disponibilidad` | Ver disponibilidad | ❌ |
| | `GET` | `/api/reservas/admin/todas` | Ver todas las reservas | ✅ Admin |
| **Favoritos** | `GET` | `/api/favoritos` | Listar favoritos | ✅ |
| | `POST` | `/api/favoritos` | Agregar a favoritos | ✅ |
| | `DELETE` | `/api/favoritos/{productoId}` | Quitar de favoritos | ✅ |
| **Reseñas** | `POST` | `/api/resenas` | Crear reseña | ✅ |
| | `GET` | `/api/resenas/producto/{id}` | Ver reseñas de un producto | ❌ |
| | `GET` | `/api/resenas/producto/{id}/resumen` | Promedio de valoraciones | ❌ |
| **Categorías** | `GET` | `/api/categorias` | Listar categorías | ❌ |
| | `POST` | `/api/categorias` | Crear categoría | ✅ |
| | `DELETE` | `/api/categorias/{id}` | Eliminar categoría | ✅ |
| **Características** | `GET` | `/api/caracteristicas` | Listar características | ❌ |
| | `POST` | `/api/caracteristicas` | Crear característica | ✅ |
| | `PUT` | `/api/caracteristicas/{id}` | Actualizar característica | ✅ |
| | `DELETE` | `/api/caracteristicas/{id}` | Eliminar característica | ✅ |
| **Administración** | `GET` | `/api/admin/users` | Listar usuarios | ✅ Admin |
| | `GET` | `/api/admin/users-with-permissions` | Usuarios con permisos | ✅ Admin |
| | `GET` | `/api/admin/permissions` | Listar permisos | ✅ Admin |
| | `GET` | `/api/admin/users/{id}/permissions` | Permisos de usuario | ✅ Admin |
| | `PATCH` | `/api/admin/users/{id}/permissions` | Asignar permisos | ✅ Admin |
| | `PATCH` | `/api/admin/users/{id}/role` | Asignar rol | ✅ Admin |
| **Productos** | `GET` | `/api/productos/random` | Productos aleatorios | ❌ |
| | `GET` | `/api/productos/por-caracteristica/{caractId}` | Filtrar por característica | ❌ |
| | `PUT` | `/api/productos/{id}` | Actualizar producto | ✅ |
| | `POST` | `/api/productos/{id}/caracteristicas` | Asociar característica | ✅ |
| **Reservas** | `GET` | `/api/reservas/{reservaId}` | Obtener reserva específica | ✅ |
| | `PUT` | `/api/reservas/{reservaId}/cancelar` | Cancelar reserva | ✅ |
| | `PUT` | `/api/reservas/usuario/{reservaId}/confirmar` | Confirmar reserva | ✅ |
| | `DELETE` | `/api/reservas/usuario/{reservaId}` | Eliminar reserva | ✅ |
| | `GET` | `/api/reservas/admin/estadisticas` | Estadísticas (Admin) | ✅ Admin |
| **Reseñas** | `GET` | `/api/resenas/producto/{productoId}/puede-valorar` | Verificar si puede valorar | ✅ |
| **Favoritos** | `GET` | `/api/favoritos/verificar/{productoId}` | Verificar si es favorito | ✅ |
| **Usuarios** | `GET` | `/usuarios` | Listar todos los usuarios | ✅ |
| | `GET` | `/usuarios/{email}` | Obtener usuario por email | ✅ |
| | `PUT` | `/usuarios/{email}` | Actualizar usuario | ✅ |

---

## 9. Estructura del Proyecto

```
AutoRent/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/autoRent/autoRent/
│   │   │   │   ├── controller/          # Controladores REST
│   │   │   │   │   ├── UsuarioController.java
│   │   │   │   │   ├── ProductoController.java
│   │   │   │   │   ├── ReservaController.java
│   │   │   │   │   ├── FavoritoController.java
│   │   │   │   │   ├── ResenaController.java
│   │   │   │   │   ├── CategoriaController.java
│   │   │   │   │   ├── CaracteristicaController.java
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   └── EmailController.java
│   │   │   │   ├── service/             # Lógica de negocio
│   │   │   │   │   ├── UsuarioService.java
│   │   │   │   │   ├── ProductoService.java
│   │   │   │   │   ├── ReservaService.java
│   │   │   │   │   ├── FavoritoService.java
│   │   │   │   │   ├── ResenaService.java
│   │   │   │   │   ├── CategoriaService.java
│   │   │   │   │   ├── CaracteristicaService.java
│   │   │   │   │   ├── EmailService.java
│   │   │   │   │   └── PermissionService.java
│   │   │   │   ├── repository/          # Acceso a datos
│   │   │   │   │   ├── UsuarioRepository.java
│   │   │   │   │   ├── ProductoRepository.java
│   │   │   │   │   ├── ReservaRepository.java
│   │   │   │   │   └── ...
│   │   │   │   ├── model/               # Entidades JPA
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   ├── Producto.java
│   │   │   │   │   ├── Reserva.java
│   │   │   │   │   └── ...
│   │   │   │   ├── DTO/                 # Objetos de transferencia
│   │   │   │   │   ├── ReservaRequest.java
│   │   │   │   │   ├── ResenaRequest.java
│   │   │   │   │   └── ...
│   │   │   │   ├── configuration/       # Configuración Spring
│   │   │   │   │   ├── JwtUtil.java
│   │   │   │   │   ├── JwtRequestFilter.java
│   │   │   │   │   └── ...
│   │   │   │   └── AutoRentApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                        # Tests unitarios e integración
│   │       ├── java/com/autoRent/autoRent/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   └── repository/
│   ├── uploads/imagenes/                # Imágenes subidas
│   ├── target/                         # Archivos compilados
│   ├── pom.xml                         # Configuración Maven
│   ├── .env                           # Variables de entorno
│   └── env.example                    # Plantilla de variables
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── Header.jsx       # Cabecera de la aplicación
│   │   │   ├── Footer.jsx       # Pie de página
│   │   │   ├── Main.jsx         # Componente principal del home
│   │   │   ├── FormularioReserva.jsx
│   │   │   ├── SistemaValoracion.jsx
│   │   │   ├── WhatsAppButton.jsx
│   │   │   └── ...
│   │   ├── pages/               # Páginas de administración
│   │   │   ├── Adminpage.jsx    # Panel principal de admin
│   │   │   ├── LoginPage.jsx    # Página de login
│   │   │   ├── AgregarProductos.jsx
│   │   │   ├── ListaProductos.jsx
│   │   │   ├── AdministrarCaracteristicas.jsx
│   │   │   └── ...
│   │   ├── pagesUser/           # Páginas del usuario final
│   │   │   ├── Home.jsx         # Página de inicio
│   │   │   ├── DetalleProducto.jsx
│   │   │   ├── ProfilePage.jsx  # Perfil de usuario
│   │   │   ├── FavoritosPage.jsx
│   │   │   ├── MisReservasPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── hooks/               # Hooks personalizados
│   │   │   ├── useReservas.js   # Hook para gestión de reservas
│   │   │   ├── useFavoritos.js  # Hook para favoritos
│   │   │   ├── useResenas.js    # Hook para reseñas
│   │   │   └── ...
│   │   ├── utils/               # Utilidades y helpers
│   │   │   └── errorHandler.js  # Manejo de errores
│   │   ├── test/                # Configuración de testing
│   │   │   └── msw/             # Mock Service Worker
│   │   ├── App.jsx              # Componente principal
│   │   └── main.jsx             # Punto de entrada
│   ├── public/                  # Archivos estáticos
│   ├── vite.config.js           # Configuración de Vite
│   ├── package.json             # Dependencias y scripts
│   └── jest.config.js           # Configuración de Jest
│
└── README.md                     # Este archivo
```

---

## 10. Testing

### Backend

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests específicos
mvn test -Dtest=CaracteristicaServiceTest
mvn test -Dtest=UsuarioControllerTests

# Ejecutar tests con reporte de cobertura
mvn test jacoco:report
```

**Tipos de Tests:**
- **Tests Unitarios**: Servicios y lógica de negocio
- **Tests de Integración**: Controladores REST
- **Tests de Repositorio**: Acceso a datos
- **Cobertura**: Más de 50 tests implementados

### Frontend

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con cobertura
npm run test -- --coverage
```

**Herramientas de Testing:**
- **Jest**: Framework de testing principal
- **React Testing Library**: Utilidades para testing de componentes React
- **MSW**: Mock Service Worker para simular respuestas del backend
- **jsdom**: Entorno de testing que simula el DOM del navegador

---

## 11. Deploy

### Backend (Railway / Render / Heroku)

#### Opción 1: Railway (Recomendado)
```bash
# Conectar repositorio
# Configurar variables de entorno en dashboard
# Deploy automático en cada push
```

#### Opción 2: Render
```bash
# Conectar repositorio
# Configurar build command: mvn clean package
# Configurar start command: java -jar target/autoRent-0.0.1-SNAPSHOT.jar
# Configurar variables de entorno
```

#### Opción 3: Heroku
```bash
# Crear Procfile
echo "web: java -jar target/autoRent-0.0.1-SNAPSHOT.jar" > Procfile

# Deploy
git push heroku main
```

**Comandos para compilar:**
```bash
mvn clean package
java -jar target/autoRent-0.0.1-SNAPSHOT.jar
```

**Variables de entorno para producción:**
```bash
DB_PASSWORD=password_produccion_seguro
MAIL_PASSWORD=app_password_gmail_produccion
JWT_SECRET=clave_super_secreta_produccion
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (Vercel / Netlify / GitHub Pages)

#### Opción 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Opción 2: Netlify
```bash
# Construir la aplicación
npm run build

# Subir la carpeta dist/ a Netlify
# Configurar variables de entorno en Netlify
```

#### Opción 3: GitHub Pages
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar script al package.json
# "deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

**Variables de entorno en producción:**
```bash
VITE_API_URL=https://tu-backend-deploy/api
VITE_APP_NAME=AutoRent
```

---

## 12. Solución de Problemas

### ❌ Error: Could not connect to database

```bash
# Verificar que MySQL esté corriendo
net start mysql  # Windows
sudo systemctl start mysql  # Linux

# Verificar credenciales en .env
# Verificar que la base de datos existe
mysql -u root -p -e "SHOW DATABASES;"
```

### ❌ Error: Port 8080 already in use

```bash
# Encontrar proceso usando puerto 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Linux/Mac

# Matar proceso
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Linux/Mac
```

O usar `server.port=0` en `application.properties` y actualizar `vite.config.js` con el puerto asignado.

### ❌ Error: Java version not found

```bash
# Verificar JAVA_HOME
echo $JAVA_HOME  # Linux/Mac
echo %JAVA_HOME%  # Windows

# Configurar JAVA_HOME si es necesario
```

### ❌ Error: Maven not found

```bash
# Verificar PATH
echo $PATH  # Linux/Mac
echo %PATH%  # Windows

# Agregar Maven al PATH si es necesario
```

### ❌ Error: Node modules not found

```bash
cd frontend
npm install
```

### ❌ Error: Frontend no se conecta al backend

1. Verificar que el backend esté corriendo en `http://localhost:8080`
2. Verificar que el puerto en `vite.config.js` coincida con el puerto del backend
3. Verificar CORS en el backend para permitir peticiones desde `http://localhost:5173`
4. Revisar la consola del navegador para errores de conexión

---

## 13. Sistema de Autenticación y Roles

### Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:
- Los tokens se almacenan en `localStorage`
- Se incluyen automáticamente en las peticiones HTTP
- Redirección automática al login si el token expira

### Roles y Permisos

#### Roles Disponibles:
- **USER**: Usuario final (puede reservar, ver favoritos, etc.)
- **ADMIN**: Administrador (acceso completo al panel de admin)

#### Rutas Protegidas:

El frontend implementa rutas protegidas mediante el componente `PrivateRoute`:
- Rutas solo para usuarios autenticados
- Rutas solo para administradores
- Redirección automática si no se cumplen los permisos

### Usuario Administrador por Defecto

Al levantar el backend por primera vez, si la base de datos está vacía, el sistema crea automáticamente un usuario administrador:

- **Email:** admin@ejemplo.com
- **Contraseña:** admin123

> ⚠️ Se recomienda cambiar estas credenciales al usar el proyecto fuera de un entorno de desarrollo.

---

## 14. Contribución

1. Hacer fork del repositorio
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de código:
- Usar **ESLint** para mantener código limpio
- Escribir **tests** para nuevas funcionalidades
- Seguir las **convenciones de naming** del proyecto
- Documentar funciones complejas

---

## 15. Licencia

Este proyecto está bajo la **Licencia MIT**.

---

## 16. Autora y Contacto

**Romina Belgregori** - Desarrolladora Full Stack

- 📧 autorentargentina@gmail.com
- 📦 [Repositorio GitHub](https://github.com/Belgregori/AutoRent)

---

## 17. Imágenes

### Home
![Home](https://github.com/user-attachments/assets/b3604cff-home.png)

### Panel del Admin
![Panel Admin](https://github.com/user-attachments/assets/c944054b-admin.png)

### Lista de Productos
![Lista Productos](https://github.com/user-attachments/assets/a53f918f-productos.png)

---

*Desarrollado con ❤️ por Romina Belgregori - AutoRent v1.0* 🚗
