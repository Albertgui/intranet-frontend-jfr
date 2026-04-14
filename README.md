# Intranet Frontend JFR

Este es el frontend de la Intranet JFR, una aplicación web moderna diseñada para la gestión interna de procesos, usuarios, reuniones y tareas. Desarrollada con **React 19**, **Vite** y **Tailwind CSS**, enfocada en ofrecer una experiencia de usuario fluida, rápida y estéticamente atractiva.

---

## 🚀 Tecnologías Utilizadas

El proyecto utiliza un stack tecnológico de última generación para garantizar escalabilidad y rendimiento:

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI)
- **Gestión de Formularios**: [React Hook Form](https://react-hook-form.com/)
- **Validación de Datos**: [Zod](https://zod.dev/)
- **Enrutamiento**: [React Router v7](https://reactrouter.com/)
- **Cliente HTTP**: [Axios](https://axios-http.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

---

## ✨ Características Principales

- 🔐 **Autenticación**: Sistema de login seguro con manejo de tokens JWT almacenados en `localStorage`.
- 📊 **Dashboard**: Panel intuitivo con métricas y resumen de actividades.
- 👥 **Gestión de Usuarios**: Listado, creación y edición de perfiles de usuario.
- 📅 **Reuniones**: Calendario y gestión de juntas programadas.
- ✅ **Gestión de Tareas**: Control detallado de tareas y subtareas asignadas.
- 🎨 **Diseño Moderno**: Interfaz limpia, responsiva y con micro-animaciones.

---

## 🛠️ Configuración e Instalación

### Requisitos Previos

- **Node.js**: Versión 18 o superior recomendada.
- **npm** o **yarn**: Gestor de paquetes.

### Pasos para iniciar el proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/intranet-frontend-jfr.git
   cd intranet-frontend-jfr
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno (Opcional por ahora):**
   Actualmente el proyecto utiliza una URL base por defecto en `src/api/clientApi.ts`. Se recomienda mover esto a un archivo `.env` en el futuro:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción utilizando TypeScript y Vite.
- `npm run lint`: Ejecuta ESLint para analizar el código y encontrar errores.
- `npm run preview`: Previsualiza la versión de producción localmente.

---

## 📂 Estructura del Proyecto

```text
src/
├── api/          # Configuración de Axios y servicios de API por módulo.
├── assets/       # Recursos estáticos (imágenes, fuentes, etc.).
├── components/   # Componentes reutilizables (Botones, Inputs, Modales).
├── hooks/        # Hooks personalizados de React.
├── interfaces/   # Definiciones de tipos e interfaces TypeScript.
├── lib/          # Utilidades y configuración de librerías externas.
├── pages/        # Componentes de página (Dashboard, Login, Users, etc.).
└── App.tsx       # Enrutamiento y estructura principal.
```

---

## 🛡️ Calidad de Código

El proyecto incluye una configuración estricta de **ESLint** y **TypeScript** para asegurar que el código siga las mejores prácticas y sea fácil de mantener.

---

## 📄 Licencia

Este proyecto es de uso privado para JFR.
