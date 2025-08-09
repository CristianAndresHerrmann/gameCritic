import express from 'express';
import { gamesController } from '../controllers/gamesController.js';

const router = express.Router();

// GET /games - Obtener todos los videojuegos
router.get('/', gamesController.getAllGames);

// GET /games/:id - Obtener videojuego por ID
router.get('/:id', gamesController.getGameById);

// POST /games - Crear nuevo videojuego
router.post('/', gamesController.createGame);

// PUT /games/:id - Actualizar videojuego
router.put('/:id', gamesController.updateGame);

// DELETE /games/:id - Eliminar videojuego
router.delete('/:id', gamesController.deleteGame);

export default router;
