Ext.define("Eagle.model.Telefone", {
    extend: "Ext.data.Model",
    fields: [
        {name: "empresa", reference: "Empresa"},
        {name: "numero", type: "string"}
    ]
});