# 🌐 Backend - Proyecto Capstone

Este es el backend del proyecto Capstone desarrollado con **Node.js**, **Express**, y **MongoDB (Mongoose)**.

---

## 🚀 Tecnologías usadas

- Node.js  
- Express.js  
- Mongoose (MongoDB)  
- Morgan  
- Nodemon  

---

## 📦 Instalación del proyecto

---
git clone https://github.com/tu-usuario/nombre-del-repo.git
cd nombre-del-repo
npm install
npm install express mongoose morgan
npm install nodemon
inicial npm run dev
npm install bcrypt
npm install uuid
npm install jsonwebtoken



---

## base de datos


Table Usuarios {
  id_usuario varchar [pk]
  nombre varchar
  apellido varchar
  correo varchar
  contraseña varchar
  rol varchar
  foto_perfil varchar
  fecha_nacimiento date
  estado varchar
  puntosAcumulados int
}

Table Perfil {
  id_perfil varchar [pk]
  id_usuario varchar [ref: > Usuarios.id_usuario]
  descripcion varchar
  foto_portada varchar
}

Table Seguimientos {
  id_seguimiento varchar [pk]
  seguidorId varchar [ref: > Usuarios.id_usuario]
  seguidoId varchar [ref: > Usuarios.id_usuario]
  fecha datetime
}

Table Actividad {
  id_actividad varchar [pk]
  titulo varchar
  descripcion varchar
  puntosOtorgados int
  fechaInicio date
  fechaFin date
  estado varchar
}

Table Inscripcion {
  id_inscripcion varchar [pk]
  id_usuario varchar [ref: > Usuarios.id_usuario]
  id_actividad varchar [ref: > Actividad.id_actividad]
  estado varchar
  fechaRevision datetime
  puntosOtorgados int
}

Table Evidencias {
  id_evidencia varchar [pk]
  id_inscripcion varchar [ref: > Inscripcion.id_inscripcion]
  archivoUrl varchar
  descripcion varchar
  tipo varchar
  fechaSubida datetime
}

Table Publicaciones {
  id_publicacion varchar [pk]
  autorId varchar [ref: > Usuarios.id_usuario]
  descripcion varchar
  imagenes varchar
  likes varchar
  fechaPublicacion datetime
}

Table Comentarios {
  id_comentario varchar [pk]
  publicacionId varchar [ref: > Publicaciones.id_publicacion]
  autorId varchar [ref: > Usuarios.id_usuario]
  texto varchar
  fecha datetime
}

Table Recompensas {
  id_recompensa varchar [pk]
  nombre varchar
  descripcion varchar
  puntosRequeridos int
  imagenUrl varchar
  cantidadDisponible int
  activa boolean
}

Table Canjes {
  id_canje varchar [pk]
  usuarioId varchar [ref: > Usuarios.id_usuario]
  recompensaId varchar [ref: > Recompensas.id_recompensa]
  estado varchar
  fechaSolicitud datetime
  observaciones varchar
}

Table Insignias {
  id_insignia varchar [pk]
  nombre varchar
  descripcion varchar
  imagenUrl varchar
  activa boolean
}

Table UsuarioInsignias {
  id_usuarioInsignia varchar [pk]
  usuarioId varchar [ref: > Usuarios.id_usuario]
  insigniaId varchar [ref: > Insignias.id_insignia]
  fechaOtorgada datetime
}

MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombreBaseDatos>?retryWrites=true&w=majority&appName=<nombreApp>
PORT=3000


```bash