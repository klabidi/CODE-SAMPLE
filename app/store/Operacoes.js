Ext.define("Eagle.store.Operacoes", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Operacao",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/operacoes.php?action=criar",
            read: "php/operacoes.php?action=listar",
            update: "php/operacoes.php?action=alterar",
            destroy: "php/operacoes.php?action=excluir"
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
    }
});