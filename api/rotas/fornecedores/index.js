const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req,res) => {
   res.header("Access-Control-Allow-Methods",'GET,POST')
   res.header("Access-Control-Allow-Headers",'Content-Type')
   res.status(204)
   res.end()
})

roteador.get('/', async (req, res) => {
   const resultados = await TabelaFornecedor.listar()
   const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type'),
      ['empresa']
   )
   res.status(200)
   res.send(
      serializador.serializar(resultados)
   )
})

roteador.post('/', async (req, res, proximo) => {

   try {

      const dadosRecebidos = req.body
      const fornecedor = new Fornecedor(dadosRecebidos)
      await fornecedor.criar()
      res.status(201)
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type'),
         ['empresa']
      )
      res.send(
         serializador.serializar(fornecedor)
      )

   } catch (error) {
      
      proximo(error)

   }

})

roteador.options('/:idFornecedor', (req,res) => {
   res.header("Access-Control-Allow-Methods",'GET,PUT,DELETE')
   res.header("Access-Control-Allow-Headers",'Content-Type')
   res.status(204)
   res.end()
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {


   try {

      const id = req.params.idFornecedor
      const fornecedor = new Fornecedor({ id: id })
      await fornecedor.carregar()
      res.status(200)
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type'),
         ['email','empresa','dataCriacao','dataAtualizacao','versao']
      )
      res.send(
         serializador.serializar(fornecedor)
      )

   } catch (error) {
      proximo(error)
   }
})

roteador.put('/:idFornecedor', async (req, res, proximo) => {


   try {

      const id = req.params.idFornecedor
      const dadosRecebidos = req.body
      const dados = Object.assign({}, dadosRecebidos, { id: id })
      const fornecedor = new Fornecedor(dados)
      await fornecedor.atualizar()
      res.status(204)
      res.end()

   } catch (error) {
     
      proximo(error)

   }

})

roteador.delete('/:idFornecedor', async (req, res, proximo) => {

   try {

      const id = req.params.idFornecedor
      const fornecedor = new Fornecedor({ id: id })
      await fornecedor.carregar()
      await fornecedor.remover()
      res.status(204)
      res.end()

   } catch (error) {
      proximo(error)
   }
})

const roteadorProdutos = require('./produtos')

const verificarFornecedor = async(req,res,proximo) => {
   try {

      const id = req.params.id
      const fornecedor = new Fornecedor({ id: id})
      await fornecedor.carregar()
      req.fornecedor = fornecedor
      proximo()

   } catch (error) {
      proximo(error)
   }
}


roteador.use('/:id/produtos', verificarFornecedor,roteadorProdutos)

module.exports = roteador