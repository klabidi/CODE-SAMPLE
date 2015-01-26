Ext.define("Eagle.store.Usuarios",{
    extend: "Ext.data.Store",
    model: "Eagle.model.Usuario",
    remoteSort: false,
    pageSize: 20,
    autoLoad: false,
    proxy: {
        type: "ajax",
        api: {
            create: "php/usuarios.php?action=adicionar",
            read: "php/usuarios.php?action=listar",
            update: "php/usuarios.php?action=alterar",
            destroy: "php/usuarios.php?action=excluir"
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