const { Router } = require('express')

const {
  obtenerInsumos,
  obtenerInsumo,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
} = require('../controllers/insumos')

const router = Router()

router.get('/', obtenerInsumos)
router.get('/:id', obtenerInsumo)
router.post('/', crearInsumo)
router.put('/:id', actualizarInsumo)
router.delete('/:id', eliminarInsumo)

module.exports = router
