Ext.define("Eagle.model.Condutor", {
    extend: "Ext.data.Model",
    fields: [
        {name: "idCondutor", type: "int"},
        {name: "cpf", type: "string"},
        {name: "rg", type: "string"},
        {name: "telefone", type: "string"},
        {name: "celular", type: "string"},
        {name: "data_nascimento", type: "date"},
        {name: "matricula", type: "string"},
        {name: "empresa", type: "string"},
        {name: "empresaId", type: "string"},
        {name: "ativo", reference: "ativo"}, 
        {name: "placa", type: "string"}
    ],
    idProperty: "idCondutor"
});