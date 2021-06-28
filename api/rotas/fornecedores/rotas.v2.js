const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor


roteador.options('/', (req,res) => {
    res.header("Access-Control-Allow-Methods",'GET')
    res.header("Access-Control-Allow-Headers",'Content-Type')
    res.status(204)
    res.end()
 })

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(
       res.getHeader('Content-Type')
    )
    res.status(200)
    res.send(
       serializador.serializar(resultados)
    )
 })
 


module.exports = roteador