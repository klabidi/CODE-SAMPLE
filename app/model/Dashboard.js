Ext.define("Eagle.model.Dashboard", {
    extend: "Ext.data.Model",
    
    fields: [
        {name: "placa", type: "string"},
        {name: "andando", type: "int"},
        {name: "parado", type: "int"},
        {name: "desligado", type: "int"},
        {name: "velocidade", type: "int"},
        {name: "distancia", type: "int"},
        {name: "horimetro", type: "int"},
        {name: "litros", type: "number"},
        {name: "consumo", type: "number"}
    ],
    idProperty: "placa"
});

