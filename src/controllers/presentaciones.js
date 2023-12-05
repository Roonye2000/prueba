const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los tipos de presentaciones para un reactivo registrados
const obtenerPresentaciones = async (req, res = response) => {
  const presentaciones = await pgPool.query('select idpresentacion, nombrepresentacion, (select count(*) from reactivos where reactivos.idpresentacion = presentaciones.idpresentacion) as reactivos from presentaciones')
  res.status(200).json({
    presentaciones: presentaciones.rows,
    total: presentaciones.rowCount
  })
}

// Registrar un tipo de presentación para un reactivo en la base de datos
const crearPresentacion = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { nombrePresentacion } = req.body
  // Consultar si el nombre de la presentación ya está registrado
  const presentacionReactivo = await pgPool.query('select * from presentaciones where nombrePresentacion = $1', [nombrePresentacion])
  if (presentacionReactivo.rowCount == 1) {
    return res.status(400).json({
      error: `La presentación con el nombre: '${nombrePresentacion}' ya está registrada`
    })
  }
  // Si no está registrado se crea el tipo de presentación en la base de datos
  try {
    const nuevaPresentacionReactivo = await pgPool.query('insert into presentaciones (nombrePresentacion) values ($1)', [nombrePresentacion])
    // Si el registro fue correcto se le envía la respuesta al usuario
    if (nuevaPresentacionReactivo.rowCount == 1) {
      // Consultar el último tipo de presentación para un reactivo registrado
      const presentacionRegistrada = await pgPool.query('select * from presentaciones order by idPresentacion desc limit 1')
      // Añadir el dato faltante de los reactivos a la presentación consultada
      presentacionRegistrada.rows[0].reactivos = 0
      res.status(200).json({
        presentacion: presentacionRegistrada.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un tipo de presentación para un reactivo en la base de datos
const actualizarPresentacion = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { nombrePresentacion } = req.body
  // Consultar si el tipo de presentación para un reactivo esta registrado
  const presentacionReactivo = await pgPool.query('select * from presentaciones where idPresentacion = $1', [id])
  if (presentacionReactivo.rowCount == 0) {
    return res.status(400).json({
      error: `La presentación con el id: '${id}' no fue encontrada`
    })
  }
  // Si el tipo de presentación para un reactivo esta registrado actualizamos los datos
  try {
    const presentacionActualizada = await pgPool.query('update presentaciones set nombrePresentacion = $1 where idPresentacion = $2', [nombrePresentacion, id])
    // Si la actualización fue correcta se le envía la respuesta al usuario
    if (presentacionActualizada.rowCount == 1) {
      // Consultar el tipo de presentación para un reactivo actualizado
      const presentacionReactivo = await pgPool.query('select * from presentaciones where idPresentacion = $1', [id])
      res.status(200).json({
        presentacion: presentacionReactivo.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un tipo de presentación para un reactivo por su id
const eliminarPresentacion = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el tipo de presentación para un reactivo está registrado
  const presentacionReactivo = await pgPool.query('select * from presentaciones where idPresentacion = $1', [id])
  if (presentacionReactivo.rowCount == 0) {
    return res.status(400).json({
      error: `La presentación con el id: '${id}' no fue encontrada`
    })
  }
  // Si el tipo de presentación para un reactivo esta registrado lo eliminamos
  try {
    const presentacionEliminada = await pgPool.query('delete from presentaciones where idPresentacion = $1', [id])
    if (presentacionEliminada.rowCount == 1) {
      res.status(200).json({
        presentacion: presentacionReactivo.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerPresentaciones,
  crearPresentacion,
  actualizarPresentacion,
  eliminarPresentacion
}
