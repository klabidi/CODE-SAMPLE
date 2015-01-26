Ext.define("Eagle.model.GrupoPontoReferencia", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "idReferenciaGrupo", type: "int"},
        {name: "nome", type: "string"}
    ],
    idProperty: "idReferenciaGrupo"
});