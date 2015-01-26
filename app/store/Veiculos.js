Ext.define("Eagle.store.Veiculos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Veiculo",
    remoteSort: false,
    pageSize: 20,
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/veiculos.php?action=adicionar",
            read: "php/veiculos.php?action=listar",
            update: "php/veiculos.php?action=alterar"
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