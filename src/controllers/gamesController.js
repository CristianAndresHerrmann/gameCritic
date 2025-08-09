import { Game } from '../models/Game.js';

export const gamesController = {
  // GET /games - Obtener todos los videojuegos
  async getAllGames(req, res) {
    try {
      const games = await Game.getAll();
      res.json({
        success: true,
        data: games.map(game => game.toJSON()),
        count: games.length
      });
    } catch (error) {
      console.error('Error obteniendo videojuegos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // GET /games/:id - Obtener videojuego por ID
  async getGameById(req, res) {
    try {
      const { id } = req.params;
      const game = await Game.getById(id);
      
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Videojuego no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: game.toJSON()
      });
    } catch (error) {
      console.error('Error obteniendo videojuego:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // POST /games - Crear nuevo videojuego
  async createGame(req, res) {
    try {
      const gameData = req.body;
      
      // Validar datos
      const validationErrors = Game.validate(gameData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: validationErrors
        });
      }
      
      const newGame = await Game.create(gameData);
      res.status(201).json({
        success: true,
        data: newGame.toJSON(),
        message: 'Videojuego creado exitosamente'
      });
    } catch (error) {
      console.error('Error creando videojuego:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // PUT /games/:id - Actualizar videojuego
  async updateGame(req, res) {
    try {
      const { id } = req.params;
      const gameData = req.body;
      
      // Verificar si el videojuego existe
      const existingGame = await Game.getById(id);
      if (!existingGame) {
        return res.status(404).json({
          success: false,
          error: 'Videojuego no encontrado'
        });
      }
      
      // Validar datos
      const validationErrors = Game.validate(gameData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: validationErrors
        });
      }
      
      const updatedGame = await Game.update(id, gameData);
      res.json({
        success: true,
        data: updatedGame.toJSON(),
        message: 'Videojuego actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando videojuego:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  // DELETE /games/:id - Eliminar videojuego
  async deleteGame(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar si el videojuego existe
      const existingGame = await Game.getById(id);
      if (!existingGame) {
        return res.status(404).json({
          success: false,
          error: 'Videojuego no encontrado'
        });
      }
      
      const deleted = await Game.delete(id);
      if (deleted) {
        res.json({
          success: true,
          message: 'Videojuego eliminado exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error eliminando videojuego'
        });
      }
    } catch (error) {
      console.error('Error eliminando videojuego:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};
