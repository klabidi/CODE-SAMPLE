Ext.define("Eagle.store.Comandos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Comando",
    
    autoLoad: false,
    pageSize: 0,
    proxy: {
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/veiculos.php?action=listarComandos"
    },
    sorters: [{
        direction: "ASC",
        property: "descricao"
    }]
});