# 🏨 Hotel Coventry - Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">API REST robusta para gestión hotelera construida con NestJS, TypeScript y PostgreSQL</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-green.svg" alt="PostgreSQL" />
</p>

## 📋 Descripción

Sistema completo de gestión hotelera que incluye:

- 🏨 **Gestión de hoteles y habitaciones**
- 📅 **Sistema de reservas**
- 💳 **Procesamiento de pagos con MercadoPago**
- 📧 **Notificaciones por email**
- 🔐 **Autenticación JWT y OAuth (Google)**
- 📸 **Gestión de imágenes con Cloudinary**
- 📚 **Documentación automática con Swagger**

## 🚀 Instalación del Proyecto

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Configuración

```bash
# Clonar repositorio
$ git clone https://github.com/tu-usuario/Hotelcoventry-Back-End.git
$ cd Hotelcoventry-Back-End

# Instalar dependencias
$ npm install

# Configurar variables de entorno
$ cp .env.example .env
# Editar .env con tus configuraciones
```

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/hotel_db
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 🏗️ Compilar y Ejecutar el Proyecto

```bash
# Desarrollo con recarga automática
$ npm run start:dev

# Desarrollo con debug
$ npm run start:debug

# Compilar para producción
$ npm run build

# Ejecutar en producción
$ npm run start:prod

# Modo de producción simulado (build + run)
$ npm run start
```

## 🗄️ Base de Datos

```bash
# Ejecutar migraciones
$ npm run migration:run

# Generar nueva migración después de cambios en entities
$ npm run migration:generate -- src/migrations/NombreMigracion

# Crear migración vacía para cambios manuales
$ npm run migration:create -- src/migrations/NombreMigracion

# Revertir última migración
$ npm run migration:revert

# Ver estado de migraciones
$ npm run migration:show

# Build + migraciones (para deploy)
$ npm run migration:build-run
```

## 🧪 Ejecutar Tests

```bash
# Tests unitarios
$ npm run test

# Tests con vigilancia automática
$ npm run test:watch

# Tests end-to-end (integración)
$ npm run test:e2e

# Cobertura de tests
$ npm run test:cov

# Debug de tests
$ npm run test:debug
```

## 🔧 Calidad de Código

```bash
# Verificar formato y linting
$ npm run code:check

# Arreglar formato y linting automáticamente
$ npm run code:fix

# Solo verificar linting
$ npm run lint:check

# Arreglar solo linting
$ npm run lint:fix

# Solo verificar formato
$ npm run format:check

# Formatear código
$ npm run format

# Pipeline completo antes de deploy
$ npm run pre-deploy
```

## 📁 Estructura del Proyecto

```
src/
├── config/                 # Configuraciones (DB, JWT, etc.)
├── modules/                # Módulos de la aplicación
│   ├── auth/              # Autenticación y autorización
│   ├── users/             # Gestión de usuarios
│   ├── hotels/            # Gestión de hoteles
│   ├── rooms/             # Gestión de habitaciones
│   ├── reservations/      # Sistema de reservas
│   ├── payments/          # Procesamiento de pagos
│   ├── mail/              # Notificaciones por email
│   │   └── templates/     # Templates de email (.hbs)
│   └── cloudinary/        # Gestión de imágenes
├── common/                # Código compartido (DTOs, decoradores, etc.)
├── migrations/            # Migraciones de base de datos
└── main.ts               # Punto de entrada de la aplicación
```

## 🛠️ Tecnologías Principales

### **Framework y Lenguaje**

- **NestJS 11.x** - Framework backend progresivo
- **TypeScript 5.8** - Tipado estático
- **Node.js 18+** - Runtime de JavaScript

### **Base de Datos**

- **PostgreSQL 15+** - Base de datos principal
- **TypeORM 0.3** - ORM para TypeScript
- **Supabase** - Hosting de PostgreSQL

### **Autenticación y Seguridad**

- **JWT** - Tokens de autenticación
- **Passport.js** - Middleware de autenticación
- **bcrypt** - Encriptación de contraseñas
- **Google OAuth 2.0** - Autenticación con Google

### **Servicios Externos**

- **MercadoPago SDK** - Procesamiento de pagos
- **Cloudinary** - Almacenamiento y optimización de imágenes
- **Nodemailer** - Envío de emails
- **Handlebars** - Templates para emails

### **Desarrollo y Calidad**

- **ESLint + Prettier** - Linting y formateo
- **Jest** - Framework de testing
- **Swagger/OpenAPI** - Documentación automática
- **Class Validator** - Validación de DTOs

## 📚 Documentación API

Una vez ejecutando el servidor, la documentación interactiva está disponible en:

- **Swagger UI:** `http://localhost:3000/api/docs`
- **JSON Schema:** `http://localhost:3000/api/docs-json`

## 🚀 Despliegue

### Build para Producción

```bash
# Pipeline completo de verificación y build
$ npm run pre-deploy

# Solo build (si ya verificaste el código)
$ npm run build

# Aplicar migraciones en producción
$ npm run migration:run
```

### Plataformas Recomendadas

```bash
# Deploy con Mau (plataforma oficial de NestJS)
$ npm install -g @nestjs/mau
$ mau deploy
```

**Alternativas:** Railway, Render, Digital Ocean, AWS, Heroku

### Consideraciones de Producción

- Configurar variables de entorno seguras
- Usar conexiones SSL para base de datos
- Configurar CORS apropiadamente
- Habilitar rate limiting
- Configurar logging robusto
- Implementar health checks

## 📖 Recursos y Documentación

- [NestJS Documentation](https://docs.nestjs.com) - Documentación oficial
- [TypeORM Documentation](https://typeorm.io) - ORM utilizado
- [MercadoPago Developers](https://www.mercadopago.com.ar/developers) - API de pagos
- [Cloudinary Documentation](https://cloudinary.com/documentation) - Gestión de imágenes
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Base de datos

## 🤝 Soporte y Comunidad

- [NestJS Discord](https://discord.gg/G7Qnnhy) - Comunidad oficial
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs) - Preguntas técnicas
- [GitHub Issues](https://github.com/tu-usuario/Hotelcoventry-Back-End/issues) - Reportar bugs

## 👨‍💻 Desarrollo

### Flujo de Desarrollo Recomendado

1. **Crear feature branch:** `git checkout -b feature/nueva-funcionalidad`
2. **Desarrollar con hot reload:** `npm run start:dev`
3. **Escribir tests:** `npm run test:watch`
4. **Verificar código:** `npm run code:check`
5. **Commit y push:** Seguir conventional commits
6. **Crear Pull Request**

### Comandos de Desarrollo Frecuentes

```bash
# Desarrollo activo
npm run start:dev & npm run test:watch

# Verificación antes de commit
npm run code:fix && npm run test

# Trabajo con base de datos
npm run migration:generate -- src/migrations/AddNewFeature
npm run migration:run
```

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

<p align="center">
  <strong>🏨 Hotel Coventry Backend API</strong><br>
  Construido con ❤️ usando NestJS y TypeScript
</p>
