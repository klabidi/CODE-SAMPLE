Ext.define("Eagle.store.Situacoes", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Situacao",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/situacoes.php?action=criar",
            read: "php/situacoes.php?action=listar",
            update: "php/situacoes.php?action=alterar",
            destroy: "php/situacoes.php?action=excluir"
        },
        actionMethods: {
            read: 'POST'
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
    }]
});