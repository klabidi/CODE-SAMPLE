Ext.define("Eagle.store.VeiculosLimites", {
    extend: "Ext.data.Store",
    model: "Eagle.model.VeiculoLimite",
    
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/veiculoslimites.php?action=criar",
            read: "php/veiculoslimites.php?action=listar",
            update: "php/veiculoslimites.php?action=criar"
        },
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        writer: {
            type: "json",
            writeAllFields: true,
            encode: true,
            rootProperty: "data"
        }
    }
});