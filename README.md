# 💍 Wedding Invitation

Aplicación web para la gestión de invitaciones de boda desarrollada con:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

---

# 🚀 Requisitos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js
- PostgreSQL
- npm
- Prisma CLI (se instala con las dependencias)

---

# 📥 Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Entrar al proyecto:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

---

# ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wedding_invitation?schema=public"
PORT=3000
```

---

# 🛠 Generar Prisma Client

Después de instalar las dependencias, generar el cliente de Prisma:

```bash
npx prisma generate
```

> **Importante:** La carpeta `src/generated/prisma` no se versiona en Git. Cada desarrollador debe generar el cliente localmente ejecutando este comando.

---

# 🗄 Crear la base de datos

Crear una base de datos llamada:

```
wedding_invitation
```

en PostgreSQL.

---

# 📦 Ejecutar migraciones

Para crear la estructura de la base de datos:

```bash
npx prisma migrate dev
```

Prisma aplicará todas las migraciones almacenadas en:

```
prisma/migrations
```

---

# ▶️ Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Compilar:

```bash
npm run build
```

Producción:

```bash
npm start
```

---

# 📁 Estructura del proyecto

```
src
│
├── config
├── controllers
├── middlewares
├── models
├── routes
├── services
├── utils
├── generated
│
├── app.ts
└── server.ts
```

---

# 📌 Comandos útiles

Generar Prisma Client:

```bash
npx prisma generate
```

Crear una nueva migración:

```bash
npx prisma migrate dev
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

Validar el esquema:

```bash
npx prisma validate
```

---

# 📖 Notas importantes

- Nunca subir el archivo `.env`.
- Nunca modificar manualmente una migración ya aplicada.
- Las migraciones (`prisma/migrations`) sí deben versionarse en Git.
- `schema.prisma` es la fuente de verdad del modelo de datos.
- El cliente de Prisma (`src/generated/prisma`) se genera localmente ejecutando `npx prisma generate`.
