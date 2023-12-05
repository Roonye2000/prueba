const { Router } = require('express')

const {
  obtenerTiposInsumos,
  crearTipoInsumo,
  actualizarTipoInsumo,
  eliminarTipoInsumo
} = require('../controllers/tiposInsumo')

const router = Router()

router.get('/', obtenerTiposInsumos)
router.post('/', crearTipoInsumo)
router.put('/:id', actualizarTipoInsumo)
router.delete('/:id', eliminarTipoInsumo)

module.exports = router
