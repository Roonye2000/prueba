const { Router } = require('express')

const {
  obtenerInfoEmpresa,
  actualizarInfoEmpresa
} = require('../controllers/empresa')

const router = Router()

router.get('/', obtenerInfoEmpresa)
router.put('/:id', actualizarInfoEmpresa)

module.exports = router
