Ext.define("Eagle.model.DirecaoRoteirizacao", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "descricao", type: "string"},
        {name: "latitude", type: "float"},
        {name: "longitude", type: "float"},
        {name: "ordem", type: "int"}
    ]
});