Ext.define("Eagle.store.Acompanhamentos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Acompanhamento",
    
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
        url: "php/acompanhamento.php?action=listar"
        
    },
    sorters: [{
        direction: "DESC",
        property: "data_inicio"
    }]
});