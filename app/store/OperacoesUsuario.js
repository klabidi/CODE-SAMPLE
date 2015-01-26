Ext.define("Eagle.store.OperacoesUsuario", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Operacao",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "",
            read: "php/usuarios.php?action=listarOperacoes",
            update: "",
            destroy: ""
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
        property: "nome"
    }]
});