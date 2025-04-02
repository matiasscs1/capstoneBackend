export const obtenerDatosUsuario = async (id_usuario, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id_usuario}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) return null;
  
      const data = await response.json();
      return {
        nombre: data.nombre,
        apellido: data.apellido,
        fotoPerfil: data.foto_perfil,
        rol: data.rol
      };
    } catch (error) {
      console.error(' Error al obtener datos del usuario desde authService:', error.message);
      return null;
    }
};
  