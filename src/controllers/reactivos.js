const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar los reactivo registrados
const obtenerReactivos = async (req, res = response) => {
  const reactivos = await pgPool.query('select * from reactivos left join presentaciones on reactivos.idpresentacion = presentaciones.idpresentacion')
  res.status(200).json({
    reactivos: reactivos.rows,
    total: reactivos.rowCount
  })
}

// Consultar un reactivo por su id
const obtenerReactivo = async (req = request, res = response) => {
  const { id } = req.params
  const reactivo = await pgPool.query('select * from reactivos left join presentaciones on reactivos.idpresentacion = presentaciones.idpresentacion where idReactivo = $1', [id])
  if (reactivo.rowCount == 0) {
    return res.status(400).json({
      error: `El reactivo con el id: '${id}' no fue encontrado`
    })
  }
  res.status(200).json(reactivo.rows[0])
}

// Registrar un reactivo en la base de datos
const crearReactivo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { codigoReactivo, idPresentacion, loteReactivo, nombreReactivo, fabricanteReactivo, descripcionReactivo, incertidumbreReactivo, nCatReaCtivo, nCasReactivo, fechaIngresoReactivo, fechaElaboracionReactivo, fechaCaducidadReactivo, marcaReactivo, proveedorReactivo, certificadoReactivo, responsableReactivo, cantidadReactivo, observacionReactivo } = req.body
  // Consultar si el nombre del reactivo ya está registrado
  const reactivo = await pgPool.query('select * from reactivos where nombreReactivo = $1', [nombreReactivo])
  if (reactivo.rowCount == 1) {
    return res.status(400).json({
      error: `El reactivo con el nombre: '${nombreReactivo}' ya esta registrado`
    })
  }
  // Si no está registrado se crea el reactivo base de datos
  try {
    const nuevoreactivo = await pgPool.query('insert into reactivos (codigoReactivo, idpresentacion, loteReactivo, nombreReactivo, fabricanteReactivo, descripcionReactivo, incertidumbreReactivo, nCatReaCtivo, nCasReactivo, fechaIngresoReactivo, fechaElaboracionReactivo, fechaCaducidadReactivo, marcaReactivo, proveedorReactivo, certificadoReactivo, responsableReactivo, cantidadReactivo, observacionReactivo) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [codigoReactivo, idPresentacion, loteReactivo, nombreReactivo, fabricanteReactivo, descripcionReactivo, incertidumbreReactivo, nCatReaCtivo, nCasReactivo, fechaIngresoReactivo, fechaElaboracionReactivo, fechaCaducidadReactivo, marcaReactivo, proveedorReactivo, certificadoReactivo, responsableReactivo, cantidadReactivo, observacionReactivo])
    // Si el registro fue correcto se le envía la respuesta al reactivo
    if (nuevoreactivo.rowCount == 1) {
      const reactivoRegistrado = await pgPool.query('select * from reactivos left join presentaciones on reactivos.idpresentacion = presentaciones.idpresentacion order by idReactivo desc limit 1')
      res.status(200).json({
        reactivo: reactivoRegistrado.rows[0],
        mensaje: `El reactivo con el nombre: '${nombreReactivo}' fue registrado correctamente`,
        estado: true // El estado es verdadero si el registro fue correcto
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Actualizar un reactivo en la base de datos
const actualizarReactivo = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { codigoReactivo, idPresentacion, loteReactivo, nombreReactivo, fabricanteReactivo, descripcionReactivo, incertidumbreReactivo, nCatReaCtivo, nCasReactivo, fechaIngresoReactivo, fechaElaboracionReactivo, fechaCaducidadReactivo, marcaReactivo, proveedorReactivo, certificadoReactivo, responsableReactivo, cantidadReactivo, observacionReactivo } = req.body
  // Consultar si el reactivo esta registrado
  const reactivo = await pgPool.query('select * from reactivos where idReactivo = $1', [id])
  if (reactivo.rowCount == 0) {
    return res.status(400).json({
      error: `El reactivo con el id: '${id}' no fue encontrado`
    })
  }
  // Si el reactivo esta registrado actualizamos los datos
  try {
    const reactivoActualizado = await pgPool.query('update reactivos set codigoReactivo = $1, idpresentacion = $2, loteReactivo = $3, nombreReactivo = $4, fabricanteReactivo = $5, descripcionReactivo = $6, incertidumbreReactivo = $7, nCatReaCtivo = $8, nCasReactivo = $9, fechaIngresoReactivo = $10, fechaElaboracionReactivo = $11, fechaCaducidadReactivo = $12, marcaReactivo = $13, proveedorReactivo = $14, certificadoReactivo=$15, responsableReactivo = $16, cantidadReactivo = $17, observacionReactivo = $18 where idReactivo = $19', [codigoReactivo, idPresentacion, loteReactivo, nombreReactivo, fabricanteReactivo, descripcionReactivo, incertidumbreReactivo, nCatReaCtivo, nCasReactivo, fechaIngresoReactivo, fechaElaboracionReactivo, fechaCaducidadReactivo, marcaReactivo, proveedorReactivo, certificadoReactivo, responsableReactivo, cantidadReactivo, observacionReactivo, id])
    // Si la actualización fue correcta se le envía la respuesta al usuario
    if (reactivoActualizado.rowCount == 1) {
      // Consultar el reactivo actualizado
      const reactivo = await pgPool.query('select * from reactivos left join presentaciones on reactivos.idpresentacion = presentaciones.idpresentacion where idReactivo = $1', [id])
      res.status(200).json({
        reactivo: reactivo.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
        // mensaje: `El reactivo con el nombre '${nombreReactivo}' fue actualizado correctamente`,
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

// Eliminar un reactivo por su id
const eliminarReactivo = async (req = request, res = response) => {
  const { id } = req.params
  // Consultar si el reactivo está registrado
  const reactivo = await pgPool.query('select * from reactivos where idReactivo = $1', [id])
  if (reactivo.rowCount == 0) {
    return res.status(400).json({
      error: `El reactivo con el id: '${id}' no fue encontrado`
    })
  }
  // Si el reactivo esta registrado lo eliminamos
  try {
    const reactivoEliminado = await pgPool.query('delete from reactivos where idReactivo = $1', [id])
    if (reactivoEliminado.rowCount == 1) {
      res.status(200).json({
        reactivo: reactivo.rows[0],
        estado: true // El estado es verdadero si la eliminación fue correcta
        // mensaje: `El reactivo con el id: '${id}' fue eliminado`,
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerReactivos,
  obtenerReactivo,
  crearReactivo,
  actualizarReactivo,
  eliminarReactivo
}
