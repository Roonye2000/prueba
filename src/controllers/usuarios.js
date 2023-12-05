const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los usuarios registrados
const obtenerUsuarios = async (req, res = response) => {
  const pgQuery = 'select * from usuarios order by idusuario asc'
  const usuarios = await pgPool.query(pgQuery)
  res.status(200).json({
    usuarios: usuarios.rows,
    total: usuarios.rowCount
  })
}

// Consultar un usuario por su id
const obtenerUsuario = async (req = request, res = response) => {
  const { id } = req.params
  const pgQuery = `select * from usuarios where idUsuario = ${id}`
  const usuario = await pgPool.query(pgQuery)
  if (usuario.rowCount == 0) {
    return res.status(400).json({
      error: `El usuario con el id: '${id}' no fue encontrado`
    })
  }
  res.status(200).json(usuario.rows[0])
}

// Registrar un usuario en la base de datos
const crearUsuario = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const {
    nombreUsuario, apellidoUsuario, nickUsuario,
    contrasenaUsuario, tipoUsuario
  } = req.body
  // Consultar si el nombre del usuario ya está registrado
  const usuario = await pgPool.query('select * from usuarios where nickusuario = $1', [nickUsuario])
  if (usuario.rowCount == 1) {
    return res.status(400).json({
      error: `El usuario con el nick: '${nickUsuario}' ya esta registrado`
    })
  }
  // Si no está registrado se crea el usuario en la base de datos
  try {
    const nuevoUsuario = await pgPool.query('insert into usuarios (nombreusuario, apellidousuario, nickusuario, contrasenausuario, tipousuario, estadousuario) values ($1, $2, $3, $4, $5, $6)', [nombreUsuario, apellidoUsuario, nickUsuario, contrasenaUsuario, tipoUsuario, 'Activo'])
    // Si el registro fue correcto se le envía la respuesta al usuario
    if (nuevoUsuario.rowCount == 1) {
      // Consultar el último reactivo registrado
      const usuarioRegistrado = await pgPool.query('select * from usuarios order by idUsuario desc limit 1')
      res.status(200).json({
        usuario: usuarioRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un usuario en la base de datos
const actualizarUsuario = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const {
    nombreUsuario, apellidoUsuario, nickUsuario,
    contrasenaUsuario, tipoUsuario, estadoUsuario
  } = req.body
  // Consultar si el usuario esta registrado
  const usuario = await pgPool.query('select * from usuarios where idUsuario = $1', [id])
  if (usuario.rowCount == 0) {
    return res.status(400).json({
      error: `El usuario con el id: '${id}' no fue encontrado`
    })
  }
  // Si el usuario esta registrado actualizamos los datos
  try {
    const usuarioActualizado = await pgPool.query('update usuarios set nombreusuario = $1, apellidousuario = $2, nickusuario = $3, contrasenausuario = $4, tipousuario = $5, estadousuario = $6 where idusuario = $7', [nombreUsuario, apellidoUsuario, nickUsuario, contrasenaUsuario, tipoUsuario, estadoUsuario, id])
    // Si la actualización fue correcta se le envía la respuesta al usuario
    if (usuarioActualizado.rowCount == 1) {
      usuario.rows[0].nombreusuario = nombreUsuario
      usuario.rows[0].apellidousuario = apellidoUsuario
      usuario.rows[0].nickusuario = nickUsuario
      usuario.rows[0].contrasenausuario = contrasenaUsuario
      usuario.rows[0].tipousuario = tipoUsuario
      usuario.rows[0].estadousuario = estadoUsuario
      res.status(200).json({
        usuario: usuario.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un usuario por su id
const eliminarUsuario = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el usuario está registrado
  const usuario = await pgPool.query('select * from usuarios where idUsuario = $1', [id])
  if (usuario.rowCount == 0) {
    return res.status(400).json({
      error: `El usuario con el id: '${id}' no fue encontrado`
    })
  }
  // Si el usuario esta registrado lo eliminamos
  try {
    const usuarioEliminado = await pgPool.query('delete from usuarios where idUsuario = $1', [id])
    if (usuarioEliminado.rowCount == 1) {
      res.status(200).json({
        usuario: usuario.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Obtener un usuario por su nombre y contraseña
const iniciarSesion = async (req = request, res = response) => {
  const { nickUsuario, contrasenaUsuario } = req.body
  const usuario = await pgPool.query('select * from usuarios where nickusuario = $1 and contrasenausuario = $2', [nickUsuario, contrasenaUsuario])
  if (usuario.rowCount == 0) {
    return res.status(400).json({
      error: `El usuario no fue encontrado`
    })
  } else {
    if (usuario.rows[0].estadousuario == 'Inactivo') {
      return res.status(400).json({
        error: `El usuario se encuentra inactivo`
      })
    }
  }
  // Obtener la fecha actual de la sesión del usuario
  const fechaActual = new Date().toLocaleString('es-ES', { timeZone: 'America/Guayaquil' })
  console.log();
  // Si los datos del usuario fueron encontrados se actualiza la fecha su ultima sesión
  await pgPool.query('update usuarios set ultimaSesionUsuario = $1 where idUsuario = $2', [fechaActual, usuario.rows[0].idusuario])
  // Actualizar la fecha de la sesión en la respuesta que se le envía al usuario
  usuario.rows[0].ultimasesionusuario = fechaActual
  // Enviar la respuesta al usuario
  res.status(200).json(usuario.rows[0])
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  iniciarSesion
}
