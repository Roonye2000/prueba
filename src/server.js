const express = require('express')
const cors = require('cors')

class Server {
  constructor() {
    this.app = express.Router()
    this.router = express.Router()
    this.port = process.env.PORT
    this.paths = {
      costos: '/costos',
      bienes: '/bienes',
      empresa: '/empresa',
      insumos: '/insumos',
      usuarios: '/usuarios',
      formatos: '/formatos',
      reactivos: '/reactivos',
      tiposInsumo: '/tiposInsumo',
      presentaciones: '/presentaciones',
    }
    // this.conectarDB()
    this.middlewares()
    this.routes()
    this.router.use('/api', this.app)
    this._express = express().use(this.router)
  }
  
  middlewares(){
    this.app.use(cors());
    this.app.use(express.json());
  }

  // Definir las rutas
  routes() {
    this.app.use(this.paths.costos, require('./routes/costos'))
    this.app.use(this.paths.bienes, require('./routes/bienes'))
    this.app.use(this.paths.empresa, require('./routes/empresa'))
    this.app.use(this.paths.insumos, require('./routes/insumos'))
    this.app.use(this.paths.usuarios, require('./routes/usuarios'))
    this.app.use(this.paths.formatos, require('./routes/formatos'))
    this.app.use(this.paths.reactivos, require('./routes/reactivos'))
    this.app.use(this.paths.tiposInsumo, require('./routes/tiposInsumo'))
    this.app.use(this.paths.presentaciones, require('./routes/presentaciones'))
  }

  // Iniciar el servidor
  listen(){
    this._express.listen(this.port, () => {
      console.log(`Server on port: ${this.port}`);
    })
  }
}

module.exports = Server
