# 🌐 Backend - Proyecto Capstone

Este es el backend del proyecto Capstone desarrollado con **Node.js**, **Express**, y **MongoDB (Mongoose)**.

---

## 🚀 Tecnologías usadas

- Node.js  
- Express.js  
- Mongoose (MongoDB)  
- Morgan  
- Nodemon
- cloudynari
- moderacion ia sishengine

---

## 📦 Instalación del proyecto

---
- git clone https://github.com/tu-usuario/nombre-del-repo.git
- cd nombre-del-repo
- npm -y install
- npm init -y
- npm install
- npm install dotenv
- npm install express mongoose morgan
- npm install nodemon
- inicial npm run dev
- npm install bcrypt
- npm install uuid
- npm install jsonwebtoken
- npm install passport passport-azure-ad express-session
- npm i cookie-parser
- npm install zod
- npm install multer
- npm install cloudinary multer multer-storage-cloudinary --legacy-peer-deps 
- npm install axios
- npm install fluent-ffmpeg 
- npm install bad-words (PUBLICACIONES)
- npm install nodemailer (AUTHSERVICES)
- npm install cors --legacy-peer-deps

 










 Microservicios para Terranova Connect

## 1. authServices
- Registro, login, logout
- Generación y validación de JWT
- Validación de roles (admin, profesor, estudiante, padre)
- Gestión de sesión y cookies
- Control de estado de cuenta (activo/inactivo)
- 2FA

## 2. publicaciones
- Crear publicación
- Subir multimedia (imágenes/videos)
- Reaccionar (me gusta) a publicaciones
- Ver galería del perfil
- Ver publicaciones públicas o por curso
- Moderación de contenido con Vision AI

## 3. gamificacion
- Sistema de puntos acumulados
- Gestión de insignias y niveles
- Clasificación de usuarios (ranking)
- Canje de recompensas

## 4. actividades
- Listado de actividades escolares
- Inscripción en actividades
- Envío de evidencias de participación
- Estados de actividad (inscrito, en progreso, completada)
- Visualización de progreso (gráficos de barras y torta)
- Gestion del calendario escolar

## 5. Usuarios

- Gestión de usuarios y roles
- Aprobación/rechazo evidencias
- Creación/edición de actividades
- creacion de insignias
- creacion/ actualizacion/eliminacion recompensas y misiones
- Perfil del usuario (nombre, foto, fecha de nacimiento, rol)
- Seguidores y seguidos (solo para profes y padres)
- Edición de perfil
- Ver estadísticas personales
