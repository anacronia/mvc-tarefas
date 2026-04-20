//requisição do pool de conexões
const pool = require("../../config/pool_conexoes");
//objeto com funções de acesso ao SGBD
const tarefasModel = {
    //funções para usar o SQL
    findAll: async ()=>{
        try{
            const [linhas] = await pool.query("select * from tarefas where status_tarefa = 1");
            return linhas;
        }catch(erro){
            return erro;
        }
    },
    
    findById: async (id)=>{
        try{
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and id_tarefa = ? ",
                [id]
            );
            return linhas;
        }catch(erro){
            return erro;
        }
    },

    create: async (dados)=>{
        /*
            formato json
            {
                nome:"nome da tarefa",
                prazo:"data mysql",
                situacao:"cod situação",
            }
        */
       try{
            const [result] = await pool.query(
                "insert into tarefas(`nome_tarefa`,`prazo_tarefa`,`situacao_tarefa`) "
                + "values(?,?,?)",
                [dados.nome, dados.prazo, dados.situacao]
            )
            return result;
       }catch(erro){
        return erro;
       }
    },

    // UPDATE - Todos os campos
    update: async (dados)=>{
        /*
            formato json
            {
                id: 9 
                nome:"nome da tarefa",
                prazo:"data mysql",
                situacao:"cod situação",
            }
        */
       try{
            const [result] = await pool.query(
                "update  tarefas set `nome_tarefa`= ? ,`prazo_tarefa`= ?,`situacao_tarefa`= ? "
                + " where id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]
            )
            return result;
       }catch(erro){
        return erro;
       }
    },


    
    // DELETE - físico (hard delete)
    destroy: async (id) => {
        try {
            const [result] = await pool.query(
                "delete from tarefas where id_tarefa = ?",
                [id]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

    // DELETE - lógico (soft delete)
    softDelete: async (id) => {
        try {
            const [result] = await pool.query(
                "update tarefas set status_tarefa = 0 where id_tarefa = ?",
                [id]
            );
            return result;
        } catch (erro) {
            return erro;
        }
    },

}

//exportar o objeto como um módulo do JS
module.exports = {tarefasModel} 