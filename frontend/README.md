# 🚗 AutoRent - Frontend

Una plataforma web moderna para el alquiler de vehículos desarrollada con React 19 y Vite. AutoRent permite a los usuarios buscar, reservar y gestionar alquileres de autos de manera intuitiva, con un sistema completo de administración y gestión de roles.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [📦 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🔗 Conexión con Backend](#-conexión-con-backend)
- [🏗️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🚀 Comandos Disponibles](#-comandos-disponibles)
- [🧪 Testing](#-testing)
- [📦 Construcción para Producción](#-construcción-para-producción)
- [🌐 Deploy](#-deploy)
- [🔐 Sistema de Autenticación y Roles](#-sistema-de-autenticación-y-roles)
- [📱 Capturas de Pantalla](#-capturas-de-pantalla)
- [🤝 Contribución](#-contribución)

## ✨ Características Principales

- 🏠 **Página de inicio** con catálogo de vehículos y filtros avanzados
- 👤 **Sistema de autenticación** completo (login/registro)
- 🔐 **Gestión de perfiles** de usuario
- ❤️ **Sistema de favoritos** para guardar vehículos
- 📅 **Gestión de reservas** con calendario de disponibilidad
- ⭐ **Sistema de valoraciones** y reseñas
- 🛠️ **Panel de administración** completo
- 📱 **Diseño responsive** optimizado para móviles y desktop
- 🔒 **Rutas protegidas** con sistema de roles (USER/ADMIN)
- 📞 **Integración con WhatsApp** para contacto directo

## 🛠️ Tecnologías Utilizadas

### Frontend Principal
- **React**: ^19.1.0 - Biblioteca principal para la interfaz de usuario
- **React DOM**: ^19.1.0 - Renderizado de React en el DOM
- **React Router DOM**: ^6.30.1 - Enrutamiento para aplicaciones React
- **Vite**: ^6.3.5 - Herramienta de build rápida y servidor de desarrollo

### Herramientas de Desarrollo
- **ESLint**: ^9.25.0 - Linter para mantener código limpio
- **Jest**: ^29.7.0 - Framework de testing
- **React Testing Library**: ^16.0.1 - Utilidades para testing de componentes
- **MSW**: ^1.3.2 - Mock Service Worker para testing
- **Babel**: ^7.26.0 - Transpilador de JavaScript

### Estilos
- **CSS Modules** - Para estilos modulares y encapsulados
- **CSS3** - Estilos modernos con flexbox y grid

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión mínima 18.x o superior
- **npm**: Versión mínima 8.x o superior (viene incluido con Node.js)
- **Git**: Para clonar el repositorio

### Verificar instalaciones

```bash
node --version
npm --version
git --version
```

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Belgregori/AutoRent.git
cd AutoRent/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecutará en `http://localhost:5173`

## ⚙️ Configuración

### Configuración del Backend

El proyecto está configurado para conectarse al backend en `http://localhost:53059`. 

**No necesitas configurar variables de entorno** - el proyecto funciona directamente con la configuración del proxy en `vite.config.js`.

## 🔗 Conexión con Backend

### Configuración de Proxy

El proyecto está configurado para usar un proxy que redirige las peticiones al backend. En `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:53059',
        changeOrigin: true,
        secure: false,
      },
      '/imagenes': {
        target: 'http://localhost:53059',
        changeOrigin: true,
        secure: false,
      },
      // ... más configuraciones de proxy
    },
  },
})
```

### Verificar Conexión

1. **Asegúrate de que el backend esté ejecutándose** en el puerto 53059
2. **Verifica CORS** en el backend para permitir peticiones desde `http://localhost:5173`
3. **Revisa la consola del navegador** para errores de conexión

### Puertos por Defecto

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:53059`

> ⚠️ **Importante**: Si tu backend corre en otro puerto, modifica el archivo `vite.config.js` y cambia la URL del target en la configuración del proxy.

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Header.jsx       # Cabecera de la aplicación
│   ├── Footer.jsx       # Pie de página
│   ├── Main.jsx         # Componente principal del home
│   ├── FormularioReserva.jsx
│   ├── SistemaValoracion.jsx
│   ├── WhatsAppButton.jsx
│   └── ...
├── pages/               # Páginas de administración
│   ├── Adminpage.jsx    # Panel principal de admin
│   ├── LoginPage.jsx    # Página de login
│   ├── AgregarProductos.jsx
│   ├── ListaProductos.jsx
│   ├── AdministrarCaracteristicas.jsx
│   └── ...
├── pagesUser/           # Páginas del usuario final
│   ├── Home.jsx         # Página de inicio
│   ├── DetalleProducto.jsx
│   ├── ProfilePage.jsx  # Perfil de usuario
│   ├── FavoritosPage.jsx
│   ├── MisReservasPage.jsx
│   └── RegisterPage.jsx
├── hooks/               # Hooks personalizados
│   ├── useReservas.js   # Hook para gestión de reservas
│   ├── useFavoritos.js  # Hook para favoritos
│   ├── useResenas.js    # Hook para reseñas
│   └── ...
├── utils/               # Utilidades y helpers
│   └── errorHandler.js  # Manejo de errores
├── test/                # Configuración de testing
│   └── msw/             # Mock Service Worker
├── App.jsx              # Componente principal
└── main.jsx             # Punto de entrada
```

## 🚀 Comandos Disponibles

### Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Ejecutar con hot reload
npm run dev -- --host
```

### Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test -- --coverage
```

### Linting

```bash
# Ejecutar linter
npm run lint

# Ejecutar linter con auto-fix
npm run lint -- --fix
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🧪 Testing

El proyecto incluye una suite completa de testing configurada con:

- **Jest**: Framework de testing principal
- **React Testing Library**: Utilidades para testing de componentes React
- **MSW**: Mock Service Worker para simular respuestas del backend
- **jsdom**: Entorno de testing que simula el DOM del navegador

### Estructura de Tests

```
src/
├── components/
│   ├── Header.test.jsx
│   ├── Footer.test.jsx
│   └── ...
├── test/
│   └── msw/
│       ├── handlers.js    # Handlers para MSW
│       └── server.js      # Configuración del servidor MSW
└── setupTests.js          # Configuración global de tests
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests una vez
npm run test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con cobertura de código
npm run test -- --coverage
```

## 📦 Construcción para Producción

### 1. Construir la aplicación

```bash
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados para producción.

### 2. Previsualizar la construcción

```bash
npm run preview
```

Esto ejecutará un servidor local para previsualizar la aplicación construida.

### 3. Archivos generados

La construcción genera:
- `dist/index.html` - Página principal
- `dist/assets/` - Archivos CSS y JS optimizados
- `dist/logo.png` - Recursos estáticos

## 🌐 Deploy

### Vercel (Recomendado)

1. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configurar variables de entorno** en el dashboard de Vercel:
   - `VITE_API_URL`: URL de tu backend en producción
   - `VITE_IMAGES_URL`: URL de tu CDN o servidor de imágenes
   - `VITE_APP_NAME`: AutoRent

### Netlify

1. **Construir la aplicación**:
```bash
npm run build
```

2. **Subir la carpeta `dist/`** a Netlify

3. **Configurar variables de entorno** en Netlify

### GitHub Pages

1. **Instalar gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Agregar script al package.json**:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run build
npm run deploy
```

## 🔐 Sistema de Autenticación y Roles

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

```javascript
// Ruta solo para usuarios autenticados
<Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

// Ruta solo para administradores
<Route path="/admin" element={<PrivateRoute requiredRole="ADMIN"><Adminpage /></PrivateRoute>} />
```

### Componente PrivateRoute

```javascript
export const PrivateRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

## 📱 Capturas de Pantalla

<!-- Espacio reservado para capturas de pantalla -->

### Funcionalidades Principales:

- 🏠 **Página de inicio** con catálogo de vehículos
- 👤 **Sistema de login/registro**
- 🔐 **Panel de administración**
- ❤️ **Sistema de favoritos**
- 📅 **Gestión de reservas**
- ⭐ **Sistema de valoraciones**

> 📸 *Las capturas de pantalla se agregarán próximamente*

## 🤝 Contribución

### Cómo contribuir:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre un Pull Request**

### Estándares de código:

- Usar **ESLint** para mantener código limpio
- Escribir **tests** para nuevas funcionalidades
- Seguir las **convenciones de naming** del proyecto
- Documentar funciones complejas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Romina Belgregori**

---

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación del backend](../backend/README.md)
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que el backend esté ejecutándose
4. Revisa la consola del navegador para errores

---

*Desarrollado con ❤️ usando React 19 y Vite*