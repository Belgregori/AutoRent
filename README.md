# 🚗 AutoRent - Plataforma Web de Alquiler de Vehículos

AutoRent es una aplicación **Full Stack** desarrollada por **Romina Gregori**. Combina un **backend robusto en Spring Boot (Java 17)** con un **frontend moderno en React 19 + Vite**, ofreciendo una plataforma completa para el alquiler de autos.  

El sistema permite a los usuarios **buscar, reservar y gestionar vehículos** fácilmente, y cuenta con un **panel administrativo avanzado** con gestión de roles y permisos dinámicos.

---

## 📚 Tabla de Contenidos

- 👩🏻‍💻[1. Descripción General](#1-descripción-general)
- 📝[2. Características Principales](#2-características-principales)
- 🛠️ [3. Tecnologías Utilizadas](#3-tecnologías-utilizadas)
- 📋 [4. Requisitos Previos](#4-requisitos-previos)
- ⚙️ [5. Instalación y Configuración](#5-instalación-y-configuración)
  - 5.1 Backend (Spring Boot)](#51-backend-spring-boot)
  - 5.2 Frontend (React + Vite)](#52-frontend-react--vite)
- 🔑 [6. Variables de Entorno](#6-variables-de-entorno)
- 🗄️ [7. Base de Datos](#7-base-de-datos)
- 🔗 [8. Endpoints Principales](#8-endpoints-principales)
- 📁 [9. Estructura del Proyecto](#9-estructura-del-proyecto)
- 🧪 [10. Testing](#10-testing)
- 🚀 [11. Deploy](#11-deploy)
- 💡 [12. Solución de Problemas](#12-solución-de-problemas)
- 🤝 [13. Contribución](#13-contribución)
- ✨  [14. Licencia](#14-licencia)
- 👩‍💻  [15. Autora y Contacto](#15-autora-y-contacto)

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
|-------------|----------|-------------|
| Java | 17 | Lenguaje principal |
| Spring Boot | 3.5.2 | Framework backend |
| Spring Security | 3.5.2 | Autenticación y autorización |
| Spring Data JPA | 3.5.2 | Persistencia de datos |
| Spring Mail | 3.5.2 | Envío de emails |
| MySQL | 8.0+ | Base de datos relacional |
| JWT | 0.11.5 | Manejo de tokens |
| Maven | 3.6+ | Gestión de dependencias |
| Lombok | - | Reducción de código boilerplate |
| Hibernate | - | ORM |
| Jackson | - | Serialización JSON |

### 🔹 Frontend
| Tecnología | Versión | Descripción |
|-------------|----------|-------------|
| React | ^19.1.0 | Biblioteca de UI |
| React Router DOM | ^6.30.1 | Enrutamiento |
| Vite | ^6.3.5 | Servidor y build |
| ESLint | ^9.25.0 | Linter |
| Jest | ^29.7.0 | Testing framework |
| React Testing Library | ^16.0.1 | Testing de componentes |
| MSW | ^1.3.2 | Mock Service Worker |
| CSS Modules | - | Estilos modulares |
| Babel | ^7.26.0 | Transpilador JS |

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

#### 2️⃣ Configurar `.env`
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

#### 3️⃣ Instalar Dependencias
```bash
mvn clean install
mvn spring-boot:run
```

#### 4️⃣ Usuario administrador por defecto

Al levantar el backend por primera vez, si la base de datos está vacía, el sistema crea automáticamente un **usuario administrador**
con rol `ADMIN` para permitir el acceso inicial al panel de administración.

Credenciales por defecto:                                                                                                                          
Email: admin@ejemplo.com
Contraseña: admin123                                                                                                                   
> ⚠️ Se recomienda cambiar estas credenciales al usar el proyecto fuera de un entorno de desarrollo.

#### ✅ Verificar
- API: http://localhost:8080
- BD: creada automáticamente
- Logs: sin errores

---

### 5.2 Frontend (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

> Servidor: http://localhost:5173

#### Proxy en `vite.config.js`
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
  },
}
```

---

## 6. Variables de Entorno  🗝️

### Backend
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DB_NAME | Nombre BD | alquiler_autos |
| DB_USER | Usuario MySQL | root |
| DB_PASSWORD | Contraseña | password |
| DB_HOST | Host | localhost |
| DB_PORT | Puerto | 3306 |
| JWT_SECRET | Clave JWT | claveSuperSecreta |
| EMAIL_USERNAME | Email | tu_email@gmail.com |
| EMAIL_PASSWORD | App password | app_password |
| FRONTEND_URL | URL frontend | http://localhost:5173 |

### Frontend `.env.example`
```bash
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=AutoRent
```

---

## 7. Base de Datos  🌐

### Tablas Principales
- usuarios
- productos
- categorias
- caracteristicas
- reservas
- favoritos
- resenas
- imagenes_producto
- usuario_roles
- usuario_permissions
- audit_log


📌 Diagrama generado con dbdiagram.io
 "https://github.com/user-attachments/assets/eb3380ae-c3a2-4d9b-9d8c-58f2b459fb06"



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


| Módulo | Método | Endpoint | Descripción | Autenticación |
|--------|---------|-----------|--------------|----------------|
| **Usuarios** | POST | `/usuarios/register` | Registrar nuevo usuario | ❌ |
| | POST | `/usuarios/login` | Iniciar sesión | ❌ |
| **Productos** | GET | `/api/productos` | Listar productos | ❌ |
| | GET | `/api/productos/{id}` | Obtener producto por ID | ❌ |
| | POST | `/api/productos` | Crear producto | ✅ |
| | DELETE | `/api/productos/{id}` | Eliminar producto | ✅ |
| **Reservas** | POST | `/api/reservas` | Crear reserva | ✅ |
| | GET | `/api/reservas/usuario` | Ver reservas del usuario | ✅ |
| | GET | `/api/reservas/producto/{id}/disponibilidad` | Ver disponibilidad | ❌ |
| | GET | `/api/reservas/admin/todas` | Ver todas las reservas | ✅ Admin |
| **Favoritos** | GET | `/api/favoritos` | Listar favoritos | ✅ |
| | POST | `/api/favoritos` | Agregar a favoritos | ✅ |
| | DELETE | `/api/favoritos/{productoId}` | Quitar de favoritos | ✅ |
| **Reseñas** | POST | `/api/resenas` | Crear reseña | ✅ |
| | GET | `/api/resenas/producto/{id}` | Ver reseñas de un producto | ❌ |
| | GET | `/api/resenas/producto/{id}/resumen` | Promedio de valoraciones | ❌ |
| **Categorías** | GET | `/api/categorias` | Listar categorías | ❌ |
| | POST | `/api/categorias` | Crear categoría | ✅ |
| | DELETE | `/api/categorias/{id}` | Eliminar categoría | ✅ |
| **Características** | GET | `/api/caracteristicas` | Listar características | ❌ |
| | POST | `/api/caracteristicas` | Crear característica | ✅ |
| | DELETE | `/api/caracteristicas/{id}` | Eliminar característica | ✅ |
| **Administración** | GET | `/api/admin/users` | Listar usuarios | ✅ Admin |
| | GET | `/api/admin/permissions` | Listar permisos | ✅ Admin |
| | PATCH | `/api/admin/users/{id}/permissions` | Asignar permisos | ✅ Admin |

## 9. Estructura del Proyecto

```
AutoRent/
├── backend/
│   ├── src/main/java/com/autoRent/autoRent/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── DTO/
│   │   ├── configuration/
│   │   └── AutoRentApplication.java
│   └── resources/
│       └── application.properties
│   ├── pom.xml
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── pagesUser/
    │   ├── hooks/
    │   ├── utils/
    │   └── main.jsx
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

---

## 10. Testing

### Backend
```bash
mvn test
mvn test jacoco:report
```

### Frontend
```bash
npm run test
npm run test:watch
npm run test -- --coverage
```

---

## 11. Deploy

### Backend (Railway / Render / Heroku)
```bash
mvn clean package
java -jar target/autoRent-0.0.1-SNAPSHOT.jar
```

### Frontend (Vercel / Netlify / GitHub Pages)
```bash
npm run build
vercel
```

Variables de entorno en producción:
```
VITE_API_URL=https://backend-deploy/api
VITE_APP_NAME=AutoRent
```

---

## 12. Solución de Problemas

### ❌ Error: Could not connect to database
- Verificar MySQL corriendo
- Revisar `.env`
- Confirmar base creada

### ❌ Error: Port 8080 already in use
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### ❌ Error: Maven not found
- Agregar Maven al PATH

---

## 13. Contribución

1. Hacer fork del repositorio  
2. Crear rama de feature  
3. Hacer commit y push  
4. Crear pull request

---

## 14. Licencia

Este proyecto está bajo la Licencia **MIT**.

---

## 15. Autora y Contacto

**Romina Belgregori**  
📧 autorentargentina@gmail.com  
📦 [Repositorio GitHub](https://github.com/Belgregori/AutoRent)

---

## 16. Imagenes

Home ![Imagen de WhatsApp 2025-10-24 a las 11 25 33_b3604cff](https://github.com/user-attachments/assets/4840f4d6-6dd7-4b1a-81fa-90c266995bd8)
Panel del admin ![Imagen de WhatsApp 2025-10-24 a las 11 26 14_c944054b](https://github.com/user-attachments/assets/839a46cb-bbf7-4aff-a2a3-7b5ea202a94c)
Lista de productos ![Imagen de WhatsApp 2025-10-24 a las 11 26 42_a53f918f](https://github.com/user-attachments/assets/b668a5cd-0911-47ec-94f8-64ae4b84f9e6)


