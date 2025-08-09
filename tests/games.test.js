import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// Configuración de pruebas
const API_BASE_URL = 'http://localhost:3000';
let server;
let testGameId;

// Función auxiliar para hacer peticiones HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, body: parsedBody });
        } catch (error) {
          resolve({ statusCode: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Datos de prueba
const testGame = {
  title: 'Test Game',
  genre: 'Test Genre',
  platform: 'Test Platform',
  releaseYear: 2023,
  rating: 8.5,
  description: 'Un videojuego de prueba'
};

const updatedGame = {
  title: 'Updated Test Game',
  genre: 'Updated Genre',
  platform: 'Updated Platform',
  releaseYear: 2024,
  rating: 9.0,
  description: 'Un videojuego de prueba actualizado'
};

describe('Games API Tests', () => {
  before(async () => {
    // Esperar a que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('🧪 Iniciando tests de la API...');
  });

  after(() => {
    console.log('✅ Tests completados');
  });

  test('GET /games - Debería obtener la lista de videojuegos', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.success, true);
    assert(Array.isArray(response.body.data));
    assert(typeof response.body.count === 'number');
  });

  test('POST /games - Debería crear un nuevo videojuego', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testGame))
      }
    };

    const response = await makeRequest(options, testGame);
    
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.title, testGame.title);
    assert.strictEqual(response.body.data.genre, testGame.genre);
    assert.strictEqual(response.body.data.platform, testGame.platform);
    assert.strictEqual(response.body.data.releaseYear, testGame.releaseYear);
    assert.strictEqual(response.body.data.rating, testGame.rating);
    assert.strictEqual(response.body.data.description, testGame.description);
    
    // Guardar ID para pruebas posteriores
    testGameId = response.body.data.id;
    assert(typeof testGameId === 'number');
  });

  test('POST /games - Debería fallar con datos inválidos', async () => {
    const invalidGame = {
      title: '', // Título vacío
      genre: 'Test Genre',
      platform: 'Test Platform',
      releaseYear: 1960, // Año inválido
      rating: 15 // Calificación fuera de rango
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(invalidGame))
      }
    };

    const response = await makeRequest(options, invalidGame);
    
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.success, false);
    assert(Array.isArray(response.body.details));
    assert(response.body.details.length > 0);
  });

  test('GET /games/:id - Debería obtener un videojuego específico', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/games/${testGameId}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.id, testGameId);
    assert.strictEqual(response.body.data.title, testGame.title);
  });

  test('GET /games/:id - Debería retornar 404 para ID inexistente', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games/99999',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.success, false);
  });

  test('PUT /games/:id - Debería actualizar un videojuego existente', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/games/${testGameId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(updatedGame))
      }
    };

    const response = await makeRequest(options, updatedGame);
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.id, testGameId);
    assert.strictEqual(response.body.data.title, updatedGame.title);
    assert.strictEqual(response.body.data.genre, updatedGame.genre);
    assert.strictEqual(response.body.data.platform, updatedGame.platform);
    assert.strictEqual(response.body.data.releaseYear, updatedGame.releaseYear);
    assert.strictEqual(response.body.data.rating, updatedGame.rating);
    assert.strictEqual(response.body.data.description, updatedGame.description);
  });

  test('PUT /games/:id - Debería fallar al actualizar con datos inválidos', async () => {
    const invalidUpdate = {
      title: '', // Título vacío
      genre: 'Updated Genre',
      platform: 'Updated Platform',
      releaseYear: 'invalid', // Tipo incorrecto
      rating: -5 // Valor inválido
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/games/${testGameId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(invalidUpdate))
      }
    };

    const response = await makeRequest(options, invalidUpdate);
    
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.success, false);
  });

  test('PUT /games/:id - Debería retornar 404 para ID inexistente', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games/99999',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(updatedGame))
      }
    };

    const response = await makeRequest(options, updatedGame);
    
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.success, false);
  });

  test('DELETE /games/:id - Debería eliminar un videojuego existente', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/games/${testGameId}`,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.success, true);
    assert(response.body.message.includes('eliminado'));
  });

  test('DELETE /games/:id - Debería retornar 404 para ID inexistente', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games/99999',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.success, false);
  });

  test('Verificar que el videojuego fue eliminado', async () => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/games/${testGameId}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await makeRequest(options);
    
    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.success, false);
  });

  test('Verificar validaciones de campos requeridos', async () => {
    const incompleteGame = {
      title: 'Test Game'
      // Faltan campos requeridos
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(incompleteGame))
      }
    };

    const response = await makeRequest(options, incompleteGame);
    
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.success, false);
    assert(response.body.details.length > 0);
  });

  test('Verificar límites de calificación', async () => {
    const gameWithInvalidRating = {
      ...testGame,
      rating: 15 // Fuera del rango 0-10
    };

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/games',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(gameWithInvalidRating))
      }
    };

    const response = await makeRequest(options, gameWithInvalidRating);
    
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.body.success, false);
    assert(response.body.details.some(detail => 
      detail.includes('calificación') || detail.includes('rating')
    ));
  });
});
