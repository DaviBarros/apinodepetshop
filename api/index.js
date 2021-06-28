const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const cors = require('cors');


const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro


app.use(bodyParser.json());

app.use((req,res,proximo) => {
    let formatoRequisitado = req.header('Accept')      
    
    if(formatoRequisitado === '*/*'){
        formatoRequisitado = 'application/json'        
    }

    if(formatosAceitos.indexOf(formatoRequisitado) === -1){
        res.status(406)
        res.end()
        return
    } 

    res.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((req, res, proximo) => {
    
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods",'GET,PUT,POST,DELETE,HEAD')
    res.header("Access-Control-Allow-Headers",'Content-Type')

    app.use(cors())
    proximo()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador);

const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2);

app.use((error, req, res, proximo) => {
    let status = 500

    if (error instanceof NaoEncontrado) {
        status = 404
    } 

    if(error instanceof CampoInvalido || error instanceof DadosNaoFornecidos){
        status = 400       
    }    

    if(error instanceof ValorNaoSuportado){
        status = 406
    }

    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )
    res.status(status)

    res.send(
        serializador.serializar({
            mensagem: error.message,
            id: error.idErro
        })
    )

})

app.listen(config.get('api.porta'), () => {
    console.log('API funcionando')
})