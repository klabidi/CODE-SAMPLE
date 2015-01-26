Ext.define("Eagle.store.VeiculosOperacoes", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Veiculo",
    autoLoad: false,
    proxy: {
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/operacoes.php?action=listarVeiculos"
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});