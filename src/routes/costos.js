const { Router } = require('express')

const {
  obtenerCostos,
  obtenerCosto,
  crearCosto,
  actualizarCosto,
  eliminarCosto
} = require('../controllers/costos')

const router = Router()

router.get('/', obtenerCostos)
router.get('/:id', obtenerCosto)
router.post('/', crearCosto)
router.put('/:id', actualizarCosto)
router.delete('/:id', eliminarCosto)

module.exports = router
