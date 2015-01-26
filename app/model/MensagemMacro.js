Ext.define("Eagle.model.MensagemMacro", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "macro", type: "string"},
        {name: "mensagem", type: "string"}
    ],
    idProperty: "mensagem"
});