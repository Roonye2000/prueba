const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los costos registrados
const obtenerCostos = async (req, res = response) => {
  // const pgQuery = 'select * from costos asc'
  const pgQuery = 'select * from costos order by idcosto asc'
  const costos = await pgPool.query(pgQuery)
  res.status(200).json({
    costos: costos.rows,
    total: costos.rowCount
  })
}

// Consultar un costo por su id
const obtenerCosto = async (req = request, res = response) => {
  const { id } = req.params
  const pgQuery = `select * from costos where idcosto = ${id}`
  const costo = await pgPool.query(pgQuery)
  if (costo.rowCount == 0) {
    return res.status(400).json({
      error: `El costo con el id: ${id} no fue encontrado`
    })
  }
  res.status(200).json(costo.rows[0])
}

// Registrar un costo en la base de datos
const crearCosto = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { analisisCosto, codigoCosto, totalCosto, observacionCosto } = req.body
  // Consultar si el nombre de análisis del costo ya está registrado
  const costo = await pgPool.query('select * from costos where analisisCosto = $1', [analisisCosto])
  if (costo.rowCount == 1) {
    return res.status(400).json({
      error: `El costo con el análisis: ${analisisCosto} ya esta registrado`
    })
  }
  // Si no está registrado se crea el costo en la base de datos
  try {
    const nuevoCosto = await pgPool.query('insert into costos (analisiscosto, codigocosto, totalcosto, observacioncosto) values ($1, $2, $3, $4)', [analisisCosto, codigoCosto, totalCosto, observacionCosto])
    // Si el registro fue correcto se envía la respuesta
    if (nuevoCosto.rowCount == 1) {
      // Consultar el último costo registrado
      const costoRegistrado = await pgPool.query('select * from costos order by idcosto desc limit 1')
      res.status(200).json({
        costo: costoRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un costo en la base de datos
const actualizarCosto = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { analisisCosto, codigoCosto, totalCosto, observacionCosto } = req.body
  // Consultar si el costo esta registrado
  const costo = await pgPool.query('select * from costos where idcosto = $1', [id])
  if (costo.rowCount == 0) {
    return res.status(400).json({
      error: `El costo con el id: ${id} no fue encontrado`
    })
  }
  // Si el costo esta registrado actualizamos los datos
  try {
    const costoActualizado = await pgPool.query('update costos set analisiscosto = $1, codigocosto = $2, totalcosto = $3, observacioncosto = $4 where idcosto = $5', [analisisCosto, codigoCosto, totalCosto, observacionCosto, id])
    // Si la actualización fue correcta se le envía la respuesta
    if (costoActualizado.rowCount == 1) {
      costo.rows[0].analisiscosto = analisisCosto
      costo.rows[0].codigocosto = codigoCosto
      costo.rows[0].totalcosto = totalCosto
      costo.rows[0].observacioncosto = observacionCosto
      res.status(200).json({
        costo: costo.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un costo por su id
const eliminarCosto = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el costo está registrado
  const costo = await pgPool.query('select * from costos where idcosto = $1', [id])
  if (costo.rowCount == 0) {
    return res.status(400).json({
      error: `El costo con el id: ${id} no fue encontrado`
    })
  }
  // Si el costo esta registrado lo eliminamos
  try {
    const costoEliminado = await pgPool.query('delete from costos where idcosto = $1', [id])
    if (costoEliminado.rowCount == 1) {
      res.status(200).json({
        costo: costo.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerCostos,
  obtenerCosto,
  crearCosto,
  actualizarCosto,
  eliminarCosto
}
