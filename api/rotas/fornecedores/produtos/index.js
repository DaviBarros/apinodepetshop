const roteador = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto


roteador.options('/', (req,res) => {
    res.header("Access-Control-Allow-Methods",'GET,POST')
    res.header("Access-Control-Allow-Headers",'Content-Type')
    res.status(204)
    res.end()
 })

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(
        res.getHeader('Content-Type')
    )
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {

    try {

        const id = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, { fornecedor: id })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
            res.getHeader('Content-Type')
        )
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location',`/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        res.status(201)
        res.send(serializador.serializar(produto))

    } catch (error) {
        proximo(error)
    }

})

roteador.options('/:id', (req,res) => {
    res.header("Access-Control-Allow-Methods",'DELETE,GET,HEAD,PUT')
    res.header("Access-Control-Allow-Headers",'Content-Type')
    res.status(204)
    res.end()
 })

roteador.delete('/:id', async (req, res) => {


    const dados = {
        id: req.fornecedor.id

    }

    console.log(dados)

    const produto = new Produto(dados)
    await produto.apagar()
    res.status(204)
    res.end()

})

roteador.get('/:id', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.id
        }

        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'dataCriacao', 'dataAtualizacao', 'versao']
        )

        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)        
        res.send(
            serializador.serializar(produto)
        )
    } catch (error) {
        proximo(error)
    }
})

roteador.head('/:id', async(req, res, proximo) => {

    try {
        const dados = {
            id: req.params.id
        }

        const produto = new Produto(dados)
        await produto.carregar()
        
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)        
        res.status(200)
        res.end()
    } catch (error) {
        proximo(error)
    }

})

roteador.put('/:id', async (req, res, proximo) => {
    try {
        const dados = Object.assign(
            {},
            req.body,
            {
                id: req.params.id
            }
        )

        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)        
        res.status(204)
        res.end()

    } catch (error) {
        proximo(error)
    }

})

roteador.options('/:id/diminuir-estoque', (req,res) => {
    res.header("Access-Control-Allow-Methods",'POST')
    res.header("Access-Control-Allow-Headers",'Content-Type')
    res.status(204)
    res.end()
 })

roteador.post('/:id/diminuir-estoque', async (req, res, proximo) => {

    try {
        const produto = new Produto({
            id: req.params.id
        })

        await produto.carregar()

        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)      
        res.status(204)
        res.end()

    } catch (error) {
        proximo(error)
    }

})

module.exports = roteador