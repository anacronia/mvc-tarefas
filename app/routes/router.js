var express = require("express");
var router = express.Router();
const { tarefasModel } = require("../models/tarefasModel"); //usar sempre o {}
const moment = require("moment");
moment.locale('pt-br');

router.get("/", async function (req, res) {
    res.locals.moment = moment;
    try {
        const result = await tarefasModel.findAll();
        console.log(result)
        res.render("pages/index", { listaTarefas: result })
    } catch (erro) {
        console.log(erro);
    }
});


router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro",
        {
            tituloPagina: "Cadastro de Tarefas", tituloAba: "Cadastro",
            tarefa: {
                id_tarefa: 0, nome_tarefa: "",
                prazo_tarefa: "", situacao_tarefa: 1
            }
        });
});

router.post("/manter-tarefa", async (req, res) => {
    const objDados = {
        id : req.body.id,
        nome: req.body.nome,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    }

    try {
        if(objDados.id == 0){
            const result = await tarefasModel.create(objDados);  
        }else{
            const result = await tarefasModel.update(objDados);  
        }
        
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
})


router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    //recuperando a querystring
    const id = req.query.id;
    try {
        const result = await tarefasModel.findById(id);
        res.render("pages/cadastro",
            {
                tituloPagina: "Alterar Tarefa", tituloAba: "Edição de Tarefa",
                tarefa: result[0]
            });
    } catch (erro) {
        console.log(erro)
    }

});


router.get("/teste-insert", async (req, res) => {

    const objDados = {
        nome: "limpar gabinete PC",
        prazo: "2026-03-23"
    }
    try {
        const result = await tarefasModel.create(objDados);
        res.send(result);
    } catch (erro) {
        console.log(erro);
    }
});

//exclusão física - hard delete
router.get("/teste-delete", async (req, res) => {
    let id = 3;
    try {
        const result = await tarefasModel.destroy(id);
        res.send(result);
    } catch (erro) {
        console.log(erro);
    }
})

//exclusão lógica - soft delete
router.get("/teste-delete-logico", async (req, res) => {
    let id = 4;
    try {
        const result = await tarefasModel.softDelete(id);
        res.send(result);
    } catch (erro) {
        console.log(erro);
    }
})

//exclusão lógica via botão na tabela
router.get("/excluir", async (req, res) => {
    const id = req.query.id;
    try {
        const result = await tarefasModel.softDelete(id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
})




module.exports = router;