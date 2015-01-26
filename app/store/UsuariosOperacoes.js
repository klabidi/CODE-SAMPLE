Ext.define("Eagle.store.UsuariosOperacoes", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Usuario",
    autoLoad: false,
    proxy: {
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        type: "ajax",
        url: "php/operacoes.php?action=listarUsuarios"
    }
});