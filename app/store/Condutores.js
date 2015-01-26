Ext.define("Eagle.store.Condutores",{
    extend: "Ext.data.Store",
    model: "Eagle.model.Condutor",
    remoteSort: false,
    pageSize: 20,
    autoLoad: false,
    proxy: {
        type: "ajax",
        api: {
            create: "php/condutores.php?action=adicionar",
            read: "php/condutores.php?action=listar",
            update: "php/condutores.php?action=alterar",
            destroy: "php/condutores.php?action=excluir"
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