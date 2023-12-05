const { Router } = require('express')

const {
  obtenerFormatos,
  obtenerFormato,
  crearFormato,
  actualizarFormato,
  eliminarFormato
} = require('../controllers/formatos')

const router = Router()

router.get('/', obtenerFormatos)
router.get('/:id', obtenerFormato)
router.post('/', crearFormato)
router.put('/:id', actualizarFormato)
router.delete('/:id', eliminarFormato)

module.exports = router
