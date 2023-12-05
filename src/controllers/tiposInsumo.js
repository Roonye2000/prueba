const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los tipos de insumos registrados
const obtenerTiposInsumos = async (req, res = response) => {
  const tiposinsumo = await pgPool.query('select idtipoinsumo, nombretipoinsumo, (select count(*) from insumos where insumos.idtipoinsumo = tiposinsumo.idtipoinsumo) as insumos from tiposinsumo')
  res.status(200).json({
    tiposInsumo: tiposinsumo.rows,
    total: tiposinsumo.rowCount
  })
}

// Registrar un tipo de insumo en la base de datos
const crearTipoInsumo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { nombreTipoInsumo } = req.body
  // Consultar si el nombre del tipo de insumo ya está registrado
  const tipoInsumo = await pgPool.query('select * from tiposinsumo where nombretipoinsumo = $1', [nombreTipoInsumo])
  if (tipoInsumo.rowCount == 1) {
    return res.status(400).json({
      error: `El tipo de insumo con el nombre: ${nombreTipoInsumo} ya está registrado`
    })
  }
  // Si no está registrado se crea el tipo de insumo en la base de datos
  try {
    const nuevoTipoInsumo = await pgPool.query('insert into tiposinsumo (nombretipoinsumo) values ($1)', [nombreTipoInsumo])
    // Si el registro fue correcto se le envía la respuesta al usuario
    if (nuevoTipoInsumo.rowCount == 1) {
      // Consultar el último tipo de insumo registrado
      const tipoInsumoRegistrado = await pgPool.query('select * from tiposinsumo order by idtipoinsumo desc limit 1')
      // Añadir el dato faltante de los insumos a la presentación consultada
      tipoInsumoRegistrado.rows[0].insumos = 0
      res.status(200).json({
        tipoInsumo: tipoInsumoRegistrado.rows[0],
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un tipo de insumo en la base de datos
const actualizarTipoInsumo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { nombreTipoInsumo } = req.body
  // Consultar si el tipo de insumo esta registrado
  const tipoInsumo = await pgPool.query('select * from tiposinsumo where idtipoinsumo = $1', [id])
  if (tipoInsumo.rowCount == 0) {
    return res.status(400).json({
      error: `El tipo de insumo con el id: ${id} no fue encontrado`
    })
  }
  // Si el tipo de insumo esta registrado actualizamos los datos
  try {
    const tipoInsumoActualizado = await pgPool.query('update tiposinsumo set nombretipoinsumo = $1 where idtipoinsumo = $2', [nombreTipoInsumo, id])
    // Si la actualización fue correcta se le envía la respuesta al usuario
    if (tipoInsumoActualizado.rowCount == 1) {
      // Consultar el tipo de insumo actualizado
      const tipoInsumo = await pgPool.query('select * from tiposinsumo where idtipoinsumo = $1', [id])
      res.status(200).json({
        tipoInsumo: tipoInsumo.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un tipo de insumo por su id
const eliminarTipoInsumo = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el tipo de insumo está registrado
  const tipoInsumo = await pgPool.query('select * from tiposinsumo where idtipoinsumo = $1', [id])
  if (tipoInsumo.rowCount == 0) {
    return res.status(400).json({
      error: `El tipo de insumo con el id: ${id} no fue encontrado`
    })
  }
  // Si el tipo de insumo esta registrado lo eliminamos
  try {
    const tipoInsumoEliminado = await pgPool.query('delete from tiposinsumo where idtipoinsumo = $1', [id])
    if (tipoInsumoEliminado.rowCount == 1) {
      res.status(200).json({
        tipoInsumo: tipoInsumo.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerTiposInsumos,
  crearTipoInsumo,
  actualizarTipoInsumo,
  eliminarTipoInsumo
}
