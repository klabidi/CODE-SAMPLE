Ext.define("Eagle.model.PontoReferenciaGrupo", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "idReferenciaGrupo", type: "int"},
        {name: "nome", type: "string"}
    ],
    idProperty: "idReferenciaGrupo"
});