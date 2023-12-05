const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los insumos registrados
const obtenerInsumos = async (req, res = response) => {
  // const pgQuery = 'select * from insumos order by idinsumo asc'
  const pgQuery = 'select * from insumos left join tiposinsumo on insumos.idtipoinsumo = tiposinsumo.idtipoinsumo order by idinsumo asc'
  const insumos = await pgPool.query(pgQuery)
  res.status(200).json({
    insumos: insumos.rows,
    total: insumos.rowCount
  })
}

// Consultar un insumo por su id
const obtenerInsumo = async (req = request, res = response) => {
  const { id } = req.params
  const pgQuery = `select * from insumos left join tiposinsumo on insumos.idtipoinsumo = tiposinsumo.idtipoinsumo  where idinsumo = ${id}`
  const insumo = await pgPool.query(pgQuery)
  if (insumo.rowCount == 0) {
    return res.status(400).json({
      error: `El insumo con el id: ${id} no fue encontrado`
    })
  }
  res.status(200).json(insumo.rows[0])
}

// Registrar un insumo en la base de datos
const crearInsumo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const {
    idTipoInsumo, nombreInsumo, cantidadInsumo,
    descripcionInsumo, observacionInsumo
  } = req.body
  // Consultar si el nombre del insumo ya está registrado
  const insumo = await pgPool.query('select * from insumos where nombreinsumo = $1', [nombreInsumo])
  if (insumo.rowCount == 1) {
    return res.status(400).json({
      error: `El insumo con el nombre: ${nombreInsumo} ya esta registrado`
    })
  }
  // Si no está registrado se crea el insumo en la base de datos
  try {
    const nuevoInsumo = await pgPool.query('insert into insumos (idtipoinsumo, nombreinsumo, cantidadinsumo, descripcioninsumo, observacioninsumo) values ($1, $2, $3, $4, $5)', [idTipoInsumo, nombreInsumo, cantidadInsumo, descripcionInsumo, observacionInsumo])
    // Si el registro fue correcto se le envía la respuesta al insumo
    if (nuevoInsumo.rowCount == 1) {
      // Consultar el último reactivo registrado
      const insumoRegistrado = await pgPool.query('select * from insumos left join tiposinsumo on insumos.idtipoinsumo = tiposinsumo.idtipoinsumo order by idinsumo desc limit 1')
      res.status(200).json({
        insumo: insumoRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un insumo en la base de datos
const actualizarInsumo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const {
    idTipoInsumo, cantidadInsumo, nombreInsumo,
    descripcionInsumo, observacionInsumo
  } = req.body
  // Consultar si el insumo esta registrado
  const insumo = await pgPool.query('select * from insumos left join tiposinsumo on insumos.idtipoinsumo = tiposinsumo.idtipoinsumo where idInsumo = $1', [id])
  if (insumo.rowCount == 0) {
    return res.status(400).json({
      error: `El insumo con el id: ${id} no fue encontrado`
    })
  }
  // Si el insumo esta registrado actualizamos los datos
  try {
    const insumoActualizado = await pgPool.query('update insumos set idtipoinsumo = $1, cantidadinsumo = $2, nombreinsumo = $3, descripcioninsumo = $4, observacioninsumo = $5 where idinsumo = $6', [idTipoInsumo, cantidadInsumo, nombreInsumo, descripcionInsumo, observacionInsumo, id])
    // Si la actualización fue correcta se le envía la respuesta al insumo
    if (insumoActualizado.rowCount == 1) {
      insumo.rows[0].idtipoinsumo = idTipoInsumo
      insumo.rows[0].cantidadinsumo = cantidadInsumo
      insumo.rows[0].nombreinsumo = nombreInsumo
      insumo.rows[0].descripcioninsumo = descripcionInsumo
      insumo.rows[0].observacioninsumo = observacionInsumo
      res.status(200).json({
        insumo: insumo.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un insumo por su id
const eliminarInsumo = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el insumo está registrado
  const insumo = await pgPool.query('select * from insumos where idinsumo = $1', [id])
  if (insumo.rowCount == 0) {
    return res.status(400).json({
      error: `El insumo con el id: ${id} no fue encontrado`
    })
  }
  // Si el insumo esta registrado lo eliminamos
  try {
    const insumoEliminado = await pgPool.query('delete from insumos where idinsumo = $1', [id])
    if (insumoEliminado.rowCount == 1) {
      res.status(200).json({
        insumo: insumo.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerInsumos,
  obtenerInsumo,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
}
