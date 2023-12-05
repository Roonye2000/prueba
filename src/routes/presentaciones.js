const { Router } = require('express')

const {
  obtenerPresentaciones,
  crearPresentacion,
  actualizarPresentacion,
  eliminarPresentacion
} = require('../controllers/presentaciones')

const router = Router()

router.get('/', obtenerPresentaciones)
router.post('/', crearPresentacion)
router.put('/:id', actualizarPresentacion)
router.delete('/:id', eliminarPresentacion)

module.exports = router
