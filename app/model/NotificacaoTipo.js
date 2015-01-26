Ext.define("Eagle.model.NotificacaoTipo", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idTipo", type: "int"},
        {name: "nome", type: "string"}
    ],
    idProperty: "idTipo"
});