-- Crear base de datos
CREATE DATABASE IF NOT EXISTS game_critic;
USE game_critic;

-- Tabla de videojuegos
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    release_year INT NOT NULL,
    rating DECIMAL(3,1) DEFAULT 0.0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO games (title, genre, platform, release_year, rating, description) VALUES
('The Legend of Zelda: Breath of the Wild', 'Adventure', 'Nintendo Switch', 2017, 9.5, 'Juego de aventuras en mundo abierto con mecánicas innovadoras'),
('God of War', 'Action', 'PlayStation 4', 2018, 9.0, 'Aventura épica de acción con elementos de mitología nórdica'),
('Cyberpunk 2077', 'RPG', 'PC', 2020, 7.5, 'RPG futurista en mundo abierto ambientado en Night City'),
('Super Mario Odyssey', 'Platformer', 'Nintendo Switch', 2017, 9.2, 'Plataformas 3D con mecánicas de posesión únicas'),
('The Witcher 3: Wild Hunt', 'RPG', 'PC', 2015, 9.3, 'RPG de mundo abierto con narrativa excepcional');
