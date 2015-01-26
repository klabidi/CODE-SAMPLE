Ext.define("Eagle.model.MensagemHistorico", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "enviado", type: "string"}, 
        {name: "recebido", type: "string"},
        {name: "data", type: "string"},
        {name: "mensagem", type: "string"}
    ]
});