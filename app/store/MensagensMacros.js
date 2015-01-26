Ext.define("Eagle.store.MensagensMacros", {
    extend: "Ext.data.Store",
    model: "Eagle.model.MensagemMacro",
    
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
        url: "php/teclados.php?action=listarMacros"
        
    },
    sorters: [{
        direction: "ASC",
        property: "mensagem"
    }]
});