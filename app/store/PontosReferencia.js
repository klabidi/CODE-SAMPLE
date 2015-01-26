Ext.define("Eagle.store.PontosReferencia", {
    extend: "Ext.data.Store",
    model: "Eagle.model.PontoReferencia",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/pontosreferencia.php?action=criar",
            read: "php/pontosreferencia.php?action=listar",
            update: "php/pontosreferencia.php?action=alterar",
            destroy: "php/pontosreferencia.php?action=excluir"
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
        direction: "ASC",
        property: "descricao"
    }],
    groupField: "grupoDescricao"
});