const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los formatos registrados
const obtenerFormatos = async (req, res = response) => {
  const pgQuery = 'select * from formatos order by idformato asc'
  const formatos = await pgPool.query(pgQuery)
  res.status(200).json({
    formatos: formatos.rows,
    total: formatos.rowCount
  })
}

// Consultar un formato por su id
const obtenerFormato = async (req = request, res = response) => {
  const { id } = req.params
  const pgQuery = `select * from formatos where idFormato = ${id}`
  const formato = await pgPool.query(pgQuery)
  if (formato.rowCount == 0) {
    return res.status(400).json({
      error: `El formato con el id: '${id}' no fue encontrado`
    })
  }
  res.status(200).json(formato.rows[0])
}

// Registrar un formato en la base de datos
const crearFormato = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { nombreArchivo, tipoFormato, enlaceFormato } = req.body
  // Consultar si el nombre del formato ya está registrado
  const formato = await pgPool.query('select * from formatos where nombreArchivo = $1', [nombreArchivo])
  if (formato.rowCount == 1) {
    return res.status(400).json({
      error: `El formato con el nombre: '${nombreArchivo}' ya esta registrado`
    })
  }
  // Si no está registrado se crea el formato en la base de datos
  try {
    const nuevoFormato = await pgPool.query('insert into formatos (nombreArchivo, tipoFormato, enlaceFormato) values ($1, $2, $3)', [nombreArchivo, tipoFormato, enlaceFormato])
    // Si el registro fue correcto se le envía la respuesta al formato
    if (nuevoFormato.rowCount == 1) {
      // Consultar el último reactivo registrado
      const formatoRegistrado = await pgPool.query('select * from formatos order by idFormato desc limit 1')
      res.status(200).json({
        formato: formatoRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un formato en la base de datos
const actualizarFormato = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { nombreArchivo, tipoFormato, enlaceFormato } = req.body
  // Consultar si el formato esta registrado
  const formato = await pgPool.query('select * from formatos where idFormato = $1', [id])
  if (formato.rowCount == 0) {
    return res.status(400).json({
      error: `El formato con el id: '${id}' no fue encontrado`
    })
  }
  // Si el formato esta registrado actualizamos los datos
  try {
    const formatoActualizado = await pgPool.query('update formatos set nombreArchivo = $1, tipoFormato = $2, enlaceFormato = $3 where idformato = $4', [nombreArchivo, tipoFormato, enlaceFormato, id])
    // Si la actualización fue correcta se le envía la respuesta al formato
    if (formatoActualizado.rowCount == 1) {
      formato.rows[0].nombrearchivo = nombreArchivo
      formato.rows[0].tipoformato = tipoFormato
      formato.rows[0].enlaceformato = enlaceFormato
      res.status(200).json({
        formato: formato.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un formato por su id
const eliminarFormato = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el formato está registrado
  const formato = await pgPool.query('select * from formatos where idFormato = $1', [id])
  if (formato.rowCount == 0) {
    return res.status(400).json({
      error: `El formato con el id: '${id}' no fue encontrado`
    })
  }
  // Si el formato esta registrado lo eliminamos
  try {
    const formatoEliminado = await pgPool.query('delete from formatos where idFormato = $1', [id])
    if (formatoEliminado.rowCount == 1) {
      res.status(200).json({
        formato: formato.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerFormatos,
  obtenerFormato,
  crearFormato,
  actualizarFormato,
  eliminarFormato
}
