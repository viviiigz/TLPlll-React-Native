# Comedor IPF - TP Final

## 1. Árbol de Carpetas (`src/app`)

```text
├── 📁 .claude/
│   └── ⚙️ settings.json
├── 📁 assets/
│   └── 📁 images/
│       ├── 🖼️ android-icon-background.png
│       ├── 🖼️ android-icon-foreground.png
│       ├── 🖼️ android-icon-monochrome.png
│       ├── 🖼️ favicon.png
│       ├── 🖼️ icon.png
│       ├── 🖼️ partial-react-logo.png
│       ├── 🖼️ react-logo.png
│       ├── 🖼️ react-logo@2x.png
│       ├── 🖼️ react-logo@3x.png
│       └── 🖼️ splash-icon.png
├── 📁 constants/
│   └── 📄 theme.ts
├── 📁 hooks/
│   ├── 📄 use-color-scheme.ts
│   ├── 📄 use-color-scheme.web.ts
│   └── 📄 use-theme-color.ts
├── 📁 scripts/
│   └── 📄 reset-project.js
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (tabs)/
│   │   │   ├── 📁 carrito/
│   │   │   │   ├── 📄 _layout.tsx
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   └── 📄 nota.tsx
│   │   │   ├── 📁 menu/
│   │   │   │   ├── 📄 [id].tsx
│   │   │   │   ├── 📄 _layout.tsx
│   │   │   │   └── 📄 index.tsx
│   │   │   ├── 📄 _layout.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 ayuda/
│   │   │   ├── 📄 [...slug].tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 categorias/
│   │   │   └── 📄 [categoria].tsx
│   │   ├── 📁 cocina/
│   │   │   ├── 📄 _layout.tsx
│   │   │   ├── 📄 atendidos.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 turno/
│   │   │   └── 📄 [numero].tsx
│   │   ├── 📄 +not-found.tsx
│   │   ├── 📄 _layout.tsx
│   │   ├── 📄 buscar.tsx
│   │   ├── 📄 confirmar.tsx
│   │   ├── 📄 login.tsx
│   │   └── 📄 pedido.tsx
│   ├── 📁 components/
│   │   ├── 📄 Cargando.tsx
│   │   └── 📄 DondeEstoy.tsx
│   ├── 📁 context/
│   │   └── 📄 AppContext.tsx
│   ├── 📁 data/
│   │   └── 📄 platos.ts
│   └── 📁 estructuras/
│       ├── 📄 Cola.ts
│       └── 📄 Pila.ts
├── ⚙️ .gitignore
├── 📝 AGENTS.md
├── 📝 CLAUDE.md
├── 📝 README.md
├── 📝 RESPUESTAS.md
├── ⚙️ app.json
├── 📄 eslint.config.js
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json

```


## 2. Tipos de Navegadores (`_layout`)
* **`src/app/_layout.tsx`**: Utiliza un navegador **`Stack`** para gestionar la jerarquía global, modales (`login`, `confirmar`) y las rutas protegidas condicionalmente.
* **`src/app/(tabs)/_layout.tsx`**: Utiliza un navegador **`Tabs`** para la botonera inferior principal de la aplicación.
* **`src/app/cocina/_layout.tsx`**: Utiliza un navegador **`Drawer`** para el menú lateral desplegable exclusivo del área de empleados.

## 3. Justificación de Navegación (replace vs push)
Para la transición de la pantalla de confirmación (`/confirmar`) hacia la pantalla del turno (`/turno/[numero]`), se utilizó el método `router.replace()` en lugar de `router.push()`. 
La elección de `replace` es fundamental porque destruye la pantalla anterior en el historial del Stack. De esta forma, se garantiza que si el usuario presiona el botón físico de "Atrás" en su dispositivo, no pueda volver a la pantalla de confirmación (evitando que envíe el mismo pedido por duplicado por error), llevándolo directamente al menú principal.

## 4. Deep Link de Prueba


```bash
npx uri-scheme open comedoripf://menu/1 --android

npx uri-scheme open comedoripf://menu/1 --ios

```