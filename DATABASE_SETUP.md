# Configuración de la Base de Datos

## Prerequisitos

1. **MySQL instalado y ejecutándose**
   - Descargar desde [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
   - O usar XAMPP/WAMP que incluye MySQL

## Pasos de configuración

### 1. Crear la base de datos

Ejecutar el siguiente comando en la consola de MySQL:

```sql
CREATE DATABASE game_critic;
```

### 2. Crear las tablas

Ejecutar el archivo `src/database/schema.sql` completo:

```bash
mysql -u root -p game_critic < src/database/schema.sql
```

O copiar y pegar el contenido del archivo en MySQL Workbench o phpMyAdmin.

### 3. Configurar credenciales

Editar el archivo `src/database/connection.js` y cambiar estas líneas según tu configuración:

```javascript
const dbConfig = {
  host: 'localhost',      // Tu host de MySQL
  user: 'root',           // Tu usuario de MySQL
  password: '',           // Tu contraseña de MySQL
  database: 'game_critic' // Nombre de la base de datos
};
```

### 4. Verificar conexión

Al ejecutar `npm run dev` o `npm start`, deberías ver:

```
✅ Conexión a MySQL establecida correctamente
🚀 Servidor ejecutándose en http://localhost:3000
```

## Troubleshooting

### Error: "Access denied for user"
- Verificar usuario y contraseña en `connection.js`
- Asegurarse de que el usuario tenga permisos en la base de datos

### Error: "Database 'game_critic' doesn't exist"
- Crear la base de datos: `CREATE DATABASE game_critic;`

### Error: "Table 'games' doesn't exist"
- Ejecutar el script `schema.sql`

### Error: "connect ECONNREFUSED"
- Verificar que MySQL esté ejecutándose
- Verificar el puerto (por defecto 3306)

## Datos de ejemplo

El script `schema.sql` incluye datos de ejemplo. Si quieres empezar con la base de datos vacía, comenta o elimina las líneas `INSERT INTO` del archivo.
