Ext.define("Eagle.store.Rotas", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Rota",
    autoLoad: false,
    pageSize: 0,
    proxy: {
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/rotas.php?action=listarVeiculos"
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});