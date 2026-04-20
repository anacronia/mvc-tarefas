// =====================================================
//  MOCK do pool_conexoes.js — SEM banco de dados
//  Substitua o arquivo config/pool_conexoes.js por este
//  para rodar o projeto sem MySQL instalado.
// =====================================================

// Dados falsos em memória (simulando a tabela 'tarefas')
let tabelaTarefas = [
    { id_tarefa: 1, nome_tarefa: "Formatar PC do Cliente 1",            prazo_tarefa: new Date("2022-06-25"), situacao_tarefa: 1, status_tarefa: 1 },
    { id_tarefa: 2, nome_tarefa: "Instalar Antivirus no PC do Cliente 2", prazo_tarefa: new Date("2022-06-20"), situacao_tarefa: 1, status_tarefa: 1 },
    { id_tarefa: 3, nome_tarefa: "Formatar PC do Cliente 2",             prazo_tarefa: new Date("2022-06-28"), situacao_tarefa: 1, status_tarefa: 1 },
    { id_tarefa: 4, nome_tarefa: "Instalar Antivirus no PC do Cliente 3", prazo_tarefa: new Date("2022-06-22"), situacao_tarefa: 1, status_tarefa: 1 },
];

let proximoId = 5;

// Interpreta a query SQL e executa sobre os dados em memória
function executarQuery(sql, params = []) {
    const sqlLimpo = sql.replace(/\s+/g, " ").trim().toLowerCase();

    // SELECT *
    if (sqlLimpo.startsWith("select * from tarefas where status_tarefa = 1 and id_tarefa")) {
        const id = parseInt(params[0]);
        const resultado = tabelaTarefas.filter(t => t.status_tarefa === 1 && t.id_tarefa === id);
        return [resultado, []];
    }

    if (sqlLimpo.startsWith("select * from tarefas where status_tarefa = 1")) {
        const resultado = tabelaTarefas.filter(t => t.status_tarefa === 1);
        return [resultado, []];
    }

    // INSERT
    if (sqlLimpo.startsWith("insert into tarefas")) {
        const nova = {
            id_tarefa: proximoId++,
            nome_tarefa: params[0],
            prazo_tarefa: new Date(params[1]),
            situacao_tarefa: params[2] !== undefined ? parseInt(params[2]) : 1,
            status_tarefa: 1,
        };
        tabelaTarefas.push(nova);
        return [{ insertId: nova.id_tarefa, affectedRows: 1 }, []];
    }

    // UPDATE nome/prazo/situacao (edição)
    if (sqlLimpo.startsWith("update  tarefas set `nome_tarefa`") || sqlLimpo.startsWith("update tarefas set `nome_tarefa`")) {
        const id = parseInt(params[3]);
        const tarefa = tabelaTarefas.find(t => t.id_tarefa === id);
        if (tarefa) {
            tarefa.nome_tarefa     = params[0];
            tarefa.prazo_tarefa    = new Date(params[1]);
            tarefa.situacao_tarefa = parseInt(params[2]);
        }
        return [{ affectedRows: tarefa ? 1 : 0 }, []];
    }

    // UPDATE soft delete (status_tarefa = 0)
    if (sqlLimpo.includes("set status_tarefa = 0")) {
        const id = parseInt(params[0]);
        const tarefa = tabelaTarefas.find(t => t.id_tarefa === id);
        if (tarefa) tarefa.status_tarefa = 0;
        return [{ affectedRows: tarefa ? 1 : 0 }, []];
    }

    // DELETE físico
    if (sqlLimpo.startsWith("delete from tarefas")) {
        const id = parseInt(params[0]);
        const antes = tabelaTarefas.length;
        tabelaTarefas = tabelaTarefas.filter(t => t.id_tarefa !== id);
        return [{ affectedRows: antes - tabelaTarefas.length }, []];
    }

    console.warn("[MOCK] Query não reconhecida:", sql);
    return [[], []];
}

// Objeto que imita a interface do mysql2 (pool.query)
const poolMock = {
    query: async (sql, params = []) => {
        return executarQuery(sql, params);
    }
};

module.exports = poolMock;
