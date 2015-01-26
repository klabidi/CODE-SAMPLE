Ext.define("Eagle.model.Cidade", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idCidade", type: "int"},
        {name: "nome", type: "string"},
        {name: "estado", reference: "Estado"}
    ],
    idProperty: "idCidade"
});