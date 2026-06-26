# 🎮 GameVault

Plataforma de biblioteca personal de videojuegos con guías colaborativas potenciadas por IA.

## Equipo

| Integrante | Rama Git | Responsabilidad |
|---|---|---|
| Diego | `feature/apis` | IGDB, CheapShark, Claude AI, Twitch OAuth |
| Andrés | `feature/backend` | Node.js, Express, REST API, JWT Auth |
| Vinicio | `feature/frontend` | HTML/CSS/JS, vistas, diseño |
| Ricardo | `feature/database` | PostgreSQL, esquema, Docker volumen |

---

## 🐳 ¿Qué es Docker y para qué lo usamos?

Si alguna vez le pasaste un proyecto a alguien y te dijeron "en mi computadora no funciona", Docker resuelve exactamente ese problema.

**Docker es una herramienta que empaqueta tu aplicación junto con todo lo que necesita para correr** (Node.js, PostgreSQL, la versión exacta de cada librería) dentro de algo llamado **contenedor**. Un contenedor es como una cajita sellada que funciona igual en cualquier computadora, sin importar si es Windows, Mac o Linux.

### La analogía

Imagina que tu proyecto es una receta de cocina. Sin Docker, le mandas la receta a tu compañero pero él no tiene los mismos ingredientes, ni la misma estufa, ni el mismo horno. El platillo le sale diferente o de plano no le sale.

Con Docker, en lugar de mandar la receta, le mandas **la comida ya hecha y sellada al vacío**. Él solo la calienta y listo, sabe exactamente igual.

### ¿Qué hay en nuestro proyecto?

Nuestro proyecto tiene **3 contenedores** que corren juntos:

```
┌─────────────────────────────────────────────────┐
│                 docker-compose                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │FRONTEND  │  │ BACKEND  │  │   BASE DE    │  │
│  │  Nginx   │  │ Node.js  │  │    DATOS     │  │
│  │ puerto 80│  │puerto3000│  │ PostgreSQL   │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
          Un solo comando los levanta a todos
```

- **Frontend** — Nginx sirve el HTML/CSS/JS de Vinicio
- **Backend** — Node.js corre el servidor de Andrés con los servicios de Diego
- **Base de datos** — PostgreSQL con el esquema de Ricardo, los datos se guardan aunque apagues todo

El archivo `docker-compose.yml` en la raíz del proyecto es el que los conecta a todos.

---

## 🚀 Cómo levantar el proyecto (todos hacen esto)

### Paso 0 — Instalar Docker Desktop

Descárgalo aquí: https://www.docker.com/products/docker-desktop/

Es la única cosa que necesitan instalar. **No necesitan instalar Node.js, PostgreSQL, ni nada más.** Docker lo incluye todo.

Después de instalarlo, ábrelo y verifica que esté corriendo (aparece una ballena 🐳 en la barra de tareas).

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/gamevault.git
cd gamevault
```

### Paso 2 — Crear el archivo de credenciales

```bash
# En Mac/Linux:
cp .env.example .env

# En Windows (cmd):
copy .env.example .env
```

Luego abre el archivo `.env` y pide las credenciales a Diego (las API keys) y a Andrés (el JWT_SECRET). Sin esto no funcionan las APIs.

### Paso 3 — Levantar todo

```bash
docker-compose up --build
```

La primera vez tarda unos minutos porque descarga las imágenes base. Las siguientes veces es mucho más rápido.

Cuando veas esto en la terminal, ya está listo:

```
frontend_1  | /docker-entrypoint.sh: Configuration complete; ready for start up
backend_1   |  Backend corriendo en puerto 3000
db_1        |  database system is ready to accept connections
```

Abre el navegador en **http://localhost** y debería aparecer GameVault.

### Para apagar

```bash
# Ctrl+C en la terminal donde corre, o en otra terminal:
docker-compose down
```

Los datos de la base de datos **se conservan** aunque apagues. Solo se borran si corres `docker-compose down -v` (la `-v` borra los volúmenes).

---

##  ¿Qué hace cada quien con Docker?

### Diego — APIs (`feature/apis`)

Tu código vive en `backend/services/`. Docker lo empaqueta automáticamente junto con el backend de Andrés, no tienes que hacer nada especial con Docker.

Lo que sí debes hacer:
- Rellenar las variables de entorno en `.env` (las API keys de Twitch/IGDB y Anthropic)
- Cuando agregues una librería nueva: `npm install nombre-libreria` dentro de `backend/` y hacer commit del `package.json` actualizado. Docker la instalará sola al hacer `--build`.

```bash
# Si cambias algo en tus archivos, reinicia solo el backend:
docker-compose restart backend
```

### Andrés — Backend (`feature/backend`)

Tu código vive en `backend/routes/` y `backend/middleware/`. El `Dockerfile` del backend ya está hecho, no lo toques.

Cuando agregues librerías:
```bash
# Desde la carpeta backend/ en tu máquina (no dentro de Docker):
cd backend
npm install nombre-libreria
# Haz commit del package.json y luego:
docker-compose up --build backend
```

Si quieres ver los logs solo del backend:
```bash
docker-compose logs -f backend
```

### Vinicio — Frontend (`feature/frontend`)

Tu código vive en `frontend/`. El `Dockerfile` del frontend ya está hecho con Nginx, no lo toques.

Como es HTML/CSS/JS puro, puedes abrir los archivos directamente en el navegador mientras desarrollas. Cuando quieras probar con el backend de Andrés corriendo:

```bash
docker-compose up --build frontend
```

Si cambias un archivo HTML o CSS, Docker no lo recarga automático. Corre esto para que tome los cambios:
```bash
docker-compose restart frontend
```

### Ricardo — Base de Datos (`feature/database`)

Tu trabajo vive en `db/init.sql`. Este archivo se ejecuta **automáticamente** cuando Docker levanta la base de datos por primera vez.

**Importante:** Si ya corriste `docker-compose up` antes y quieres que tus cambios en `init.sql` se apliquen, tienes que borrar el volumen y volver a levantar:

```bash
docker-compose down -v        # borra los datos guardados
docker-compose up --build     # vuelve a correr init.sql desde cero
```

Para conectarte a la base de datos y ver los datos en tiempo real:
```bash
# Conectarte a PostgreSQL desde la terminal:
docker exec -it gamevault-db-1 psql -U gamevault -d gamevault

# Comandos útiles dentro de psql:
\dt                    -- ver todas las tablas
SELECT * FROM users;   -- ver usuarios
SELECT * FROM tips;    -- ver tips
\q                     -- salir
```

---

##  Comandos Docker útiles para todos

```bash
# Levantar todo (primera vez o después de cambios en Dockerfile)
docker-compose up --build

# Levantar todo sin reconstruir (más rápido si no cambiaste Dockerfiles)
docker-compose up

# Levantar solo un servicio
docker-compose up backend
docker-compose up frontend
docker-compose up db

# Ver logs de un servicio en tiempo real
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Reiniciar un servicio sin apagar los demás
docker-compose restart backend

# Ver qué contenedores están corriendo
docker ps

# Apagar todo (conserva los datos de la DB)
docker-compose down

# Apagar todo Y borrar los datos de la DB
docker-compose down -v
```

---

##  Flujo de trabajo Git

```bash
# Cada quien trabaja en su rama
git checkout feature/apis       # Diego
git checkout feature/backend    # Andrés
git checkout feature/frontend   # Vinicio
git checkout feature/database   # Ricardo

# Trabajar normalmente...
git add .
git commit -m "descripcion del cambio"
git push origin feature/tu-rama

# Cuando terminen una funcionalidad, abren un Pull Request en GitHub hacia main
```

**Regla de oro:** nunca hagan push directo a `main`. Siempre desde su rama con Pull Request para que el equipo pueda revisar.

---

##  Estructura del Proyecto

```
gamevault/
├── frontend/               → Vinicio
│   ├── css/styles.css
│   ├── js/
│   │   ├── api.js          → helper de fetch (no tocar)
│   │   ├── home.js
│   │   ├── search.js
│   │   ├── game.js
│   │   ├── library.js
│   │   ├── login.js
│   │   └── register.js
│   ├── pages/
│   │   ├── search.html
│   │   ├── game.html
│   │   ├── library.html
│   │   ├── login.html
│   │   └── register.html
│   ├── index.html
│   └── Dockerfile          → no tocar
│
├── backend/                → Andrés (rutas) + Diego (services)
│   ├── services/           → Diego
│   │   ├── twitchAuth.js
│   │   ├── igdbService.js
│   │   ├── cheapSharkService.js
│   │   └── aiTipsService.js
│   ├── routes/             → Andrés
│   │   ├── auth.js
│   │   ├── games.js
│   │   ├── library.js
│   │   ├── tips.js
│   │   └── ai.js
│   ├── middleware/         → Andrés
│   │   ├── auth.js
│   │   └── db.js
│   ├── index.js
│   ├── package.json
│   └── Dockerfile          → no tocar
│
├── db/                     → Ricardo
│   └── init.sql
│
├── docker-compose.yml      → no tocar
├── .env.example            → copiar a .env y rellenar
├── .env                    → NO subir a Git (está en .gitignore)
├── .gitignore
└── README.md
```

---

##  URLs del proyecto corriendo

| Qué | URL |
|---|---|
| La app (frontend) | http://localhost |
| La API (backend) | http://localhost:3000 |
| Health check | http://localhost:3000/health |
| PostgreSQL | localhost:5432 |

---

##  Problemas comunes

**"Port 80 is already in use"**
Tienes otro servidor corriendo en el puerto 80. Ciérralo o cambia el puerto del frontend en `docker-compose.yml` a `"8080:80"` y accede en http://localhost:8080.

**"Cannot connect to the Docker daemon"**
Docker Desktop no está abierto. Ábrelo y espera a que la ballena aparezca en la barra de tareas.

**Los cambios en init.sql no se aplican**
Corre `docker-compose down -v` y luego `docker-compose up --build`.

**"Module not found" en el backend**
Alguien agregó una librería sin hacer commit del `package.json`. Corre `docker-compose up --build backend`.
