Ext.define("Eagle.store.PermissoesGrupos",{
    extend: "Ext.data.Store",
    model: "Eagle.model.PermissaoGrupo",
    autoLoad: false,
    proxy: {
        type: "ajax",
        api: {
            read: "php/permissoes.php?action=listarGrupo"
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