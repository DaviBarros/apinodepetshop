const Modelo = require('./ModeloTabelaProduto') 
const instancia = require('../../../database')
const NaoEncontrado = require('../../../erros/NaoEncontrado')

module.exports = {
    listar(idFornecedor){
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        })
    },

    inserir(dados){
        return Modelo.create(dados)
    },

    remover(idProduto){
        
        return Modelo.destroy({
            where: {
                id: idProduto
               
            }
        })

    },

    async pegarPorId(idProduto){
        const encontrado = await Modelo.findOne({
            where: {
               id: idProduto 
            },
            raw: true
        })

        if(!encontrado){
            throw new NaoEncontrado('Produto')
        }

        return encontrado
    },

    atualizar(dadosDoProduto, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
           
        )
    },

    subtrairEstoque(idProduto, campo, quantidade){
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto
                }               
            })

            produto[campo] = quantidade
            await produto.save()
            return produto

        })
    }


}