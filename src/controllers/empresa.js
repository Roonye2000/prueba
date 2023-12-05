const { request, response } = require('express')

const { pgPool } = require('../database/config')

// Consultar la información de la empresa
const obtenerInfoEmpresa = async (req, res = response) => {
  const infoEmpresa = await pgPool.query('select * from empresa where idEmpresa = 1')
  res.status(200).json(infoEmpresa.rows[0])
}

// Actualizar la información de la empresa
const actualizarInfoEmpresa = async (req = request, res = response) => {
  // Obtener los campos de la petición
  const { id } = req.params
  const { imagenEmpresa, nombreEmpresa } = req.body
  // Consultar si la empresa está registrada
  const infoEmpresa = await pgPool.query('select * from empresa where idEmpresa = $1', [id])
  if (infoEmpresa.rowCount == 0) { // Datos de la empresa no encontrados
    return res.status(400).json({
      error: `La empresa con el id: '${id}' no fue encontrada`
    })
  }
  // Si la empresa está registrada actualizamos su información
  try {
    const infoEmpresaActualizada = await pgPool.query('update empresa set imagenEmpresa = $1, nombreEmpresa = $2 where idEmpresa = $3', [imagenEmpresa, nombreEmpresa, id])
    // Si la actualización fue correcta se le envía la respuesta al usuario
    if (infoEmpresaActualizada.rowCount == 1) {
      // Actualizar la información que se envía al usuario
      infoEmpresa.rows[0].imagenempresa = imagenEmpresa
      infoEmpresa.rows[0].nombreempresa = nombreEmpresa
      res.status(200).json({
        infoEmpresa: infoEmpresa.rows[0],
        estado: true // El estado es verdadero si la actualización fue correcta
      })
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  obtenerInfoEmpresa,
  actualizarInfoEmpresa
}
