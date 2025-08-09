import { executeQuery } from '../database/connection.js';

const MIN_RELEASE_YEAR = 1970;
const MAX_RELEASE_YEAR = new Date().getFullYear() + 5;

export class Game {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.genre = data.genre;
    this.platform = data.platform;
    this.releaseYear = data.release_year || data.releaseYear;
    this.rating = data.rating;
    this.description = data.description;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  // Obtener todos los videojuegos
  static async getAll() {
    const query = 'SELECT * FROM games ORDER BY created_at DESC';
    const results = await executeQuery(query);
    return results.map(game => new Game(game));
  }

  // Obtener videojuego por ID
  static async getById(id) {
    const query = 'SELECT * FROM games WHERE id = ?';
    const results = await executeQuery(query, [id]);
    if (results.length === 0) {
      return null;
    }
    return new Game(results[0]);
  }

  // Crear nuevo videojuego
  static async create(gameData) {
    const { title, genre, platform, releaseYear, rating, description } = gameData;
    const query = `
      INSERT INTO games (title, genre, platform, release_year, rating, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [title, genre, platform, releaseYear, rating, description]);
    return this.getById(result.insertId);
  }

  // Actualizar videojuego
  static async update(id, gameData) {
    const { title, genre, platform, releaseYear, rating, description } = gameData;
    const query = `
      UPDATE games 
      SET title = ?, genre = ?, platform = ?, release_year = ?, rating = ?, description = ?
      WHERE id = ?
    `;
    await executeQuery(query, [title, genre, platform, releaseYear, rating, description, id]);
    return this.getById(id);
  }

  // Eliminar videojuego
  static async delete(id) {
    const query = 'DELETE FROM games WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Validar datos del videojuego
  static validate(gameData) {
    const errors = [];
    
    if (!gameData.title || gameData.title.trim().length === 0) {
      errors.push('El título es requerido');
    }
    
    if (!gameData.genre || gameData.genre.trim().length === 0) {
      errors.push('El género es requerido');
    }
    
    if (!gameData.platform || gameData.platform.trim().length === 0) {
      errors.push('La plataforma es requerida');
    }
    
    if (
      !gameData.releaseYear ||
      gameData.releaseYear < MIN_RELEASE_YEAR ||
      gameData.releaseYear > MAX_RELEASE_YEAR
    ) {
      errors.push('El año de lanzamiento debe ser válido');
    }
    
    if (gameData.rating !== undefined && (gameData.rating < 0 || gameData.rating > 10)) {
      errors.push('La calificación debe estar entre 0 y 10');
    }
    
    return errors;
  }

  // Convertir a objeto JSON para respuesta
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      genre: this.genre,
      platform: this.platform,
      releaseYear: this.releaseYear,
      rating: this.rating,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
