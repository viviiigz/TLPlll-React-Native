
# Project Title

A brief description of what this project does and who it's for

#  Catálogo de Maquillaje - Trabajo Práctico Nro 2

##  Introducción
Este proyecto es una aplicación web full-stack desarrollada para la gestión de un catálogo de productos de maquillaje. La plataforma permite a los usuarios visualizar una lista de productos disponibles, agregar nuevos artículos, actualizar sus precios y eliminar productos del catálogo, operando bajo una arquitectura cliente-servidor.

## Objetivo de la Actividad
El objetivo principal de este trabajo práctico es demostrar la comprensión técnica del flujo de datos entre un frontend desarrollado en React y un backend en Node.js. 

Para lograr esto, se implementaron los siguientes requerimientos técnicos:
- Creación de una API RESTful propia (métodos GET, POST, PUT, DELETE).
- Consumo de la API desde el cliente utilizando `fetch` y promesas (`async/await`).
- Implementación de Hooks de React (`useState` y `useEffect`) para el manejo del ciclo de vida y el estado de la aplicación.
- Modularización del código a través de componentes funcionales y la creación de un Custom Hook (`useMaquillajes`) para abstraer la lógica de negocio.
- Manejo de estados de carga (loading) y visualización de errores.
- Diseño de interfaz responsiva y estilizada utilizando Tailwind CSS.

##  Tecnologías Utilizadas
**Frontend:**
- React.js (Vite)
- Tailwind CSS (v3)
- Custom Hooks
- Bootstrap Icons & Google Fonts (Poppins)

**Backend:**
- Node.js
- Express.js
- CORS
- Estructura de datos en memoria para almacenamiento temporal.

##  Estructura del Proyecto
El proyecto está dividido en dos directorios principales, manteniendo una separación limpia de responsabilidades:

```text
/ (Raíz del proyecto)
├── /backend/               # Servidor Express.js y lógica de la API
│   ├── index.js            # Endpoints (CRUD) y configuración del servidor
│   └── package.json
│
└── /frontend/              # Aplicación cliente React
    ├── /src/
    │   ├── /components/    # Componentes modulares (Formulario, Lista, Item)
    │   ├── /hooks/         # Lógica separada (useMaquillajes.js)
    │   ├── App.jsx         # Componente orquestador principal
    │   └── App.css         # Configuración base de Tailwind y variables
    ├── tailwind.config.js
    └── package.json


 Cómo ejecutar el proyecto localmente
Para que la aplicación funcione correctamente, es necesario levantar ambos entornos en dos terminales separadas.

1. Iniciar el Servidor (Backend)
Abrir una terminal, navegar a la carpeta backend y ejecutar:

Bash
cd backend
npm install
npm run dev
(El servidor quedará escuchando en http://localhost:3000)

2. Iniciar el Cliente (Frontend)
Abrir una segunda terminal, navegar a la carpeta frontend y ejecutar:

Bash
cd frontend
npm install
npm run dev

 Funcionalidades Principales (CRUD)
Create: Formulario integrado para agregar nuevas bases, labiales o máscaras indicando nombre, marca, categoría y precio.

Read: Renderizado dinámico de la lista de productos almacenados en el servidor, incluyendo un estado visual de "Cargando..." mientras se espera la respuesta de la API. Incorpora un buscador en tiempo real.

Update: Interfaz in-line que permite habilitar un modo edición en cada tarjeta de producto para actualizar los detalles o el precio y guardarlos en el servidor.

Delete: Botón de acción rápida para eliminar permanentemente un producto del catálogo.

Viviana Gonzalez