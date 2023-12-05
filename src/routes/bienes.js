const { Router } = require('express')

const {
  obtenerBienes,
  obtenerBien,
  crearBien,
  actualizarBien,
  eliminarBien
} = require('../controllers/bienes')

const router = Router()

router.get('/', obtenerBienes)
router.get('/:id', obtenerBien)
router.post('/', crearBien)
router.put('/:id', actualizarBien)
router.delete('/:id', eliminarBien)

module.exports = router
