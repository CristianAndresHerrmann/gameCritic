// Estado de la aplicación
let games = [];
let editingGameId = null;

// URLs de la API
const API_BASE_URL = '/games';

// Elementos del DOM
const gameForm = document.getElementById('game-form');
const gamesGrid = document.getElementById('games-grid');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    gameForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    refreshBtn.addEventListener('click', loadGames);
    confirmNo.addEventListener('click', hideConfirmModal);
}

// Cargar videojuegos desde la API
async function loadGames() {
    try {
        showLoading();
        hideError();
        
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        
        if (result.success) {
            games = result.data;
            renderGames();
        } else {
            throw new Error(result.error || 'Error cargando videojuegos');
        }
    } catch (error) {
        console.error('Error cargando videojuegos:', error);
        showError('Error cargando videojuegos: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Mostrar videojuegos en la interfaz
function renderGames() {
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No hay videojuegos registrados</h3>
                <p>Agrega tu primer videojuego usando el formulario de arriba</p>
            </div>
        `;
        return;
    }

    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card" data-id="${game.id}">
            <div class="game-title">${escapeHtml(game.title)}</div>
            
            <div class="game-info">
                <div class="game-info-item">
                    <span class="game-info-label">Género</span>
                    <span class="game-info-value">${escapeHtml(game.genre)}</span>
                </div>
                <div class="game-info-item">
                    <span class="game-info-label">Plataforma</span>
                    <span class="game-info-value">${escapeHtml(game.platform)}</span>
                </div>
                <div class="game-info-item">
                    <span class="game-info-label">Año</span>
                    <span class="game-info-value">${game.releaseYear}</span>
                </div>
                <div class="game-info-item">
                    <span class="game-info-label">Calificación</span>
                    <span class="game-info-value">
                        <div class="game-rating">
                            <span class="rating-stars">${getStarRating(game.rating)}</span>
                            <span>${game.rating || 'N/A'}</span>
                        </div>
                    </span>
                </div>
            </div>
            
            ${game.description ? `
                <div class="game-description">
                    ${escapeHtml(game.description)}
                </div>
            ` : ''}
            
            <div class="game-actions">
                <button class="btn-edit" data-action="edit" data-id="${game.id}">
                    ✏️ Editar
                </button>
                <button class="btn-delete" data-action="delete" data-id="${game.id}" data-title="${escapeHtml(game.title)}">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to edit and delete buttons
    gamesGrid.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editGame(id);
        });
    });
    gamesGrid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const title = this.getAttribute('data-title');
            confirmDeleteGame(id, title);
        });
    });

    // Attach event listeners after rendering
    gamesGrid.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            editGame(id);
        });
    });
    gamesGrid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            const title = btn.getAttribute('data-title');
            confirmDeleteGame(id, title);
        });
    });
}

// Manejar envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(gameForm);
    const gameData = {
        title: formData.get('title').trim(),
        genre: formData.get('genre').trim(),
        platform: formData.get('platform').trim(),
        releaseYear: parseInt(formData.get('releaseYear')),
        rating: formData.get('rating') ? parseFloat(formData.get('rating')) : null,
        description: formData.get('description').trim()
    };

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = editingGameId ? 'Actualizando...' : 'Agregando...';
        
        let response;
        if (editingGameId) {
            // Actualizar videojuego existente
            response = await fetch(`${API_BASE_URL}/${editingGameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });
        } else {
            // Crear nuevo videojuego
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });
        }

        const result = await response.json();
        
        if (result.success) {
            showSuccess(result.message);
            resetForm();
            loadGames();
        } else {
            throw new Error(result.details ? result.details.join(', ') : result.error);
        }
    } catch (error) {
        console.error('Error guardando videojuego:', error);
        showError('Error guardando videojuego: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = editingGameId ? 'Actualizar Videojuego' : 'Agregar Videojuego';
    }
}

// Editar videojuego
function editGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    editingGameId = gameId;
    
    // Llenar el formulario con los datos del videojuego
    document.getElementById('title').value = game.title;
    document.getElementById('genre').value = game.genre;
    document.getElementById('platform').value = game.platform;
    document.getElementById('releaseYear').value = game.releaseYear;
    document.getElementById('rating').value = game.rating || '';
    document.getElementById('description').value = game.description || '';

    // Cambiar la interfaz a modo edición
    formTitle.textContent = 'Editar Videojuego';
    submitBtn.textContent = 'Actualizar Videojuego';
    cancelBtn.style.display = 'inline-block';

    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición
function cancelEdit() {
    resetForm();
}

// Resetear formulario
function resetForm() {
    editingGameId = null;
    gameForm.reset();
    formTitle.textContent = 'Agregar Videojuego';
    submitBtn.textContent = 'Agregar Videojuego';
    cancelBtn.style.display = 'none';
}

// Confirmar eliminación de videojuego
function confirmDeleteGame(gameId, gameTitle) {
    confirmMessage.textContent = `¿Estás seguro de que quieres eliminar "${gameTitle}"?`;
    confirmYes.onclick = () => deleteGame(gameId);
    showConfirmModal();
}

// Eliminar videojuego
async function deleteGame(gameId) {
    try {
        hideConfirmModal();
        
        const response = await fetch(`${API_BASE_URL}/${gameId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        
        if (result.success) {
            showSuccess(result.message);
            loadGames();
            
            // Si estamos editando el videojuego que se eliminó, cancelar la edición
            if (editingGameId === gameId) {
                resetForm();
            }
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error eliminando videojuego:', error);
        showError('Error eliminando videojuego: ' + error.message);
    }
}

// Funciones de utilidad para la interfaz
function showLoading() {
    loadingElement.style.display = 'block';
    gamesGrid.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
    gamesGrid.style.display = 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showSuccess(message) {
    // Crear elemento de éxito temporal
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(successDiv, gameForm);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showConfirmModal() {
    confirmModal.style.display = 'flex';
}

function hideConfirmModal() {
    confirmModal.style.display = 'none';
}

// Funciones de utilidad
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStarRating(rating) {
    if (!rating) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(rating / 2);
    const halfStar = (rating % 2) >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
}

// Cerrar modal al hacer clic fuera de él
confirmModal.addEventListener('click', (event) => {
    if (event.target === confirmModal) {
        hideConfirmModal();
    }
});
