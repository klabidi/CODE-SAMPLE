Ext.define("Eagle.store.VeiculosTeclado", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Veiculo",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/teclados.php?action=listarVeiculosTeclado",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});