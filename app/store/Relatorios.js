Ext.define("Eagle.store.Relatorios", {
    extend: "Ext.data.Store",
    fields: ["id", "title", "subtitle", "url", "xtype"],
    autoLoad: false,
    
    proxy: {
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/relatorios.php?action=listar"
    }
});