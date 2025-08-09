# Game Critic API

API REST para gestionar videojuegos con interfaz frontend de ejemplo.

## Características

- **API REST completa**: CRUD para videojuegos
- **Base de datos MySQL**: Persistencia de datos
- **Frontend básico**: Interfaz para interactuar con la API
- **Tests nativos**: Testing con Node.js test runner nativo

## Estructura del proyecto

```
├── src/
│   ├── server.js          # Servidor Express principal
│   ├── database/
│   │   ├── connection.js  # Conexión a MySQL
│   │   └── schema.sql     # Esquema de la base de datos
│   ├── routes/
│   │   └── games.js       # Rutas de videojuegos
│   ├── controllers/
│   │   └── gamesController.js  # Lógica de negocio
│   └── models/
│       └── Game.js        # Modelo de videojuego
├── public/
│   ├── index.html         # Frontend
│   ├── style.css          # Estilos
│   └── script.js          # JavaScript del frontend
├── tests/
│   └── games.test.js      # Tests de la API
└── README.md
```

## Configuración de variables de entorno

1. Copia el archivo `.env.example` a `.env`
2. Configura las variables según tu entorno local:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=game_critic
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# Configuración de CORS
CORS_ORIGIN=*
```

## Configuración de la base de datos

1. Crear una base de datos MySQL llamada `game_critic`
2. Ejecutar el script `src/database/schema.sql`
3. Las credenciales se configuran a través de variables de entorno

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Modo desarrollo (con watch)
npm run dev

# Modo producción
npm start

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch
```

## API Endpoints

- `GET /games` - Obtener todos los videojuegos
- `GET /games/:id` - Obtener un videojuego por ID
- `POST /games` - Crear un nuevo videojuego
- `PUT /games/:id` - Actualizar un videojuego
- `DELETE /games/:id` - Eliminar un videojuego

## Modelo de datos

```json
{
  "id": 1,
  "title": "The Legend of Zelda: Breath of the Wild",
  "genre": "Adventure",
  "platform": "Nintendo Switch",
  "releaseYear": 2017,
  "rating": 9.5,
  "description": "Juego de aventuras en mundo abierto"
}
```

## Frontend

Accede a `http://localhost:3000` para usar la interfaz web que permite:
- Ver lista de videojuegos
- Agregar nuevos videojuegos
- Editar videojuegos existentes
- Eliminar videojuegos
