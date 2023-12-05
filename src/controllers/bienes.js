const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los bienes registrados
const obtenerBienes = async (req, res = response) => {
  // const pgQuery = 'select * from bienes asc'
  const pgQuery = 'select * from bienes order by idbien asc'
  const bienes = await pgPool.query(pgQuery)
  res.status(200).json({
    bienes: bienes.rows,
    total: bienes.rowCount
  })
}

// Consultar un bien por su id
const obtenerBien = async (req = request, res = response) => {
  const { id } = req.params
  const pgQuery = `select * from bienes where idbien = ${id}`
  const bien = await pgPool.query(pgQuery)
  if (bien.rowCount == 0) {
    return res.status(400).json({
      error: `El bien con el id: ${id} no fue encontrado`
    })
  }
  res.status(200).json(bien.rows[0])
}

// Registrar un bien en la base de datos
const crearBien = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { nombreBien, codigoBien, cantidadBien, categoriaBien, observacionBien } = req.body
  // Consultar si el nombre del bien ya está registrado
  const bien = await pgPool.query('select * from bienes where nombrebien = $1', [nombreBien])
  if (bien.rowCount == 1) {
    return res.status(400).json({
      error: `El bien con el nombre: ${nombreBien} ya esta registrado`
    })
  }
  // Si no está registrado se crea el bien en la base de datos
  try {
    const nuevoCosto = await pgPool.query('insert into bienes (nombrebien, codigobien, cantidadbien, categoriabien, observacionbien) values ($1, $2, $3, $4, $5)', [nombreBien, codigoBien, cantidadBien, categoriaBien, observacionBien])
    // Si el registro fue correcto se envía la respuesta
    if (nuevoCosto.rowCount == 1) {
      // Consultar el último bien registrado
      const costoRegistrado = await pgPool.query('select * from bienes order by idbien desc limit 1')
      res.status(200).json({
        bien: costoRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un bien en la base de datos
const actualizarBien = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { nombreBien, codigoBien, cantidadBien, categoriaBien, observacionBien } = req.body
  // Consultar si el bien esta registrado
  const bien = await pgPool.query('select * from bienes where idbien = $1', [id])
  if (bien.rowCount == 0) {
    return res.status(400).json({
      error: `El bien con el id: ${id} no fue encontrado`
    })
  }
  // Si el bien esta registrado actualizamos los datos
  try {
    const costoActualizado = await pgPool.query('update bienes set nombrebien = $1, codigobien = $2, cantidadbien = $3, categoriabien = $4, observacionbien = $5 where idbien = $6', [nombreBien, codigoBien, cantidadBien, categoriaBien, observacionBien, id])
    // Si la actualización fue correcta se le envía la respuesta
    if (costoActualizado.rowCount == 1) {
      bien.rows[0].nombrebien = nombreBien
      bien.rows[0].codigobien = codigoBien
      bien.rows[0].cantidadbien = cantidadBien
      bien.rows[0].categoriabien = categoriaBien
      bien.rows[0].observacionbien = observacionBien
      res.status(200).json({
        bien: bien.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un bien por su id
const eliminarBien = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el bien está registrado
  const bien = await pgPool.query('select * from bienes where idbien = $1', [id])
  if (bien.rowCount == 0) {
    return res.status(400).json({
      error: `El bien con el id: ${id} no fue encontrado`
    })
  }
  // Si el bien esta registrado lo eliminamos
  try {
    const costoEliminado = await pgPool.query('delete from bienes where idbien = $1', [id])
    if (costoEliminado.rowCount == 1) {
      res.status(200).json({
        bien: bien.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerBienes,
  obtenerBien,
  crearBien,
  actualizarBien,
  eliminarBien
}
