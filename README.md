# 🚗 AutoRent - Frontend

## 🏷️ Título y descripción breve del proyecto

**AutoRent** es una plataforma web completa para el alquiler de vehículos que permite a los usuarios buscar, reservar y gestionar alquileres de autos de manera intuitiva. El frontend de esta aplicación está desarrollado en React y se conecta con un backend API para proporcionar una experiencia de usuario fluida y moderna.

El frontend maneja toda la interfaz de usuario, incluyendo:
- 🏠 Página de inicio con catálogo de vehículos
- 👤 Sistema de autenticación (login/registro)
- 🔐 Gestión de perfiles de usuario
- ❤️ Sistema de favoritos
- 📅 Gestión de reservas
- ⭐ Sistema de valoraciones y reseñas
- 🛠️ Panel de administración completo
- 📱 Diseño responsive y moderno

## ⚙️ Tecnologías principales y versiones

- **React**: ^19.1.0
- **React DOM**: ^19.1.0
- **React Router DOM**: ^6.30.1
- **Vite**: ^6.3.5 (Build tool)
- **Node.js**: Versión mínima 18.x
- **npm**: Versión mínima 8.x

## 💾 Instalación local

### Requisitos previos

- **Node.js**: Versión mínima 18.x
- **npm**: Versión mínima 8.x
- **Git**: Para clonar el repositorio

### Comandos para instalar y ejecutar el proyecto

```bash
# Clonar el repositorio
git clone [https://github.com/Belgregori/AutoRent.git]

# Navegar al directorio del frontend
cd frontend/front-alquiler-autos

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar linter
npm run lint
```

## 🌐 Configuración Frontend (.env.example)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL base del backend API
VITE_API_URL=http://localhost:53059

# URL base para imágenes
VITE_IMAGES_URL=http://localhost:53059/imagenes

# URL base para uploads
VITE_UPLOADS_URL=http://localhost:53059/uploads

# Configuración de desarrollo
VITE_NODE_ENV=development

# URL del frontend (para producción)
VITE_FRONTEND_URL=http://localhost:5173
```

### Descripción de variables:

- `VITE_API_URL`: URL base del backend API donde se realizan las peticiones HTTP
- `VITE_IMAGES_URL`: URL base para acceder a las imágenes de los vehículos
- `VITE_UPLOADS_URL`: URL base para archivos subidos por usuarios
- `VITE_NODE_ENV`: Entorno de ejecución (development/production)
- `VITE_FRONTEND_URL`: URL del frontend para redirecciones y enlaces

## 🧩 Dependencias principales

### Dependencias de producción:
- **react**: ^19.1.0 - Biblioteca principal de React
- **react-dom**: ^19.1.0 - Renderizado de React en el DOM
- **react-router-dom**: ^6.30.1 - Enrutamiento para aplicaciones React

### Dependencias de desarrollo:
- **@vitejs/plugin-react-swc**: ^3.9.0 - Plugin de Vite para React con SWC
- **vite**: ^6.3.5 - Herramienta de build rápida
- **eslint**: ^9.25.0 - Linter para JavaScript/React
- **jest**: ^29.7.0 - Framework de testing
- **@testing-library/react**: ^16.0.1 - Utilidades para testing de React
- **msw**: ^1.3.2 - Mock Service Worker para testing

## 🧪 Testing

El proyecto incluye una suite completa de testing con Jest y React Testing Library:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con cobertura
npm run test -- --coverage
```

### Estructura de testing:
- Tests unitarios para componentes React
- Tests de integración para hooks personalizados
- Mocks con MSW para simular respuestas del backend
- Configuración de Jest con jsdom para testing de componentes

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy de producción
vercel --prod
```

### Netlify
```bash
# Build del proyecto
npm run build

# Subir carpeta dist/ a Netlify
```

### Variables de entorno para producción:
- Configurar `VITE_API_URL` con la URL del backend en producción
- Configurar `VITE_IMAGES_URL` con la URL de CDN o servidor de imágenes
- Configurar `VITE_FRONTEND_URL` con la URL del frontend desplegado

**URL del deploy**: [Agregar URL del deploy cuando esté disponible]

## 🖼️ Capturas o demostración

<!-- Espacio reservado para capturas de pantalla o video demostrativo -->

### Funcionalidades principales:
- 🏠 **Página de inicio**: Catálogo de vehículos con filtros y búsqueda
- 👤 **Autenticación**: Login y registro de usuarios
- 🔐 **Perfil de usuario**: Gestión de datos personales
- ❤️ **Favoritos**: Lista de vehículos favoritos
- 📅 **Reservas**: Gestión completa de reservas
- ⭐ **Valoraciones**: Sistema de reseñas y calificaciones
- 🛠️ **Panel admin**: Gestión completa de vehículos, categorías y usuarios

## ✍️ Autora

**Romina Belgregori**

---

## 📝 Notas adicionales

- El proyecto utiliza CSS Modules para el styling
- Implementa un sistema de roles (USER/ADMIN) con rutas protegidas
- Incluye manejo de errores global y notificaciones
- Diseño responsive optimizado para móviles y desktop
- Integración con WhatsApp para contacto directo
