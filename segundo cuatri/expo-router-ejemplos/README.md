# Rutas con Expo Router

App de ejemplo para la clase de **Expo Router** del Taller Complementario · React Native II
(Tecnicatura Superior en Desarrollo de Software Multiplataforma · Instituto Politécnico Formosa).

- Expo **SDK 57** · React Native 0.86 · expo-router 57
- Funciona en **Expo Go** (Android e iOS) y en web.
- Cada archivo de `src/app` tiene un comentario arriba que explica qué concepto muestra.

## Cómo correrla con Podman (sin instalar Node ni npm)

Desde la carpeta `app-rutas-expo`:

```bash
# 1. Construir la imagen (solo la primera vez o si cambia package.json)
podman build -t app-rutas-expo .

# 2. Levantar Expo
podman run -it --rm --network host \
  -v "$PWD":/app:Z \
  -v app-rutas-expo-node_modules:/app/node_modules \
  app-rutas-expo
```

Aparece el QR en la terminal: escanealo con Expo Go (en iPhone, con la cámara). Los cambios
que guardes en `src/` se recargan solos. Para cortar: `Ctrl+C`.

- **El celular no conecta:** tienen que estar en la misma red Wi-Fi y el puerto `8081/tcp`
  abierto en el firewall de la PC. Si la red no deja (pasa en redes de institutos), usá el
  túnel agregando el comando al final:
  `podman run ... app-rutas-expo npx expo start --tunnel`
- **Instalar un paquete nuevo:** `podman run -it --rm -v "$PWD":/app:Z -v app-rutas-expo-node_modules:/app/node_modules app-rutas-expo npx expo install expo-haptics`
- **Verlo en el navegador:** con Expo corriendo, apretá `w` o abrí http://localhost:8081

### Con compose

Si tenés `podman compose` (podman-compose o docker-compose instalado):

```bash
podman compose build
podman compose run --rm expo                          # levantar
podman compose run --rm expo npx expo start --tunnel  # con túnel
```

> `--network host` funciona en Linux. En Windows o macOS (podman machine) usá
> `-p 8081:8081 -e REACT_NATIVE_PACKAGER_HOSTNAME=<IP de tu PC>` en lugar de `--network host`.

## Cómo correrla con Node instalado

```bash
npm install
npx expo start
```

Para instalar paquetes nuevos usá siempre `npx expo install <paquete>`, así la versión coincide
con la de Expo Go.

## Mapa de rutas

```
src/app/
├── _layout.tsx                 Stack raíz + providers + Stack.Protected
├── +not-found.tsx              404
├── (tabs)/                     Grupo: no aparece en la URL
│   ├── _layout.tsx             Tabs (expo-router/js-tabs)
│   ├── index.tsx               /                 Inicio con todos los ejemplos
│   ├── perfil.tsx              /perfil           Iniciar / cerrar sesión
│   └── productos/
│       ├── _layout.tsx         Stack anidado dentro de la tab
│       ├── index.tsx           /productos        Lista (Link con href objeto)
│       └── [id].tsx            /productos/3      Ruta dinámica, push vs replace, dismissTo
├── pila/[nivel].tsx            /pila/1           La pila de navegación dibujada en vivo
├── estructuras.tsx             /estructuras      Pila (LIFO) vs cola (FIFO) animadas
├── buscar.tsx                  /buscar?q=mate    Query params + router.setParams
├── docs/[...slug].tsx          /docs/a/b/c       Catch-all
├── modal.tsx                   /modal            presentation: 'modal'
├── hoja.tsx                    /hoja             presentation: 'formSheet'
├── menu/                       /menu             Drawer (menú lateral)
├── login.tsx                   /login            Protegida con guard={!conSesion}
├── privado/                    /privado          Protegida con guard={conSesion}
└── ruta-vieja.tsx              /ruta-vieja       <Redirect href="/productos" />
```

Fuera de `src/app` están los componentes (`src/components`), el contexto de sesión
(`src/context/auth.tsx`), los datos (`src/data/productos.ts`) y los colores
(`src/constants/theme.ts`).

## Scripts

| Comando             | Qué hace                                   |
| ------------------- | ------------------------------------------ |
| `npm start`         | Inicia el servidor de desarrollo           |
| `npm run web`       | Abre la app en el navegador                |
| `npm run typecheck` | Revisa los tipos (incluye las rutas tipadas) |
