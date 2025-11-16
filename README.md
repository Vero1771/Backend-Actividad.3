# Sistema de Gestión de Cine

Proyecto web (Express + EJS + MySQL) para gestionar un cine: películas, salas, funciones, tickets y ventas.

Resumen de características principales
- Autenticación con JSON Web Tokens (JWT) y contraseñas hasheadas con `bcrypt`.
- Roles: `admin`, `user` y `public`.
  - `admin`: acceso completo (CRUD) a las vistas y endpoints protegidos.
  - `user`: dashboard propio para ver funciones, comprar tickets y registrar ventas (no puede editar recursos administrativos).
  - `public`: vistas y endpoints públicos (página de bienvenida, ver últimas 5 funciones, registro/login).
- Gestión de salas con precio por asiento; precio se usa automáticamente al crear tickets.
- Vistas EJS para administración y para usuarios finales.

Estructura importante del proyecto
- `app.js` — punto de entrada (monta rutas y middlewares).
- `routes/` — rutas para `auth`, `public`, `movies`, `salas`, `funciones`, `ventas`, `tickets`, `user`, etc.
- `controllers/` — lógica de negocio para cada entidad.
- `models/` — acceso a la base de datos (usa `mysql2` y un pool en `db/connection.js`).
- `views/` — plantillas EJS (vistas para admin, user y públicas).
- `db/schema.sql` — esquema SQL para crear la base de datos y tablas.

Requisitos
- Node.js (>= 16 recomendado) y `npm`.
- MySQL (o MariaDB) para la base de datos.

Instalación y puesta en marcha (Windows / PowerShell)

1. Clonar el repositorio y entrar en el directorio:

```powershell
git clone <repo-url>
cd 'c:\Users\hlnmr\Documents\GitHub\backend\TAREA\Backend-Actividad.3'
```

2. Instalar dependencias:

```powershell
npm install
```

3. Crear la base de datos y tablas ejecutando el script SQL (usar tus credenciales):

```powershell
# desde un terminal MySQL (o usando cliente) o desde PowerShell si tienes mysql en PATH
# ejemplo con usuario root (te pedirá contraseña)
# IMPORTANTE: revisa 'db/schema.sql' antes de ejecutarlo
mysql -u root -p < db\schema.sql
```

Si no puedes ejecutar el `schema.sql` directamente, abre el archivo `db/schema.sql` en tu cliente MySQL y ejecútalo manualmente.

4. Crear el archivo de configuración de entorno `.env` en la raíz del proyecto (no se sube al repo):

Crear un archivo llamado `.env` con estas variables (ejemplo):

```
JWT_SECRET=un_secreto_fuerte_aqui
JWT_EXPIRES=8h
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=cine
PORT=3000
```

5. Iniciar la aplicación (modo desarrollo con `nodemon`):

```powershell
npm run dev
```

Acceder en el navegador a `http://localhost:3000/`.

Crear un usuario administrador
- Opción A (rápida, desde la BD): inserta un usuario en `usuarios` con `role='admin'` y un `password` hasheado con bcrypt.
  - Para generar el hash en tu máquina (Node):

```powershell
node -e "console.log(require('bcrypt').hashSync('TuPasswordAdmin', 10))"
```

  - Inserta en MySQL (ajusta email/hashed_password):

```sql
INSERT INTO usuarios (email, password, role) VALUES ('admin@example.com','$2b$10$...hashed...', 'admin');
```

- Opción B (uso del endpoint): registra un usuario mediante la vista pública `http://localhost:3000/auth/register` y luego cambia su rol a `admin` directamente en la tabla `usuarios`.

API y rutas principales
- Públicas (no requieren token):
  - `GET /` — Página pública de bienvenida.
  - `GET /movies/last5` — Ver últimas 5 películas/funciones.
  - `GET /auth/login` y `GET /auth/register` — vistas para autenticación.
  - `POST /auth/api/register` — API para registrar usuario.
  - `POST /auth/api/login` — API para login (devuelve `token`).

- Admin (requiere JWT con rol `admin`):
  - Vistas y endpoints CRUD para `movies`, `salas`, `funciones`, `metodos_pago`, `ventas`, `tickets`.
  - Dashboard admin en `GET /admin`.

- User (rol `user`):
  - Dashboard `GET /user` — ver funciones (solo lectura) y filtro por fecha.
  - Compra de tickets: `GET /user/buy?funcionId=ID`, `POST /user/checkout`, `POST /user/complete`.

Notas sobre comportamiento de autenticación
- El frontend guarda el token en `localStorage` y en una cookie simple (`document.cookie`) para permitir el renderizado de vistas protegidas por el servidor.
- El middleware `utils/auth.js` detecta si la petición acepta HTML y redirige a `/forbidden` cuando corresponde (en lugar de enviar JSON). La vista `views/forbidden.ejs` explica el acceso denegado.
- Recomendación de seguridad: para producción, es mejor que el servidor establezca la cookie con `HttpOnly` y `Secure` en la respuesta, en vez de crearla desde JavaScript. También usar un `JWT_SECRET` fuerte.

Base de datos y migraciones
- El archivo principal con esquema está en `db/schema.sql`. Contiene la creación de las tablas:
  - `peliculas`, `salas` (ahora con columna `precio`), `funciones`, `metodos_pago`, `ventas`, `tickets`, `usuarios`.

Consejos para prueba rápida
- Registra un usuario (o crea admin en BD). Inicia sesión en `/auth/login`.
- Verifica que admin vea el dashboard `/admin` y que el usuario normal vaya a `/user`.
- Desde `/user` prueba comprar tickets:
  1. Click en `Comprar tickets` en una función.
  2. Especifica asientos (uno por línea o separados por comas).
  3. Confirmar compra y seleccionar método de pago.

Problemas conocidos y mejoras pendientes
- Actualmente la cookie se crea desde el cliente y no es `HttpOnly`.
- No hay control de concurrencia/lock sobre asientos: dos usuarios podrían comprar el mismo asiento si se procesa simultáneamente. Se puede mejorar añadiendo verificación en `user/complete` y/o bloqueo a nivel de BD.
- Validaciones de formato y UX pueden mejorarse en múltiples formularios.

Soporte
- Si encuentras errores al arrancar, copia la salida del terminal y envíala para diagnóstico.
- Si necesitas que implemente las cookies `HttpOnly` o la verificación de asientos, puedo hacerlo en la siguiente iteración.

Licencia
- Este proyecto es un ejercicio/plantilla; ajusta la licencia según tu necesidad.

---

README creado automáticamente con las instrucciones necesarias para ejecutar y probar el proyecto.
