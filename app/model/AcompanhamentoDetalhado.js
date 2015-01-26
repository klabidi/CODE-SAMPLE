Ext.define("Eagle.model.AcompanhamentoDetalhado", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "placa", type: "string"},
        {name: "situacao", type: "string"},
        {name: "data_inicio", type: "string"},
        {name: "data_fim", type: "string"},
        {name: "evento", type: "string"},
        {name: "mensagem", type: "string"},
        {name: "usuario", type: "string"},
        {name: "parametro", type: "string"}
    ]
});

