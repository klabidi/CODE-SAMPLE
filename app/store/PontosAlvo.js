Ext.define("Eagle.store.PontosAlvo", {
    extend: "Ext.data.Store",
    model: "Eagle.model.PontoAlvo",
    
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/pontosalvo.php?action=adicionaroualterar",
            read: "php/pontosalvo.php?action=listar",
            update: "php/pontosalvo.php?action=adicionaroualterar",
            destroy: "php/pontosalvo.php?action=excluir"
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
    },
    sorters: [{
        property: "placa",
        direction: "ASC"
    },{
        property: "referencia",
        direction: "ASC"
    }]
});