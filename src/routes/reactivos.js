const { Router } = require('express')

const {
  obtenerReactivos,
  obtenerReactivo,
  crearReactivo,
  actualizarReactivo,
  eliminarReactivo
} = require('../controllers/reactivos')

const router = Router()

router.get('/', obtenerReactivos)
router.get('/:id', obtenerReactivo)
router.post('/', crearReactivo)
router.put('/:id', actualizarReactivo)
router.delete('/:id', eliminarReactivo)

module.exports = router
