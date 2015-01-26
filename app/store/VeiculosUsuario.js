Ext.define("Eagle.store.VeiculosUsuario", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Veiculo",
    autoLoad: false,
    proxy: {
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/veiculos.php?action=listarUsuarioCompleto"
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});