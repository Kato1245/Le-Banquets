# Le Banquets - Gestión de Eventos y Banquetes

Bienvenido a **Le Banquets**, una plataforma integral para la organización y gestión de eventos sociales y corporativos.

## 🏗️ Estructura del Proyecto (Arquitectura Basada en Características)

El proyecto ha sido organizado siguiendo una arquitectura basada en features, lo que facilita la escalabilidad y el mantenimiento al agrupar la lógica por funcionalidades de negocio.

```text
Le-Banquets/
├── apis/                       # Servicios Backend y controladores de API
├── src/                        # Código fuente del Frontend
│   ├── context/                # Contextos globales de React
│   │   └── AuthContext.jsx     # Gestión de estado de autenticación
│   ├── features/               # Módulos basados en características (Features)
│   │   ├── admin/              # Panel de Administración
│   │   │   ├── components/     # Componentes específicos de admin
│   │   │   └── pages/          # Admin, AdminDashboard, Configuracion
│   │   ├── auth/               # Autenticación y Autorización
│   │   │   ├── components/     # LoginForm, RegistroForm, RegistroPropietarioForm
│   │   │   └── pages/          # Login, Registro, ForgotPassword, ResetPassword
│   │   ├── banquetes/          # Gestión de Salones y Banquetes
│   │   │   ├── components/     # Componentes de filtrado y listado
│   │   │   └── pages/          # Salones, Catering, MisBanquetes
│   │   ├── home/               # Página de Inicio y Landing
│   │   │   ├── components/     # BusquedaFiltros, Carrusel
│   │   │   └── pages/          # Home.jsx
│   │   └── perfil/             # Perfil de Usuario y Eventos
│   │       ├── components/     # Componentes de gestión de perfil
│   │       └── pages/          # Perfil, Eventos, MisEventos
│   ├── shared/                 # Recursos compartidos y UI común
│   │   └── components/         # Navbar, ProtectedRoute, TokenValidator
│   ├── App.jsx                 # Configuración de rutas principal
│   ├── main.jsx                # Punto de entrada de la aplicación
│   └── index.css               # Estilos globales y Tailwind/Vite CSS
├── package.json                # Dependencias y scripts del proyecto
├── vite.config.js              # Configuración de Vite
└── README.md                   # Documentación actual del proyecto
```

## 🚀 Tecnologías Utilizadas

*   **Frontend:** React, Vite, TailwindCSS / DaisyUI.
*   **Routing:** React Router DOM.
*   **Estado Global:** React Context API.
*   **Notificaciones:** React Hot Toast.
*   **Backend:** Node.js (Servicios en `/apis`).

## 🛠️ Cómo Iniciar

1.  dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
3.  Asegúrate de que los servicios de la API en `/apis` estén en ejecución.

---
*Desarrollado para Le Banquets - Tu evento, nuestra pasión.*
